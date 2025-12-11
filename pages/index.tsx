import Head from "next/head";
import Image from "next/image";
import WindowPage from "@components/WindowLayout/WindowPage";
import { useTheme } from "@contexts/ThemeContext";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import { FaLinkedin, FaDiscord } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiC,
  SiCsharp,
  SiPhp,
  SiRuby,
  SiGo,
  SiRust,
  SiSwift,
  SiKotlin,
  SiDart,
  SiScala,
  SiElixir,
  SiHaskell,
  SiLua,
  SiPerl,
  SiR,
  SiNodedotjs,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiSpring,
  SiDotnet,
  SiRubyonrails,
  SiLaravel,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSqlite,
  SiMariadb,
  SiOracle,
  SiMicrosoftsqlserver,
  SiFirebase,
  SiSupabase,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiVisualstudiocode,
  SiIntellijidea,
  SiPycharm,
  SiWebstorm,
  SiAndroidstudio,
  SiXcode,
  SiVim,
  SiNeovim,
  SiNpm,
  SiYarn,
  SiPnpm,
  SiWebpack,
  SiVite,
  SiEsbuild,
  SiGulp,
  SiGrunt,
  SiBabel,
  SiEslint,
  SiPrettier,
  SiJest,
  SiMocha,
  SiCypress,
  SiPlaywright,
  SiSelenium,
  SiPytest,
  SiJunit5,
  SiGraphql,
  SiApollographql,
  SiSocketdotio,
  SiRabbitmq,
  SiApachekafka,
  SiNginx,
  SiApache,
  SiAmazonaws,
  SiMicrosoftazure,
  SiGooglecloud,
  SiHeroku,
  SiVercel,
  SiNetlify,
  SiDigitalocean,
  SiLinux,
  SiUbuntu,
  SiDebian,
  SiCentos,
  SiRedhat,
  SiFedora,
  SiArchlinux,
  SiWindows,
  SiMacos,
  SiTailwindcss,
  SiBootstrap,
  SiMui,
  SiChakraui,
  SiSass,
  SiLess,
  SiStyledcomponents,
  SiHtml5,
  SiCss3,
  SiMarkdown,
  SiJquery,
  SiReactrouter,
  SiRedux,
  SiMobx,
  SiReactquery,
  SiSwr,
  SiFramer,
  SiElectron,
  SiFlutter,
  SiIonic,
  SiExpo,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiJupyter,
  SiKeras,
  SiOpencv,
  SiUnity,
  SiUnrealengine,
  SiGodotengine,
  SiBlender,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobexd,
  SiSketch,
  SiInvision,
  SiTrello,
  SiJira,
  SiConfluence,
  SiSlack,
  SiDiscord,
  SiNotion,
  SiMiro,
  SiPostman,
  SiInsomnia,
  SiSwagger,
  SiTerraform,
  SiAnsible,
  SiJenkins,
  SiGithubactions,
  SiCircleci,
  SiTravisci,
  SiPrometheus,
  SiGrafana,
  SiElasticsearch,
  SiKibana,
  SiLogstash,
  SiDatadog,
  SiSentry,
  SiPrisma,
  SiSequelize,
  SiMongoose,
} from "react-icons/si";

import {
  DiNpm,
  DiPython,
  DiJava,
  DiPhp,
  DiRuby,
  DiGo,
  DiDocker,
  DiMysql,
  DiPostgresql,
  DiMongodb,
  DiRedis,
} from "react-icons/di";

import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaNode,
  FaPython,
  FaJava,
  FaPhp,
  FaDocker,
  FaGitAlt,
  FaGithub,
  FaAws,
  FaLinux,
  FaUbuntu,
  FaWindows,
  FaApple,
  FaNpm,
  FaSass,
  FaBootstrap,
  FaFigma,
  FaSlack,
  FaTrello,
} from "react-icons/fa";

import { VscCode, VscGithub } from "react-icons/vsc";

import {
  TbBrandNextjs,
  TbBrandReactNative,
  TbBrandTailwind,
  TbBrandDjango,
  TbBrandFlutter,
} from "react-icons/tb";

// Interface para tecnologias
interface Technology {
  id: string;
  name: string;
  icon: IconType;
  category:
    | "language"
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "mobile"
    | "tool"
    | "ai"
    | "design"
    | "testing";
  color?: string;
}

