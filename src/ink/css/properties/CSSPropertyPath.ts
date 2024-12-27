import { CSSKeywordValue } from '../cssom';
import type { CSSProperty } from '../CSSProperty';
import { mergePaths, parsePath } from '../parser/path';
import { ParsedPathStyleProps, DisplayObject } from '../../displayObjects';
import { Rectangle } from '../../shapes/Rectangle';
import { Shape } from '../../displayObjects/types';
import { AbsoluteArray } from '../../utils/path';

export class CSSPropertyPath
  implements Partial<CSSProperty<ParsedPathStyleProps['path'], ParsedPathStyleProps['path']>>
{
  /**
   * path2Curve
   */
  parser = parsePath;
  parserWithCSSDisabled = parsePath;

  calculator(name: string, oldParsed: ParsedPathStyleProps['path'], parsed: ParsedPathStyleProps['path']) {
    // unset
    if (parsed instanceof CSSKeywordValue && parsed.value === 'unset') {
      return {
        absolutePath: [] as unknown as AbsoluteArray,
        hasArc: false,
        segments: [],
        polygons: [],
        polylines: [],
        curve: null,
        totalLength: 0,
        rect: new Rectangle(0, 0, 0, 0)
      };
    }
    return parsed;
  }

  mixer = mergePaths;

  /**
   * update local position
   */
  postProcessor(object: DisplayObject, attributes: string[]) {
    if (object.nodeName === Shape.PATH && attributes.indexOf('transform') === -1) {
      const { defX = 0, defY = 0 } = object.parsedStyle as ParsedPathStyleProps;
      object.setLocalPosition(defX, defY);
    }
  }
}