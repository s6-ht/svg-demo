import { Circle, Rect, Line, Group, Path, Polygon } from '../displayObjects';
import { ShapeType } from '../displayObjects/types';
import { ICustomElementConstructor, ICustomElementRegistry } from '../types/CustomElementRegistry';
import { INode } from './types';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry
 *
 * @export
 * @class CustomElementRegistry
 * @implements {ICustomElementRegistry}
 */
export class CustomElementRegistry implements ICustomElementRegistry {
  private _registry: Record<string, ICustomElementConstructor> = {};

  constructor() {
    this.define(ShapeType.CIRCLE, Circle);
    this.define(ShapeType.RECTANGLE, Rect);
    this.define(ShapeType.IMAGE, Image);
    this.define(ShapeType.LINE, Line);
    this.define(ShapeType.GROUP, Group);
    this.define(ShapeType.PATH, Path);
    this.define(ShapeType.POLYGON, Polygon);
    this.define(ShapeType.TEXT, Text);
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
   *
   * @param {string} name
   * @param {ICustomElementConstructor} constructor
   * @param {ElementDefinitionOptions} [options]
   * @memberof CustomElementRegistry
   */
  define(name: string, constructor: ICustomElementConstructor, options?: ElementDefinitionOptions): void {
    this._registry[name] = constructor;
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/get
   *
   * @template T
   * @param {string} name
   * @return {*}  {(T | undefined)}
   * @memberof CustomElementRegistry
   */
  get<T extends ICustomElementConstructor>(name: string): T | undefined {
    return this._registry[name] ? (this._registry[name] as T) : undefined;
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/upgrade
   *
   * @param {INode} root
   * @memberof CustomElementRegistry
   */
  upgrade(root: INode): void {
    throw new Error('Method not implemented.');
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined
   *
   * @param {string} name
   * @return {*}  {Promise<ICustomElementConstructor>}
   * @memberof CustomElementRegistry
   */
  whenDefined(name: string): Promise<ICustomElementConstructor> {
    throw new Error('Method not implemented.');
  }
}
