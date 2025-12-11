import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="shortcut icon" href="" type="image/x-icon" />
        <meta
          name="description"
          content="Portfólio de desenvolvedor back-end Guilherme Matias"
        />
        <meta
          name="keywords"
          content="Desenvolvedor Back-end, Programador, Portfólio, Guilherme Matias"
        />
        <meta name="author" content="Guilherme Matias" />

        <meta
          property="og:title"
          content="Portfólio de Desenvolvedor Back-end Guilherme Matias"
        />
        <meta
          property="og:description"
          content="Confira o portfólio de Guilherme Matias, especializado em desenvolvimento back-end."
        />
        <meta property="og:url" content="https://guicker.site" />

        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
