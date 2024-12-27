import { BaseStyleProps, Shape } from "@/ink/types/displayObject";
import { DisplayObject, DisplayObjectConfig } from "./DisplayObject";

export interface GroupStyleProps extends BaseStyleProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
}

export class Group extends DisplayObject {
  constructor({ style, ...rest }: DisplayObjectConfig<GroupStyleProps> = {}) {
    super({
      type: Shape.GROUP,
      style,
      ...rest,
    });
  }
}
