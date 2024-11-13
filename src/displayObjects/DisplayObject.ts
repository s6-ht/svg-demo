import { Renderable } from "@/components/Renderable";
import { BaseStyleProps, Shape } from "@/types/displayObject";

let entityCounter = 0;

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
export class DisplayObject<StyleProps extends BaseStyleProps = any> {
  config: DisplayObjectConfig<StyleProps>;
  nodeName: string;
  renderable: Renderable = {};

  entity = entityCounter++;
  name: string | undefined = undefined;

  constructor(config: DisplayObjectConfig<StyleProps>) {
    this.config = config;
    this.nodeName = this.config.type || Shape.GROUP;
    this.name = this.config.name;

    this.initAttributes();
  }

  initAttributes() {}

  setAttribute() {}

  destroy() {}
}
