const prefix = (process.env.DOCUSAURUS_BASE_URL ?? '').trim().replace(/^\/+|\/+$/g, '');
const baseUrl = prefix ? `/${prefix}/` : '/';

export default {
  title: 'Ledger',
  tagline: 'Documentação do Ledger',
  url: process.env.DOCUSAURUS_URL ?? 'http://localhost:3000',
  baseUrl,
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },
  i18n: {defaultLocale: 'pt-BR', locales: ['pt-BR']},
  presets: [
    ['classic', {
      docs: {
        routeBasePath: '/',
        sidebarPath: './sidebars.mjs',
        breadcrumbs: true,
      },
      blog: false,
      pages: false,
      theme: {customCss: './src/css/custom.css'},
    }],
  ],
  themes: [
    ['@easyops-cn/docusaurus-search-local', {
      hashed: true,
      language: 'pt',
      docsRouteBasePath: '/',
      indexBlog: false,
    }],
  ],
  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    docs: {sidebar: {hideable: true, autoCollapseCategories: true}},
    navbar: {
      title: 'Ledger',
      items: [
        {type: 'doc', docId: 'ledger/index', label: 'Documentação', position: 'left'},
      ],
    },
    footer: {style: 'light', copyright: 'Documentação do Ledger'},
  },
};
