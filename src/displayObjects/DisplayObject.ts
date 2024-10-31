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
export class DisplayObject<StyleProps extends BaseStyleProps = any> {
  config: DisplayObjectConfig<StyleProps>;
  id: string | undefined;
  name: string | undefined;
  class: string | undefined;
  nodeName: string;

  attributes: StyleProps = {} as StyleProps;

  constructor(config: DisplayObjectConfig<StyleProps>) {
    this.config = config;
    this.id = this.config.id;
    this.name = this.config.name;
    this.class = this.config.class;
    this.nodeName = this.config.type || Shape.GROUP;

    this.initAttributes(this.config.style);
  }

  // FIXME:
  initAttributes(attributes: StyleProps = {} as StyleProps) {}

  setAttribute<Key extends keyof StyleProps>(
    name: Key,
    value: StyleProps[Key],
    force = false
  ) {
    if (isUndefined(name)) return;

    if (force || value !== this.attributes[name]) {
      this.attributes[name] = value;
    }
  }

  getPosition() {}

  setPosition() {}

  getBBox() {}

  cloneNode(deep?: boolean) {}

  destroy() {}
}
