# 💻 Portfólio VSCode

Um portfólio interativo inspirado no Visual Studio Code, construído com Next.js, TypeScript e Tailwind CSS.

![Portfolio Preview](/public/image.png)

## ✨ Funcionalidades

### 🎨 Interface VSCode
- **Janela arrastável e redimensionável** - Simula uma janela real do VSCode
- **Sidebar navegável** - Acesso rápido às páginas do portfólio
- **Barra de pesquisa (Command Palette)** - Pressione `Ctrl+K` para abrir
- **Footer interativo** - Controles de música e atalhos

### 🎯 Command Palette (Ctrl+K)
- Navegação rápida entre páginas
- Troca de temas
- Controle de música
- Busca por comandos

### 🎵 Player de Música
- Música ambiente ao navegar
- Controle de mute/unmute no footer
- Integração com o Command Palette

### 🎭 Temas
- **Default (Dark)** - Tema escuro padrão
- **Dracula** - Tema roxo popular
- **Purple** - Variação roxa personalizada

### 📱 Responsivo
- Layout adaptável para desktop e mobile
- Janela se ajusta ao tamanho da tela
- Componentes responsivos

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações fluidas
- **React Icons** - Ícones

## 📂 Estrutura do Projeto

```
├── components/
│   ├── CommandPalette.tsx      # Paleta de comandos (Ctrl+K)
│   ├── Screen.tsx              # Container principal
│   └── WindowLayout/
│       ├── index.tsx           # Layout da janela
│       ├── WindowHead.tsx      # Barra superior com busca
│       ├── WindowSidebar.tsx   # Sidebar de navegação
│       ├── WindowFooter.tsx    # Footer com controles
│       └── WindowPage.tsx      # Container de página
├── contexts/
│   ├── ThemeContext.tsx        # Gerenciamento de temas
│   ├── AudioContext.tsx        # Player de música
│   ├── CommandPaletteContext.tsx # Estado do Command Palette
│   └── MotionWindowContext.tsx # Controle da janela
├── pages/
│   ├── index.tsx               # Página inicial
│   ├── about-me.tsx            # Sobre mim
│   ├── profile.tsx             # Perfil GitHub
│   ├── projects.tsx            # Projetos
│   ├── commits.tsx             # Histórico de commits
│   ├── settings.tsx            # Configurações
│   └── discord.tsx             # Discord
└── styles/
    └── globals.css             # Estilos globais
```

## 🚀 Como Executar

```bash
# Clone o repositório
git clone https://github.com/GuickerZ/portfolio.git

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## ⌨️ Atalhos

| Atalho | Ação |
|--------|------|
| `Ctrl+K` | Abrir Command Palette |
| `↑` `↓` | Navegar nos comandos |
| `Enter` | Executar comando |
| `ESC` | Fechar Command Palette |

## 🎨 Personalização

### Adicionar novo tema
Edite `contexts/ThemeContext.tsx` e adicione seu tema ao objeto `themes`.

### Adicionar nova página
1. Crie o arquivo em `pages/`
2. Adicione a rota no `WindowSidebar.tsx`
3. Adicione o comando no `CommandPalette.tsx`

### Alterar música
Substitua o arquivo de áudio em `public/` e atualize o `AudioContext.tsx`.

## 📝 Créditos

Este portfólio foi baseado no projeto [tiagoryandev](https://github.com/tiagoryandev/tiagoryandev) e foi significativamente melhorado e expandido com novas funcionalidades.

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar.

---

Desenvolvido por **Guilherme Matias** 
