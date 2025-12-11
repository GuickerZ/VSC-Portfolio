import {
  VscFiles,
  VscBook,
  VscSourceControl,
  VscGear,
  VscAccount,
  VscSearch,
} from "react-icons/vsc";
import { BsDiscord, BsLinkedin, BsInstagram } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "@contexts/ThemeContext";

export default function WindowSidebar() {
  const router = useRouter();
  const { colors } = useTheme();

  const menuItems = [
    { path: "/", icon: VscFiles, label: "Início" },
    { path: "/about-me", icon: VscBook, label: "Sobre Mim" },
    { path: "/projects", icon: VscSearch, label: "Projetos" },
    { path: "/commits", icon: VscSourceControl, label: "Commits" },
  ];

  const socialItems = [
    {
      href: "https://www.linkedin.com/in/guicker/",
      icon: BsLinkedin,
      label: "LinkedIn",
      external: true,
    },
    {
      href: "/discord",
      icon: BsDiscord,
      label: "Discord",
      external: false,
    },
    {
      href: "https://www.instagram.com/guilhermematiasss/",
      icon: BsInstagram,
      label: "Instagram",
      external: true,
    },
  ];

  const bottomItems = [
    { path: "/profile", icon: VscAccount, label: "Perfil" },
    { path: "/settings", icon: VscGear, label: "Configurações" },
  ];

  return (
    <div
      className="flex min-w-[48px] flex-col justify-between overflow-y-auto border-l-[1px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-800"
      style={{
        backgroundColor: colors.bg.secondary,
        borderColor: colors.border,
      }}
    >
      {/* Menu Principal */}
      <div className="flex flex-col">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} className="outline-none">
            <div
              data-selected={router.pathname === item.path}
              className="group/link cursor-pointer border-l-2 p-3 transition-colors data-[selected=true]:border-l-zinc-200"
              style={{
                borderLeftColor:
                  router.pathname === item.path
                    ? colors.accent.primary
                    : "transparent",
              }}
              title={item.label}
            >
              <item.icon
                className="text-2xl transition-colors group-hover/link:opacity-100 group-data-[selected=true]/link:opacity-100"
                style={{
                  color:
                    router.pathname === item.path
                      ? colors.accent.primary
                      : colors.text.tertiary,
                  opacity: router.pathname === item.path ? 1 : 0.6,
                }}
              />
            </div>
          </Link>
        ))}

        {/* Links Sociais */}
        <div
          className="flex flex-col border-t-[1px] py-2"
          style={{ borderColor: colors.border }}
        >
          {socialItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="outline-none"
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              <div
                data-selected={!item.external && router.pathname === item.href}
                className="group/link cursor-pointer border-l-2 p-3 transition-colors data-[selected=true]:border-l-zinc-200"
                style={{
                  borderLeftColor:
                    !item.external && router.pathname === item.href
                      ? colors.accent.primary
                      : "transparent",
                }}
                title={item.label}
              >
                <item.icon
                  className="text-2xl transition-colors group-hover/link:opacity-100 group-data-[selected=true]/link:opacity-100"
                  style={{
                    color:
                      !item.external && router.pathname === item.href
                        ? colors.accent.primary
                        : colors.text.tertiary,
                    opacity:
                      !item.external && router.pathname === item.href ? 1 : 0.6,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Menu Inferior */}
      <div
        className="flex min-h-[min-content] flex-col border-t-[1px]"
        style={{ borderColor: colors.border }}
      >
        {bottomItems.map((item) => (
          <Link key={item.path} href={item.path} className="outline-none">
            <div
              data-selected={router.pathname === item.path}
              className="group/link cursor-pointer border-l-2 p-3 transition-colors data-[selected=true]:border-l-zinc-200"
              style={{
                borderLeftColor:
                  router.pathname === item.path
                    ? colors.accent.primary
                    : "transparent",
              }}
              title={item.label}
            >
              <item.icon
                className="text-2xl transition-colors group-hover/link:opacity-100 group-data-[selected=true]/link:opacity-100"
                style={{
                  color:
                    router.pathname === item.path
                      ? colors.accent.primary
                      : colors.text.tertiary,
                  opacity: router.pathname === item.path ? 1 : 0.6,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
