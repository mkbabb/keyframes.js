import type { ValueUnit } from "@src/units";
import type { Color } from "@src/units/color";
import type { ColorSpace } from "@src/units/color/constants";

export type ColorValueUnit = ValueUnit<Color<ValueUnit<number>>, "color">;

export type { ColorSpace, Color, ValueUnit };
