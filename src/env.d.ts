/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NG_APP_GITHUB_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}