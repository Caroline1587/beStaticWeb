type Recordable<T = any> = Record<string, T>;
 
export interface ViteEnv {
  VITE_USER_NODE_ENV: "development" | "production";
  VITE_PUBLIC_PATH: string;
  VITE_PORT: number;
}