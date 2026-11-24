import { useMediaQuery } from "@vueuse/core";
import type { Ref } from "vue";

/**
 * Whether a dock seat's tooltip may open: only for a hovering pointer (a desk's
 * mouse or trackpad). On a phone there is no hover, so a tooltip could only
 * open on the tap itself, under the finger and over the seat beside it, after
 * the seat has already acted (FORTY-SIXTH A, K-4: a tap on the theme seat
 * opened "Dark mode" under the dock). Every seat keeps its accessible name.
 * (Glass's Tooltip opens on a tap by default; a provider-level hover gate is
 * glass's to offer.)
 */
export const useDockTip = (): Readonly<Ref<boolean>> => useMediaQuery("(hover: hover) and (pointer: fine)");