// TODAS as tecnologias disponíveis - organize como preferir
const ALL_TECHNOLOGIES: Technology[] = [
  // Linguagens de Programação
  {
    id: "javascript",
    name: "JavaScript",
    icon: SiJavascript,
    category: "language",
    color: "#F7DF1E",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: SiTypescript,
    category: "language",
    color: "#3178C6",
  },
  {
    id: "python",
    name: "Python",
    icon: SiPython,
    category: "language",
    color: "#3776AB",
  },
  {
    id: "cpp",
    name: "C++",
    icon: SiCplusplus,
    category: "language",
    color: "#00599C",
  },
  { id: "c", name: "C", icon: SiC, category: "language", color: "#A8B9CC" },
  {
    id: "csharp",
    name: "C#",
    icon: SiCsharp,
    category: "language",
    color: "#239120",
  },
  {
    id: "php",
    name: "PHP",
    icon: SiPhp,
    category: "language",
    color: "#777BB4",
  },
  {
    id: "ruby",
    name: "Ruby",
    icon: SiRuby,
    category: "language",
    color: "#CC342D",
  },
  { id: "go", name: "Go", icon: SiGo, category: "language", color: "#00ADD8" },
  {
    id: "rust",
    name: "Rust",
    icon: SiRust,
    category: "language",
    color: "#000000",
  },
  {
    id: "swift",
    name: "Swift",
    icon: SiSwift,
    category: "language",
    color: "#FA7343",
  },
  {
    id: "kotlin",
    name: "Kotlin",
    icon: SiKotlin,
    category: "language",
    color: "#7F52FF",
  },
  {
    id: "dart",
    name: "Dart",
    icon: SiDart,
    category: "language",
    color: "#0175C2",
  },
  {
    id: "scala",
    name: "Scala",
    icon: SiScala,
    category: "language",
    color: "#DC322F",
  },
  {
    id: "elixir",
    name: "Elixir",
    icon: SiElixir,
    category: "language",
    color: "#4B275F",
  },
  {
    id: "haskell",
    name: "Haskell",
    icon: SiHaskell,
    category: "language",
    color: "#5D4F85",
  },
  {
    id: "lua",
    name: "Lua",
    icon: SiLua,
    category: "language",
    color: "#2C2D72",
  },
  {
    id: "perl",
    name: "Perl",
    icon: SiPerl,
    category: "language",
    color: "#39457E",
  },
  { id: "r", name: "R", icon: SiR, category: "language", color: "#276DC3" },

  // Frontend
  {
    id: "react",
    name: "React",
    icon: SiReact,
    category: "frontend",
    color: "#61DAFB",
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: TbBrandNextjs,
    category: "frontend",
    color: "#000000",
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: SiVuedotjs,
    category: "frontend",
    color: "#4FC08D",
  },
  {
    id: "angular",
    name: "Angular",
    icon: SiAngular,
    category: "frontend",
    color: "#DD0031",
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: SiSvelte,
    category: "frontend",
    color: "#FF3E00",
  },
  {
    id: "html",
    name: "HTML5",
    icon: SiHtml5,
    category: "frontend",
    color: "#E34F26",
  },
  {
    id: "css",
    name: "CSS3",
    icon: SiCss3,
    category: "frontend",
    color: "#1572B6",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    category: "frontend",
    color: "#06B6D4",
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    icon: SiBootstrap,
    category: "frontend",
    color: "#7952B3",
  },
  {
    id: "mui",
    name: "Material-UI",
    icon: SiMui,
    category: "frontend",
    color: "#007FFF",
  },
  {
    id: "chakra",
    name: "Chakra UI",
    icon: SiChakraui,
    category: "frontend",
    color: "#319795",
  },
  {
    id: "sass",
    name: "Sass",
    icon: SiSass,
    category: "frontend",
    color: "#CC6699",
  },
  {
    id: "less",
    name: "Less",
    icon: SiLess,
    category: "frontend",
    color: "#1D365D",
  },
  {
    id: "styled",
    name: "Styled Components",
    icon: SiStyledcomponents,
    category: "frontend",
    color: "#DB7093",
  },
  {
    id: "jquery",
    name: "jQuery",
    icon: SiJquery,
    category: "frontend",
    color: "#0769AD",
  },
  {
    id: "redux",
    name: "Redux",
    icon: SiRedux,
    category: "frontend",
    color: "#764ABC",
  },
  {
    id: "mobx",
    name: "MobX",
    icon: SiMobx,
    category: "frontend",
    color: "#FF9955",
  },
  {
    id: "reactquery",
    name: "React Query",
    icon: SiReactquery,
    category: "frontend",
    color: "#FF4154",
  },
  {
    id: "framer",
    name: "Framer Motion",
    icon: SiFramer,
    category: "frontend",
    color: "#0055FF",
  },

  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    icon: SiNodedotjs,
    category: "backend",
    color: "#339933",
  },
  {
    id: "express",
    name: "Express",
    icon: SiExpress,
    category: "backend",
    color: "#000000",
  },
  {
    id: "nestjs",
    name: "NestJS",
    icon: SiNestjs,
    category: "backend",
    color: "#E0234E",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    icon: SiFastapi,
    category: "backend",
    color: "#009688",
  },
  {
    id: "django",
    name: "Django",
    icon: SiDjango,
    category: "backend",
    color: "#092E20",
  },
  {
    id: "flask",
    name: "Flask",
    icon: SiFlask,
    category: "backend",
    color: "#000000",
  },
  {
    id: "spring",
    name: "Spring",
    icon: SiSpring,
    category: "backend",
    color: "#6DB33F",
  },
  {
    id: "dotnet",
    name: ".NET",
    icon: SiDotnet,
    category: "backend",
    color: "#512BD4",
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    icon: SiRubyonrails,
    category: "backend",
    color: "#CC0000",
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: SiLaravel,
    category: "backend",
    color: "#FF2D20",
  },
  {
    id: "graphql",
    name: "GraphQL",
    icon: SiGraphql,
    category: "backend",
    color: "#E10098",
  },
  {
    id: "apollo",
    name: "Apollo GraphQL",
    icon: SiApollographql,
    category: "backend",
    color: "#311C87",
  },
  {
    id: "socketio",
    name: "Socket.io",
    icon: SiSocketdotio,
    category: "backend",
    color: "#010101",
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    icon: SiRabbitmq,
    category: "backend",
    color: "#FF6600",
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    icon: SiApachekafka,
    category: "backend",
    color: "#231F20",
  },

  // Bancos de Dados
  {
    id: "mysql",
    name: "MySQL",
    icon: SiMysql,
    category: "database",
    color: "#4479A1",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: SiPostgresql,
    category: "database",
    color: "#4169E1",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: SiMongodb,
    category: "database",
    color: "#47A248",
  },
  {
    id: "redis",
    name: "Redis",
    icon: SiRedis,
    category: "database",
    color: "#DC382D",
  },
  {
    id: "sqlite",
    name: "SQLite",
    icon: SiSqlite,
    category: "database",
    color: "#003B57",
  },
  {
    id: "mariadb",
    name: "MariaDB",
    icon: SiMariadb,
    category: "database",
    color: "#003545",
  },
  {
    id: "oracle",
    name: "Oracle",
    icon: SiOracle,
    category: "database",
    color: "#F80000",
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    icon: SiMicrosoftsqlserver,
    category: "database",
    color: "#CC2927",
  },
  {
    id: "firebase",
    name: "Firebase",
    icon: SiFirebase,
    category: "database",
    color: "#FFCA28",
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: SiSupabase,
    category: "database",
    color: "#3ECF8E",
  },
  {
    id: "elasticsearch",
    name: "Elasticsearch",
    icon: SiElasticsearch,
    category: "database",
    color: "#005571",
  },
  {
    id: "prisma",
    name: "Prisma",
    icon: SiPrisma,
    category: "database",
    color: "#2D3748",
  },
  {
    id: "sequelize",
    name: "Sequelize",
    icon: SiSequelize,
    category: "database",
    color: "#52B0E7",
  },
  {
    id: "mongoose",
    name: "Mongoose",
    icon: SiMongoose,
    category: "database",
    color: "#880000",
  },

  // DevOps & Cloud
  {
    id: "docker",
    name: "Docker",
    icon: SiDocker,
    category: "devops",
    color: "#2496ED",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    icon: SiKubernetes,
    category: "devops",
    color: "#326CE5",
  },
  {
    id: "aws",
    name: "AWS",
    icon: SiAmazonaws,
    category: "devops",
    color: "#FF9900",
  },
  {
    id: "azure",
    name: "Azure",
    icon: SiMicrosoftazure,
    category: "devops",
    color: "#0078D4",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    icon: SiGooglecloud,
    category: "devops",
    color: "#4285F4",
  },
  {
    id: "heroku",
    name: "Heroku",
    icon: SiHeroku,
    category: "devops",
    color: "#430098",
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: SiVercel,
    category: "devops",
    color: "#000000",
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: SiNetlify,
    category: "devops",
    color: "#00C7B7",
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    icon: SiDigitalocean,
    category: "devops",
    color: "#0080FF",
  },
  {
    id: "nginx",
    name: "Nginx",
    icon: SiNginx,
    category: "devops",
    color: "#009639",
  },
  {
    id: "apache",
    name: "Apache",
    icon: SiApache,
    category: "devops",
    color: "#D22128",
  },
  {
    id: "terraform",
    name: "Terraform",
    icon: SiTerraform,
    category: "devops",
    color: "#7B42BC",
  },
  {
    id: "ansible",
    name: "Ansible",
    icon: SiAnsible,
    category: "devops",
    color: "#EE0000",
  },
  {
    id: "jenkins",
    name: "Jenkins",
    icon: SiJenkins,
    category: "devops",
    color: "#D24939",
  },
  {
    id: "githubactions",
    name: "GitHub Actions",
    icon: SiGithubactions,
    category: "devops",
    color: "#2088FF",
  },
  {
    id: "prometheus",
    name: "Prometheus",
    icon: SiPrometheus,
    category: "devops",
    color: "#E6522C",
  },
  {
    id: "grafana",
    name: "Grafana",
    icon: SiGrafana,
    category: "devops",
    color: "#F46800",
  },

  // Mobile
  {
    id: "reactnative",
    name: "React Native",
    icon: TbBrandReactNative,
    category: "mobile",
    color: "#61DAFB",
  },
  {
    id: "flutter",
    name: "Flutter",
    icon: SiFlutter,
    category: "mobile",
    color: "#02569B",
  },
  {
    id: "ionic",
    name: "Ionic",
    icon: SiIonic,
    category: "mobile",
    color: "#3880FF",
  },
  {
    id: "expo",
    name: "Expo",
    icon: SiExpo,
    category: "mobile",
    color: "#000020",
  },

  // Ferramentas & IDEs
  {
    id: "vscode",
    name: "VS Code",
    icon: SiVisualstudiocode,
    category: "tool",
    color: "#007ACC",
  },
  { id: "git", name: "Git", icon: SiGit, category: "tool", color: "#F05032" },
  {
    id: "github",
    name: "GitHub",
    icon: SiGithub,
    category: "tool",
    color: "#181717",
  },
  { id: "npm", name: "npm", icon: DiNpm, category: "tool", color: "#CB3837" },
  {
    id: "yarn",
    name: "Yarn",
    icon: SiYarn,
    category: "tool",
    color: "#2C8EBB",
  },
  {
    id: "pnpm",
    name: "pnpm",
    icon: SiPnpm,
    category: "tool",
    color: "#F69220",
  },
  {
    id: "webpack",
    name: "Webpack",
    icon: SiWebpack,
    category: "tool",
    color: "#8DD6F9",
  },
  {
    id: "vite",
    name: "Vite",
    icon: SiVite,
    category: "tool",
    color: "#646CFF",
  },
  {
    id: "eslint",
    name: "ESLint",
    icon: SiEslint,
    category: "tool",
    color: "#4B32C3",
  },
  {
    id: "prettier",
    name: "Prettier",
    icon: SiPrettier,
    category: "tool",
    color: "#F7B93E",
  },
  {
    id: "postman",
    name: "Postman",
    icon: SiPostman,
    category: "tool",
    color: "#FF6C37",
  },
  {
    id: "insomnia",
    name: "Insomnia",
    icon: SiInsomnia,
    category: "tool",
    color: "#5849BE",
  },

  // Testing
  {
    id: "jest",
    name: "Jest",
    icon: SiJest,
    category: "testing",
    color: "#C21325",
  },
  {
    id: "cypress",
    name: "Cypress",
    icon: SiCypress,
    category: "testing",
    color: "#17202C",
  },
  {
    id: "playwright",
    name: "Playwright",
    icon: SiPlaywright,
    category: "testing",
    color: "#2EAD33",
  },
  {
    id: "pytest",
    name: "Pytest",
    icon: SiPytest,
    category: "testing",
    color: "#0A9EDC",
  },

  // AI/ML
  {
    id: "tensorflow",
    name: "TensorFlow",
    icon: SiTensorflow,
    category: "ai",
    color: "#FF6F00",
  },
  {
    id: "pytorch",
    name: "PyTorch",
    icon: SiPytorch,
    category: "ai",
    color: "#EE4C2C",
  },
  {
    id: "opencv",
    name: "OpenCV",
    icon: SiOpencv,
    category: "ai",
    color: "#5C3EE8",
  },

  // Design
  {
    id: "figma",
    name: "Figma",
    icon: SiFigma,
    category: "design",
    color: "#F24E1E",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    icon: SiAdobephotoshop,
    category: "design",
    color: "#31A8FF",
  },
];

