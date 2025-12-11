import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WindowPage from "@components/WindowLayout/WindowPage";
import { useTheme } from "@contexts/ThemeContext";
import { HiLocationMarker, HiCode, HiAcademicCap } from "react-icons/hi";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function AboutMe() {
  const { colors } = useTheme();

  return (
    <>
      <Head>
        <title>Sobre Mim - Guilherme Matias | Portfólio</title>
      </Head>
      <WindowPage>
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <Image
              src="https://github.com/GuickerZ.png"
              alt="Guilherme Matias"
              width={460}
              height={460}
              className="h-16 w-16 rounded-lg border-2 sm:h-20 sm:w-20"
              style={{ borderColor: colors.accent.primary }}
            />
            <div className="flex flex-col gap-0.5">
              <h1
                className="select-none text-xl font-bold sm:text-2xl"
                style={{ color: colors.text.primary }}
              >
                Guilherme Matias
              </h1>
              <div className="flex items-center gap-1">
                <HiCode style={{ color: colors.text.accent }} />
                <p
                  className="select-none text-sm font-medium"
                  style={{ color: colors.text.accent }}
                >
                  Desenvolvedor Back-End
                </p>
              </div>
              <div className="flex items-center gap-1">
                <HiLocationMarker style={{ color: colors.text.tertiary }} />
                <span
                  className="select-none text-xs"
                  style={{ color: colors.text.tertiary }}
                >
                  Garanhuns, PE
                </span>
              </div>
            </div>
          </motion.div>

          <div
            className="w-full border-t-[1px]"
            style={{ borderColor: colors.border }}
          />

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <h1
              className="select-none pb-2 text-lg font-medium sm:text-xl"
              style={{ color: colors.text.primary }}
            >
              # Quem sou eu?
            </h1>
            <p
              className="w-full max-w-2xl text-sm font-thin"
              style={{ color: colors.text.secondary }}
            >
              &emsp;Olá, sou Guilherme Matias. Comecei a programar entre os 10 e
              12 anos, movido pela curiosidade e criar projetos por diversão.
              Mais velho, desenvolvi bots para Discord em JavaScript, o que me
              aproximou de integrações e automações reais.
            </p>
            <p
              className="w-full max-w-2xl text-sm font-thin"
              style={{ color: colors.text.secondary }}
            >
              &emsp;Hoje atuo como desenvolvedor Full-Stack com foco em backend
              (Node.js, JavaScript, TypeScript): crio APIs RESTful, faço
              integrações com gateways de pagamento (Mercado Pago, EfiPay) e
              desenvolvo automações/bots para WhatsApp, Telegram e Discord.
              Também trabalho com React, Python e bancos como PostgreSQL e
              MySQL. Sou estudante do Técnico em Informática no IFPE — Campus
              Garanhuns e busco sempre transformar ideias em soluções práticas e
              escaláveis.
            </p>
          </motion.div>

          <div
            className="w-full border-t-[1px]"
            style={{ borderColor: colors.border }}
          />

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2"
          >
            <h1
              className="select-none pb-2 text-lg font-medium sm:text-xl"
              style={{ color: colors.text.primary }}
            >
              # Experiências
            </h1>
            <div className="flex flex-col">
              <div
                className="relative ml-2 border-l-[1px] pb-4 pl-4"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="absolute -left-[7px] top-0 h-[14px] w-[14px] rounded-full"
                  style={{ backgroundColor: colors.bg.tertiary }}
                />
                <div className="flex flex-col">
                  <span
                    className="select-none text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    2023 - Atual
                  </span>
                  <div className="flex flex-col">
                    <h1
                      className="select-none"
                      style={{ color: colors.text.primary }}
                    >
                      Desenvolvedor
                    </h1>
                    <span
                      className="select-none text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      Workana
                    </span>
                  </div>
                  <span
                    className="select-none text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    Freelancer
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div
                className="relative ml-2 border-l-[1px] pb-4 pl-4"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="absolute -left-[7px] top-0 h-[14px] w-[14px] rounded-full"
                  style={{ backgroundColor: colors.bg.tertiary }}
                />
                <div className="flex flex-col">
                  <span
                    className="select-none text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    2022 - Atual
                  </span>
                  <div className="flex flex-col">
                    <h1
                      className="select-none"
                      style={{ color: colors.text.primary }}
                    >
                      Técnico em Informática
                    </h1>
                    <span
                      className="select-none text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      Instituto Federal de Pernambuco (IFPE) - Garanhuns
                    </span>
                  </div>
                  <span
                    className="select-none text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    Ensino Médio Integrado ao Técnico
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div
            className="w-full border-t-[1px]"
            style={{ borderColor: colors.border }}
          />

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-2 pb-2"
          >
            <h1
              className="select-none pb-2 text-lg font-medium sm:text-xl"
              style={{ color: colors.text.primary }}
            >
              # Formações
            </h1>
            <div className="flex items-center gap-3">
              <Image
                src="/ifpewhite.png"
                alt="Estácio Logo"
                width={200}
                height={200}
                className=" w-16 rounded-md"
              />
              <div className="flex flex-col">
                <h1 className="select-none text-sm font-light text-zinc-100">
                  Técnico em Informática
                </h1>
                <p className="select-none text-sm font-light text-zinc-400">
                  IFPE Campus Garanhuns - Cursando
                </p>
                <span className="select-none text-xs text-zinc-500">
                  Janeiro de 2022
                </span>
              </div>
            </div>
          </motion.div>

          <div
            className="w-full border-t-[1px]"
            style={{ borderColor: colors.border }}
          />

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-2"
          >
            <h1
              className="select-none pb-2 text-lg font-medium sm:text-xl"
              style={{ color: colors.text.primary }}
            >
              # Habilidades
            </h1>
            <div className="flex flex-wrap gap-2">
              {[
                "javascript",
                "typescript",
                "nodejs",
                "reactnative",
                "nextjs",
                "express",
                "fastapi",
                "python",
                "mysql",
                "postgresql",
                "sqlite",
                "supabase",
                "socketio",
                "git",
                "vscode",
                "html",
                "css",
                "bootstrap",
                "vite",
                "vue",
                "expo",
                "postman",
                "playwright",
                "docker",
                "nginx",
                "vercel",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full px-3 py-1 text-sm"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    color: colors.text.secondary,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <div
            className="w-full border-t-[1px]"
            style={{ borderColor: colors.border }}
          />

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-2"
          >
            <h1
              className="select-none text-lg font-medium sm:text-xl"
              style={{ color: colors.text.primary }}
            >
              # Links
            </h1>
            <ul className="list-disc">
              <li
                className="ml-5 cursor-pointer select-none hover:underline"
                style={{ color: colors.accent.primary }}
              >
                <Link
                  className="outline-none"
                  href="https://www.linkedin.com/in/guicker/"
                >
                  Meu LinkedIn
                </Link>
              </li>
              <li
                className="ml-5 cursor-pointer select-none hover:underline"
                style={{ color: colors.accent.primary }}
              >
                <Link
                  className="outline-none"
                  href="https://github.com/GuickerZ"
                >
                  Meu Github
                </Link>
              </li>
              <li
                className="ml-5 cursor-pointer select-none hover:underline"
                style={{ color: colors.accent.primary }}
              >
                <Link
                  className="outline-none"
                  href="https://www.instagram.com/guilhermematiasss/"
                >
                  Meu Instagram
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.span
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="select-none text-sm"
            style={{ color: colors.text.tertiary }}
          >
            Desenvolvido por Guilherme Matias.
          </motion.span>
        </div>
      </WindowPage>
    </>
  );
}
