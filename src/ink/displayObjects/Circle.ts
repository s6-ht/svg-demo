import { BaseStyleProps, Shape } from "@/ink/types/displayObject";
import { DisplayObject, DisplayObjectConfig } from "./DisplayObject";

export interface CircleStyle extends BaseStyleProps {
  cx: number;
  cy: number;
  r: number;
}

export class Circle extends DisplayObject<CircleStyle> {
  constructor({ style, ...rest }: DisplayObjectConfig<CircleStyle>) {
    super({
      type: Shape.CIRCLE,
      style,
      ...rest,
    });
  }
}