const SOCIAL_LINKS = [
  {
    id: "github",
    icon: FaGithub,
    url: "https://github.com/GuickerZ",
    color: "#fff",
  },
  {
    id: "linkedin",
    icon: FaLinkedin,
    url: "https://linkedin.com/in/guicker",
    color: "#0A66C2",
  },
  { id: "discord", icon: FaDiscord, url: "/discord", color: "#5865F2" },
  {
    id: "email",
    icon: HiMail,
    url: "mailto:guimatias172@gmail.com",
    color: "#EA4335",
  },
];

const TYPING_TEXTS = [
  "Back-End Developer",
  "Node.js Enthusiast",
  "Python Developer",
  "API Architect",
];

export default function Home() {
  const { colors } = useTheme();
  const [hoveredLogo, setHoveredLogo] = useState("");
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = TYPING_TEXTS[typingIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setTypingIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  const myTechnologies = [
    "javascript",
    "typescript",
    "nodejs",
    "python",
    "express",
    "socketio",
    "mysql",
    "nextjs",
    "react",
    "playwright",
    "postman",
    "vscode",
  ];

  const displayedTechnologies = ALL_TECHNOLOGIES.filter((tech) =>
    myTechnologies.includes(tech.id),
  );

  return (
    <>
      <Head>
        <title>Guilherme Matias | Portfólio</title>
      </Head>
      <WindowPage>
        <div className="flex min-h-full w-full items-center justify-center p-4">
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <div className="relative">
                <Image
                  src="https://github.com/GuickerZ.png"
                  alt="Guilherme Matias"
                  width={460}
                  height={460}
                  className={`h-32 w-32 rounded-full border-4 transition-all duration-500 sm:h-40 sm:w-40 ${
                    isImageHovered ? "scale-105 opacity-0" : "opacity-100"
                  }`}
                  style={{ borderColor: colors.accent.primary }}
                />
                <Image
                  src="/9c9ef98e3e100787f2b25c52f8420266.jpg"
                  alt="Hovered Image"
                  width={460}
                  height={460}
                  className={`absolute left-0 top-0 h-32 w-32 rounded-full border-4 transition-all duration-500 sm:h-40 sm:w-40 ${
                    isImageHovered ? "scale-105 opacity-100" : "opacity-0"
                  }`}
                  style={{ borderColor: colors.accent.primary }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex w-full flex-col items-center gap-2 text-center"
            >
              <h1
                className="select-none text-2xl font-bold sm:text-3xl"
                style={{ color: colors.text.primary }}
              >
                Guilherme Matias
              </h1>
              <div className="flex h-8 items-center gap-1">
                <span style={{ color: colors.text.accent }}>{"<"}</span>
                <span
                  className="font-mono"
                  style={{ color: colors.text.accent }}
                >
                  {displayText}
                </span>
                <span
                  className="animate-pulse"
                  style={{ color: colors.text.accent }}
                >
                  |
                </span>
                <span style={{ color: colors.text.accent }}>{"/>"}</span>
              </div>
              <p
                className="select-none text-sm"
                style={{ color: colors.text.tertiary }}
              >
                Seja Bem-vindo ao meu Portfólio!
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {displayedTechnologies.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="relative cursor-pointer"
                  onMouseEnter={() => setHoveredLogo(tech.id)}
                  onMouseLeave={() => setHoveredLogo("")}
                >
                  <tech.icon
                    className="text-xl transition-all duration-300 hover:scale-125 sm:text-2xl"
                    style={{
                      color:
                        hoveredLogo === tech.id
                          ? tech.color || colors.text.primary
                          : colors.text.tertiary,
                    }}
                  />
                  {hoveredLogo === tech.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-1/2 top-8 z-10 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs shadow-lg"
                      style={{
                        backgroundColor: colors.bg.secondary,
                        color: colors.text.primary,
                        borderColor: colors.border,
                        borderWidth: "1px",
                      }}
                    >
                      {tech.name}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-2"
            >
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target={social.url.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="rounded-md p-2 transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: colors.bg.secondary }}
                >
                  <social.icon
                    className="text-sm"
                    style={{ color: colors.text.tertiary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = social.color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = colors.text.tertiary)
                    }
                  />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </WindowPage>
    </>
  );
}
