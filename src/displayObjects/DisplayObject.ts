import { Renderable } from "@/components/Renderable";
import {
  BaseStyleProps,
  ParsedBaseStyleProps,
  Shape,
} from "@/types/displayObject";

let entityCounter = 0;

const DEFAULT_PARSED_STYLE_PROPS = {
  anchor: [0, 0],
  fill: `#000`,
  stroke: "#000",
  transform: [],
  zIndex: 0,
  filter: [],
  shadowType: "outer",
  miterLimit: 10,
};

const DEFAULT_PARSED_STYLE_PROPS_CSS_DISABLED = {
  ...DEFAULT_PARSED_STYLE_PROPS,
  opacity: 1,
  fillOpacity: 1,
  strokeOpacity: 1,
  visibility: "visible",
  pointerEvents: "auto",
  lineWidth: 1,
  lineCap: "butt",
  lineJoin: "miter",
  increasedLineWidthForHitTesting: 0,
  fillRule: "nonzero",
};

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
  ParsedStyleProps extends ParsedBaseStyleProps = any,
> {
  config: DisplayObjectConfig<StyleProps>;
  nodeName: string;
  renderable: Renderable = {};

  entity = entityCounter++;
  name: string | undefined = undefined;

  parsedStyle: ParsedStyleProps = {} as ParsedStyleProps;

  constructor(config: DisplayObjectConfig<StyleProps>) {
    this.config = config;
    this.nodeName = this.config.type || Shape.GROUP;
    this.name = this.config.name;

    Object.assign(this.parsedStyle, DEFAULT_PARSED_STYLE_PROPS_CSS_DISABLED);

    this.initAttributes();
  }

  initAttributes() {}

  setAttribute() {}

  destroy() {}
}
