import type { Circle, DisplayObject, Line, Rect } from '../../displayObjects';
import type { CSSUnitValue } from '../cssom';
import type { CSSProperty } from '../CSSProperty';
import { CSSPropertyLengthOrPercentage } from './CSSPropertyLengthOrPercentage';
import { ParsedBaseStyleProps, Shape } from '../../displayObjects/types';
import { parsedTransformToMat4 } from '../../utils/math';
import { isNil } from 'lodash';

/**
 * local position
 */
export class CSSPropertyLocalPosition
  extends CSSPropertyLengthOrPercentage
  implements Partial<CSSProperty<CSSUnitValue, number>>
{
  /**
   * update local position
   */
  postProcessor(object: DisplayObject, attributes: string[]) {
    let x: number;
    let y: number;
    let z: number;

    switch (object.nodeName) {
      case Shape.CIRCLE:
        const { cx, cy } = (object as Circle).parsedStyle;
        if (!isNil(cx)) {
          x = cx;
        }
        if (!isNil(cy)) {
          y = cy;
        }
        break;
      case Shape.LINE:
        const { x1, x2, y1, y2 } = (object as Line).parsedStyle;
        const minX = Math.min(x1, x2);
        const minY = Math.min(y1, y2);
        x = minX;
        y = minY;
        z = 0;
        break;
      case Shape.RECT:
      case Shape.IMAGE:
      case Shape.GROUP:
      case Shape.TEXT:
        if (!isNil((object as Rect).parsedStyle.x)) {
          x = (object as Rect).parsedStyle.x;
        }
        if (!isNil((object as Rect).parsedStyle.y)) {
          y = (object as Rect).parsedStyle.y;
        }
        break;
      default:
        break;
    }

    if (object.nodeName !== Shape.PATH && object.nodeName !== Shape.POLYGON) {
      object.parsedStyle.defX = x || 0;
      object.parsedStyle.defY = y || 0;
    }

    const needResetLocalPosition = !isNil(x) || !isNil(y) || !isNil(z);
    // only if `transform` won't be processed later
    if (needResetLocalPosition && attributes.indexOf('transform') === -1) {
      // account for current transform if needed
      const { transform } = object.parsedStyle as ParsedBaseStyleProps;
      if (transform && transform.length) {
        parsedTransformToMat4(transform, object);
      } else {
        const [ox, oy, oz] = object.getLocalPosition();
        object.setLocalPosition(isNil(x) ? ox : x, isNil(y) ? oy : y, isNil(z) ? oz : z);
      }
    }
  }
}
