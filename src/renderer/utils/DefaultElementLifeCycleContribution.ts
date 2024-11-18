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

export const SHAPE_UPDATE_DEPS: Record<Shape | string, string[]> = {
  [Shape.CIRCLE]: ["r"],
  [Shape.RECT]: ["width", "height", "radius"],
  [Shape.LINE]: [
    "x1",
    "x2",
    "y1",
    "y2",
    "markerStart",
    "markerEnd",
    "markerStartOffset",
    "markerEndOffset",
  ],
  [Shape.PATH]: [
    "path",
    "markerStart",
    "markerEnd",
    "markerMid",
    "markerStartOffset",
    "markerEndOffset",
  ],
  [Shape.TEXT]: [
    "text",
    "font",
    "fontSize",
    "fontFamily",
    "fontStyle",
    "fontWeight",
    "fontVariant",
    "lineHeight",
    "letterSpacing",
    "wordWrap",
    "wordWrapWidth",
    "maxLines",
    "leading",
    "textBaseline",
    "textAlign",
    "textTransform",
    "textOverflow",
    "textPath",
    "textPathSide",
    "textPathStartOffset",
    "textDecorationLine",
    "textDecorationColor",
    "textDecorationStyle",
    // 'whiteSpace',
    "dx",
    "dy",
  ],
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

  shouldUpdateElementAttribute(object: DisplayObject, attributeName: string) {
    const { nodeName } = object;
    return (SHAPE_UPDATE_DEPS[nodeName] || []).indexOf(attributeName) > -1;
  }

  updateElementAttribute(object: DisplayObject) {
    // @ts-ignore
    const { $el } = object.elementSVG as ElementSVG;
    const { nodeName, parsedStyle } = object;

    switch (nodeName) {
      case Shape.RECT: {
        break;
      }
    }
  }
}
