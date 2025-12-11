import Head from "next/head";
import Link from "next/link";
import { useTheme } from "@contexts/ThemeContext";
import WindowPage from "@components/WindowLayout/WindowPage";
import {
  VscGithub,
  VscCode,
  VscRepoForked,
  VscSearch,
  VscFilter,
} from "react-icons/vsc";
import { AiOutlineEye, AiOutlineStar } from "react-icons/ai";
import {
  FiImage,
  FiExternalLink,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useEffect, useState, useMemo } from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  language?: string | null;
  stars?: number | null;
  forks?: number | null;
  url?: string;
  homepage?: string | null;
  previewImage?: string | null;
  manual?: boolean;
  readmeImages?: string[];
  hasReadmeImages?: boolean;
}

type SortOption = "name" | "stars" | "recent";

export default function Projects() {
  const { colors } = useTheme();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const [previewModal, setPreviewModal] = useState({
    open: false,
    loading: false,
    project: null as Project | null,
    content: null as string | null,
    type: null as "image" | "iframe" | null,
    blocked: false,
  });

  const [galleryModal, setGalleryModal] = useState({
    open: false,
    loading: false,
    images: [] as string[],
    index: 0,
    project: null as Project | null,
  });

  const repoUrls = [
    "https://github.com/GuickerZ/RifaTurma",
    "https://github.com/GuickerZ/GuiaIFPE",
    "https://github.com/GuickerZ/VSC-Portfolio",
    "https://github.com/GuickerZ/sistema-poo-eda",
  ];

  const manualProjects: Project[] = [];
  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      setLoading(true);

      try {
        const fetchPromises = repoUrls.map(async (url) => {
          try {
            const repoRes = await fetch(
              `/api/fetchRepo?url=${encodeURIComponent(url)}`,
            );

            if (repoRes.status === 403 || repoRes.status === 429) {
              const repoName = url.split("/").pop() || "Projeto";
              return {
                id: Math.random(),
                name: repoName,
                description:
                  "Projeto temporariamente indisponível (limite da API)",
                language: null,
                stars: null,
                forks: null,
                url: url,
                homepage: null,
                previewImage: null,
                manual: false,
                readmeImages: [],
                hasReadmeImages: false,
              } as Project;
            }

            const repoData = repoRes.ok ? await repoRes.json() : null;

            if (repoData?.error) {
              const repoName = url.split("/").pop() || "Projeto";
              return {
                id: Math.random(),
                name: repoName,
                description: repoData.error.includes("rate")
                  ? "Limite da API atingido"
                  : "Projeto indisponível",
                language: null,
                stars: null,
                forks: null,
                url: url,
                homepage: null,
                previewImage: null,
                manual: false,
                readmeImages: [],
                hasReadmeImages: false,
              } as Project;
            }

            let images: string[] = [];
            try {
              const imgRes = await fetch(
                `/api/fetchReadmeImages?url=${encodeURIComponent(url)}`,
              );
              if (imgRes.ok) {
                const imgData = await imgRes.json();
                images = imgData.images || [];
              }
            } catch {
              // Silenciar erro de imagens
            }

            return {
              id: Math.random(),
              name: repoData?.name || url.split("/").pop() || "Projeto",
              description: repoData?.description || "Sem descrição",
              language: repoData?.language || null,
              stars: repoData?.stars ?? null,
              forks: repoData?.forks ?? null,
              url: repoData?.url || url,
              homepage: repoData?.homepage || null,
              previewImage: repoData?.previewImage || null,
              manual: false,
              readmeImages: images,
              hasReadmeImages: images.length > 0,
            } as Project;
          } catch {
            const repoName = url.split("/").pop() || "Projeto";
            return {
              id: Math.random(),
              name: repoName,
              description: "Erro ao carregar projeto",
              language: null,
              stars: null,
              forks: null,
              url: url,
              homepage: null,
              previewImage: null,
              manual: false,
              readmeImages: [],
              hasReadmeImages: false,
            } as Project;
          }
        });

        const results = await Promise.all(fetchPromises);
        const validProjects = results.filter(Boolean) as Project[];

        if (mounted) {
          setProjects([...manualProjects, ...validProjects]);
          setError(null);
        }
      } catch {
        if (mounted) {
          setProjects(manualProjects);
          setError("Erro ao carregar projetos. Tente novamente mais tarde.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      mounted = false;
    };
  }, []);

  // Linguagens únicas para filtro
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach((p) => {
      if (p.language) langs.add(p.language);
    });
    return ["all", ...Array.from(langs)];
  }, [projects]);

  // Filtrar e ordenar projetos
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLanguage =
        selectedLanguage === "all" || p.language === selectedLanguage;
      return matchSearch && matchLanguage;
    });

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === "stars") return (b.stars || 0) - (a.stars || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // "recent" mantém ordem original
    });

    return filtered;
  }, [projects, searchTerm, selectedLanguage, sortBy]);

  // Abrir preview
  const openPreview = async (project: Project) => {
    setPreviewModal({
      open: true,
      loading: true,
      project,
      content: null,
      type: null,
      blocked: false,
    });

    // PRIORIDADE 1: Se tiver homepage/site, SEMPRE usar ele
    if (project.homepage) {
      setPreviewModal((prev) => ({
        ...prev,
        loading: false,
        content: project.homepage!,
        type: "iframe",
      }));
      return;
    }

    // PRIORIDADE 2: Imagens do README (se não tiver site)
    if (
      project.hasReadmeImages &&
      project.readmeImages &&
      project.readmeImages.length > 0
    ) {
      setPreviewModal((prev) => ({
        ...prev,
        loading: false,
        content: project.readmeImages![0],
        type: "image",
      }));
      return;
    }

    // PRIORIDADE 3: Preview image do GitHub
    if (project.previewImage) {
      setPreviewModal((prev) => ({
        ...prev,
        loading: false,
        content: project.previewImage!,
        type: "image",
      }));
      return;
    }

    // PRIORIDADE 4: Fallback - abrir GitHub
    if (project.url) {
      window.open(project.url, "_blank", "noopener,noreferrer");
      setPreviewModal({
        open: false,
        loading: false,
        project: null,
        content: null,
        type: null,
        blocked: false,
      });
    }
  };

  const closePreview = () => {
    setPreviewModal({
      open: false,
      loading: false,
      project: null,
      content: null,
      type: null,
      blocked: false,
    });
  };

  // Abrir galeria
  const openGallery = async (project: Project) => {
    setGalleryModal({
      open: true,
      loading: true,
      images: [],
      index: 0,
      project,
    });

    if (project.readmeImages && project.readmeImages.length > 0) {
      setGalleryModal((prev) => ({
        ...prev,
        loading: false,
        images: project.readmeImages!,
      }));
      return;
    }

    // Buscar via API
    try {
      const safeUrl = project.url ?? "";
      const res = await fetch(
        `/api/fetchReadmeImages?url=${encodeURIComponent(safeUrl)}`,
      );
      if (res.ok) {
        const data = await res.json();
        const imgs = data.images || [];
        setGalleryModal((prev) => ({ ...prev, loading: false, images: imgs }));

        // Atualizar projeto no estado
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id
              ? { ...p, readmeImages: imgs, hasReadmeImages: imgs.length > 0 }
              : p,
          ),
        );
      } else {
        setGalleryModal((prev) => ({ ...prev, loading: false, images: [] }));
      }
    } catch (err) {
      console.error("Erro ao carregar galeria:", err);
      setGalleryModal((prev) => ({ ...prev, loading: false, images: [] }));
    }
  };

  const closeGallery = () => {
    setGalleryModal({
      open: false,
      loading: false,
      images: [],
      index: 0,
      project: null,
    });
  };

  // Helper: cor por linguagem
  const getLanguageColor = (lang?: string | null): string => {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f7df1e",
      Python: "#3776ab",
      Java: "#b07219",
      "C++": "#f34b7d",
      Go: "#00ADD8",
      Rust: "#dea584",
      HTML: "#e34c26",
      CSS: "#563d7c",
    };
    return lang ? colors[lang] || "#808080" : "#808080";
  };

  return (
    <>
      <Head>
        <title>Projetos - Guilherme Matias | Portfólio</title>
      </Head>
      <WindowPage>
        <div className="flex flex-col gap-6 pb-4">
          <div className="flex items-center gap-3">
            <VscCode
              className="shrink-0 text-2xl"
              style={{ color: colors.accent.primary }}
            />
            <div className="min-w-0">
              <h1
                className="truncate text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Meus Projetos
              </h1>
              <p className="text-xs" style={{ color: colors.text.tertiary }}>
                {filteredProjects.length} projeto
                {filteredProjects.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {error && (
            <div
              className="rounded-lg p-3 text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                borderColor: "rgba(239, 68, 68, 0.3)",
                borderWidth: "1px",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-2 rounded-lg p-2 transition-all focus-within:ring-2"
              style={{
                backgroundColor: colors.bg.secondary,
                borderColor: colors.border,
                borderWidth: "1px",
              }}
            >
              <VscSearch
                className="shrink-0"
                style={{ color: colors.text.tertiary }}
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: colors.text.primary }}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="min-w-0 flex-1 rounded-md px-2 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: colors.bg.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border,
                  borderWidth: "1px",
                }}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === "all" ? "Todas" : lang}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="min-w-0 flex-1 rounded-md px-2 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: colors.bg.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border,
                  borderWidth: "1px",
                }}
              >
                <option value="recent">Recentes</option>
                <option value="stars">Estrelas</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div
                className="rounded-lg p-12 text-center"
                style={{
                  backgroundColor: colors.bg.secondary,
                  color: colors.text.tertiary,
                }}
              >
                <div className="animate-pulse">Carregando projetos...</div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div
                className="rounded-lg p-12 text-center"
                style={{
                  backgroundColor: colors.bg.secondary,
                  color: colors.text.tertiary,
                }}
              >
                Nenhum projeto encontrado
              </div>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  colors={colors}
                  onPreview={openPreview}
                  onGallery={openGallery}
                  getLanguageColor={getLanguageColor}
                />
              ))
            )}
          </div>

          <Link
            href="https://github.com/GuickerZ?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg p-4 transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: colors.bg.secondary,
              borderColor: colors.border,
              borderWidth: "1px",
            }}
          >
            <VscGithub
              className="text-2xl"
              style={{ color: colors.accent.primary }}
            />
            <span style={{ color: colors.text.primary }}>
              Ver todos no GitHub
            </span>
          </Link>
        </div>

        {previewModal.open && (
          <Modal
            onClose={closePreview}
            colors={colors}
            title="Preview do Projeto"
          >
            {previewModal.loading ? (
              <div
                className="flex h-96 items-center justify-center"
                style={{ color: colors.text.tertiary }}
              >
                Carregando preview...
              </div>
            ) : previewModal.type === "image" && previewModal.content ? (
              <img
                src={previewModal.content}
                alt="preview"
                className="max-h-[70vh] w-full rounded-lg object-contain"
              />
            ) : previewModal.type === "iframe" && previewModal.content ? (
              <div>
                <iframe
                  src={previewModal.content}
                  title="project-preview"
                  className="h-[70vh] w-full rounded-lg"
                  onError={() =>
                    setPreviewModal((p) => ({ ...p, blocked: true }))
                  }
                />
                {previewModal.blocked && (
                  <div className="mt-3">
                    <a
                      href={previewModal.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md px-4 py-2 text-sm"
                      style={{
                        backgroundColor: colors.accent.primary,
                        color: "#fff",
                      }}
                    >
                      Abrir em nova aba
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: colors.text.tertiary }}>
                Nenhum preview disponível
              </div>
            )}
          </Modal>
        )}

        {galleryModal.open && (
          <Modal
            onClose={closeGallery}
            colors={colors}
            title="Galeria de Imagens"
          >
            {galleryModal.loading ? (
              <div
                className="flex h-96 items-center justify-center"
                style={{ color: colors.text.tertiary }}
              >
                Carregando imagens...
              </div>
            ) : galleryModal.images.length === 0 ? (
              <div
                className="flex h-96 items-center justify-center"
                style={{ color: colors.text.tertiary }}
              >
                Nenhuma imagem encontrada
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="relative flex items-center justify-center">
                  <button
                    onClick={() =>
                      setGalleryModal((p) => ({
                        ...p,
                        index:
                          p.index === 0 ? p.images.length - 1 : p.index - 1,
                      }))
                    }
                    className="absolute left-0 rounded-full p-3 transition-all hover:scale-110"
                    style={{ backgroundColor: colors.bg.secondary }}
                  >
                    <FiChevronLeft style={{ color: colors.text.primary }} />
                  </button>

                  <img
                    src={galleryModal.images[galleryModal.index]}
                    alt={`${galleryModal.index + 1}`}
                    className="max-h-[60vh] rounded-lg object-contain"
                  />

                  <button
                    onClick={() =>
                      setGalleryModal((p) => ({
                        ...p,
                        index: (p.index + 1) % p.images.length,
                      }))
                    }
                    className="absolute right-0 rounded-full p-3 transition-all hover:scale-110"
                    style={{ backgroundColor: colors.bg.secondary }}
                  >
                    <FiChevronRight style={{ color: colors.text.primary }} />
                  </button>
                </div>

                <div
                  className="text-center text-sm"
                  style={{ color: colors.text.tertiary }}
                >
                  {galleryModal.index + 1} / {galleryModal.images.length}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {galleryModal.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setGalleryModal((p) => ({ ...p, index: idx }))
                      }
                      className="shrink-0 rounded-lg transition-all"
                      style={{
                        opacity: idx === galleryModal.index ? 1 : 0.5,
                        borderWidth: idx === galleryModal.index ? "2px" : "1px",
                        borderColor:
                          idx === galleryModal.index
                            ? colors.accent.primary
                            : colors.border,
                      }}
                    >
                      <img
                        src={img}
                        alt={`thumb-${idx}`}
                        className="h-16 w-20 rounded-md object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Modal>
        )}
      </WindowPage>
    </>
  );
}

function ProjectCard({
  project,
  colors,
  onPreview,
  onGallery,
  getLanguageColor,
}: {
  project: Project;
  colors: any;
  onPreview: (p: Project) => void;
  onGallery: (p: Project) => void;
  getLanguageColor: (lang?: string | null) => string;
}) {
  return (
    <div
      className="group overflow-hidden rounded-lg transition-all hover:scale-[1.01]"
      style={{
        backgroundColor: colors.bg.secondary,
        borderColor: colors.border,
        borderWidth: "1px",
      }}
    >
      {project.previewImage && (
        <div className="relative h-32 w-full overflow-hidden">
          <img
            src={project.previewImage}
            alt={project.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${colors.bg.secondary} 0%, transparent 50%)`,
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <VscGithub
              className="shrink-0"
              style={{ color: colors.accent.primary }}
            />
            <h3
              className="truncate text-base font-semibold"
              style={{ color: colors.text.primary }}
            >
              {project.name}
            </h3>
          </div>

          <div className="flex shrink-0 gap-1">
            {project.url && (
              <IconButton
                href={project.url}
                icon={<VscGithub />}
                title="GitHub"
                colors={colors}
              />
            )}
            {project.homepage && (
              <>
                <IconButton
                  onClick={() => onPreview(project)}
                  icon={<AiOutlineEye />}
                  title="Preview"
                  colors={colors}
                />
                <IconButton
                  href={project.homepage}
                  icon={<FiExternalLink />}
                  title="Abrir"
                  colors={colors}
                />
              </>
            )}
            {project.hasReadmeImages && (
              <IconButton
                onClick={() => onGallery(project)}
                icon={<FiImage />}
                title="Galeria"
                colors={colors}
              />
            )}
          </div>
        </div>

        <p
          className="line-clamp-2 text-sm"
          style={{ color: colors.text.secondary }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {project.language && (
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: getLanguageColor(project.language),
                }}
              />
              <span style={{ color: colors.text.tertiary }}>
                {project.language}
              </span>
            </div>
          )}
          {project.stars !== null && (
            <div
              className="flex items-center gap-1"
              style={{ color: colors.text.tertiary }}
            >
              <AiOutlineStar />
              <span>{project.stars}</span>
            </div>
          )}
          {project.forks !== null && (
            <div
              className="flex items-center gap-1"
              style={{ color: colors.text.tertiary }}
            >
              <VscRepoForked />
              <span>{project.forks}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  href,
  icon,
  title,
  colors,
}: {
  onClick?: () => void;
  href?: string;
  icon: React.ReactNode;
  title: string;
  colors: any;
}) {
  const className = "rounded-md p-2 transition-all hover:scale-110";
  const style = { backgroundColor: colors.bg.tertiary };

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        title={title}
      >
        <div style={{ color: colors.text.secondary }}>{icon}</div>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} style={style} title={title}>
      <div style={{ color: colors.text.secondary }}>{icon}</div>
    </button>
  );
}

function Modal({
  children,
  onClose,
  colors,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  colors: any;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-lg p-6"
        style={{
          backgroundColor: colors.bg.primary,
          borderColor: colors.border,
          borderWidth: "1px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-all hover:scale-110"
            style={{ backgroundColor: colors.bg.secondary }}
          >
            <FiX style={{ color: colors.text.primary }} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
