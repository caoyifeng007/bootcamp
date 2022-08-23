/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ALCHEMY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
