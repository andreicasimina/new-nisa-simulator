/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_TAG_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
