/**
 * The embed entry's composition root: one slice of the demo (`#/cube`) on a
 * transparent ground, for an allow-listed host (`./bridge.ts`). No dock, hero,
 * editor or router. The engine is warmed before mount, as the demo's own root
 * does (`../main.ts`).
 */
import { createApp } from "vue";
import "@styles/style.css";
import "./embed.css";
import { warmKfEngine } from "@kf-engine";
import EmbedApp from "./EmbedApp.vue";

const app = createApp(EmbedApp);
app.config.errorHandler = (thrown, _instance, info) => {
    console.error(`[keyframes.js embed] unhandled failure (vue · ${info})`, thrown);
};
void warmKfEngine()
    .catch(() => undefined)
    .finally(() => app.mount("#app"));
