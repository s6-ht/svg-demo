import { BaseStyleProps } from "@/types/displayObject";
import { DisplayObject } from "./DisplayObject";

export interface CircleStyle extends BaseStyleProps {
  cx: number;
  cy: number;
  r: number;
}

export class Circle extends DisplayObject<CircleStyle> {
  constructor() {}
}
