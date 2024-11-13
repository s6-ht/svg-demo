import { DisplayObject } from "@/displayObjects/DisplayObject";
import { Shape } from "@/types/displayObject";
import { createSVGElement } from "./dom";

export interface ElementLifeCycleContribution {
  createElement: (
    object: DisplayObject,
    svgElementMap: WeakMap<SVGElement, DisplayObject>
  ) => SVGElement;
}

export const SHAPE2TAGS: Record<Shape | string, string> = {
  [Shape.RECT]: "path",
  [Shape.CIRCLE]: "circle",
  [Shape.GROUP]: "g",
  [Shape.LINE]: "line",
  [Shape.TEXT]: "text",
  [Shape.PATH]: "path",
};

/**
 * 管理svg元素的生命周期 创建、销毁元素、更新元素属性
 */
export class DefaultElementLifeCycleContribution
  implements ElementLifeCycleContribution
{
  constructor() {}

  createElement(
    object: DisplayObject,
    svgElementMap: WeakMap<SVGElement, DisplayObject>
  ) {
    const type = SHAPE2TAGS[object.nodeName];
    const $el = createSVGElement(type);
    svgElementMap.set($el, object);

    return $el;
  }
}
