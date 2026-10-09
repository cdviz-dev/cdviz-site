// env.d.ts
/// <reference types="vite/client" />
// PostHog is loaded by the snippet in `.vitepress/config.mts`; absent during SSR and with blockers.
interface Window {
  posthog?: { capture(event: string, properties?: Record<string, unknown>): void };
}
declare module "*.svg" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}
declare module "*.svg?component" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}
