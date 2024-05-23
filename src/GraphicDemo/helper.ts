import { ISprite, TSizeCoordinate } from "./types/sprite";

/**
 * 根据className查找父元素
 */
export function findParentByClass(dom: any, className: string) {
  if (!dom || !className || dom.tagName === "BODY") return;

  if (dom.classList?.contains(className)) {
    return dom;
  }

  return findParentByClass(dom.parentNode, className);
}

/**
 * 获取精灵的BBox信息
 * @param sprite
 */
export function getSpriteBBox(sprite: ISprite): TSizeCoordinate {
  if (!sprite.attrs)
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };

  const posMap = {
    minX: Infinity,
    minY: Infinity,
    maxX: 0,
    maxY: 0,
  };
  const { size, coordinate } = sprite.attrs;
  const { width = 0, height = 0 } = size;
  const { x = 0, y = 0 } = coordinate;

  if (x < posMap.minX) {
    posMap.minX = x;
  }

  if (y < posMap.minY) {
    posMap.minY = y;
  }

  if (x + width > posMap.maxX) {
    posMap.maxX = x + width;
  }

  if (y + height > posMap.maxY) {
    posMap.maxY = y + height;
  }

  return {
    width: posMap.maxX - posMap.minX,
    height: posMap.maxY - posMap.minY,
    x: posMap.minX,
    y: posMap.minY,
  };
}
