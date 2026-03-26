import type { InjectionKey, Ref } from "vue";

export const CONTROLS_PANE_HOVER_KEY: InjectionKey<Ref<boolean>> = Symbol("controlsPaneHover");
export const TABS_EXTERNALLY_MANAGED_KEY: InjectionKey<boolean> = Symbol("tabsExternallyManaged");
