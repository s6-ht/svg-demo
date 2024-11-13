import { BaseStyleProps, Shape } from "@/types/displayObject";
import { DisplayObject, DisplayObjectConfig } from "./DisplayObject";

export interface RectStyleProps extends BaseStyleProps {
  x?: number | string;
  y?: number | string;
  width: number | string;
  height: number | string;
  radius?: number | string | number[]; // tl, tr, br, bl
}

export class Rect extends DisplayObject<RectStyleProps> {
  constructor({ style, ...rest }: DisplayObjectConfig<RectStyleProps> = {}) {
    super({
      type: Shape.RECT,
      style,
      ...rest,
    });
  }
}
