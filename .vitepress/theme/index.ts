// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import StatusMark from "../../components/StatusMark.vue";
import Layout from "./Layout.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  // https://vitepress.dev/guide/extending-default-theme#layout-slots
  Layout,
  enhanceApp({ app }) {
    // Status marks for docs tables (no emoji): <Yes />, <No />, <Partial />
    for (const status of ["yes", "no", "partial"] as const) {
      const name = status[0].toUpperCase() + status.slice(1);
      app.component(name, (_, { slots }) => h(StatusMark, { status }, slots));
    }
  },
} satisfies Theme;
