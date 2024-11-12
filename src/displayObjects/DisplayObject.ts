import { BaseStyleProps, Shape } from "@/types/displayObject";
import { isUndefined } from "lodash";

export interface DisplayObjectConfig<styleProps> {
  id?: string;
  name?: string;
  class?: string;
  style?: styleProps;
  type?: Shape | string;
  visible?: boolean;
  interactive?: boolean;
}

/**
 * 更新位置 更新scale 设置属性
 * 获取包围盒
 * 销毁
 *
 */
export class DisplayObject<
  StyleProps extends BaseStyleProps = any,
> extends Element {
  constructor() {
    super();
  }

  setAttribute() {}

  destroy() {}
}
