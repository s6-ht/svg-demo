import type { DisplayObject } from '../../displayObjects';
import { ParsedBaseStyleProps, Shape } from '../../displayObjects/types';
import type { CSSProperty } from '../CSSProperty';
import { parsePoints, mergePoints } from '../parser/points';

export class CSSPropertyPoints
  implements
    Partial<
      CSSProperty<
        {
          points: [number, number][];
          totalLength: number;
          segments: [number, number][];
        },
        {
          points: [number, number][];
          totalLength: number;
          segments: [number, number][];
        }
      >
    >
{
  parser = parsePoints;

  /**
   * update local position
   */
  postProcessor(object: DisplayObject, attributes: string[]) {
    if (object.nodeName === Shape.POLYGON && attributes.indexOf('transform') === -1) {
      const { defX, defY } = object.parsedStyle as ParsedBaseStyleProps;
      object.setLocalPosition(defX, defY);
    }
  }

  mixer = mergePoints;
}
