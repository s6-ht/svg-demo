import type { DisplayObject } from '../../displayObjects';
import { runtime } from '../../manager/GlobalRuntimeManager';
import { CSSKeywordValue } from '../cssom';
import type { CSSProperty } from '../CSSProperty';

/**
 * clipPath / textPath / offsetPath
 */
export class CSSPropertyClipPath implements Partial<CSSProperty<DisplayObject, DisplayObject>> {
  calculator(name: string, oldPath: DisplayObject, newPath: DisplayObject, object: DisplayObject) {
    // unset
    if (newPath instanceof CSSKeywordValue) {
      newPath = null;
    }

    runtime.sceneGraphManager.updateDisplayObjectDependency(name, oldPath, newPath, object);

    if (name === 'clipPath') {
      // should affect children
      object.forEach((leaf) => {
        if (leaf.childNodes.length === 0) {
          runtime.sceneGraphManager.dirtifyToRoot(leaf);
        }
      });
    }

    return newPath;
  }
}
