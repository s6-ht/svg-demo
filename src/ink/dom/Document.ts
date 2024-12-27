import { Node } from "./Node";
import { isFunction } from "lodash";
import { IDocument, IElement, ICanvas, INode } from "./types";

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document
 *  EventTarget <-- Node <-- Document
 * @export
 * @class Document
 * @extends {Node}
 * @implements {IDocument}
 */
export class Document extends Node implements IDocument {
  constructor() {
    super();

    this.nodeName = "document";

    // create timeline
    try {
      this.timeline = new runtime.AnimationTimeline(this);
    } catch (error) {}

    const initialStyle = {};
    BUILT_IN_PROPERTIES.forEach(({ n, inh, d }) => {
      if (inh && d) {
        initialStyle[n] = isFunction(d) ? d(Shape.GROUP) : d;
      }
    });

    this.documentElement = new Group({
      id: "g-root",
      style: initialStyle,
    });

    this.documentElement.ownerDocument = this;
    this.documentElement.parentNode = this;
    this.childNodes = [this.documentElement];
  }

  get children(): IElement[] {
    return this.childNodes as IElement[];
  }

  get childElementCount(): number {
    return this.childNodes.length;
  }

  get firstElementChild(): IElement | null {
    return this.firstChild as IElement;
  }

  get lastElementChild(): IElement | null {
    return this.lastChild as IElement;
  }

  /**
   * only document has defaultView, points to canvas,
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView
   */
  defaultView: ICanvas | null = null;

  /**
   * the root element of document, eg. <html>
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement
   */
  readonly documentElement: Group;

  readonly timeline: IAnimationTimeline;

  readonly ownerDocument = null;

  createElement<
    T extends DisplayObject<StyleProps>,
    StyleProps extends BaseStyleProps,
  >(tagName: string, options: DisplayObjectConfig<StyleProps>): T {
    if (tagName === "svg") {
      return this.documentElement as unknown as T;
    }

    let customShape = this.defaultView.customElements.get(tagName);

    if (!customShape) {
      console.warn("Invalid tagName: ", tagName);
      customShape = tagName === "tspan" ? Text : Group;
    }

    const shape = new customShape(options) as unknown as T;
    shape.ownerDocument = this;
    return shape;
  }

  cloneNode(deep?: boolean): this {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  destroy(): void {
    try {
      this.documentElement.destroyChildren();
      this.timeline.destroy();
    } catch (e) {}
  }

  // pick element by element bbox
  elementsFromBBox(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ): DisplayObject[] {
    const hitTestList: DisplayObject[] = [];
    return hitTestList;
  }

  elementFromPointSync(x: number, y: number): DisplayObject {
    // TODO
    return this.documentElement;
  }

  async elementFromPoint(x: number, y: number): Promise<DisplayObject> {
    // TODO: do pick
    return this.documentElement;
  }

  elementsFromPointSync(x: number, y: number): DisplayObject[] {
    // TODO: do pick
    return [];
  }

  async elementsFromPoint(x: number, y: number): Promise<DisplayObject[]> {
    // TODO: do pick
    return [];
  }

  getElementById<E extends IElement = IElement>(id: string): E | null {
    return this.documentElement.getElementById(id);
  }

  getElementsByName<E extends IElement = IElement>(name: string): E[] {
    return this.documentElement.getElementsByName(name);
  }

  getElementsByTagName<E extends IElement = IElement>(tagName: string): E[] {
    return this.documentElement.getElementsByTagName(tagName);
  }

  getElementsByClassName<E extends IElement = IElement>(
    className: string
  ): E[] {
    return this.documentElement.getElementsByClassName(className);
  }

  querySelector<E extends IElement = IElement>(selectors: string): E | null {
    return this.documentElement.querySelector(selectors);
  }

  querySelectorAll<E extends IElement = IElement>(selectors: string): E[] {
    return this.documentElement.querySelectorAll(selectors);
  }

  find<E extends IElement = IElement>(filter: (node: E) => boolean): E | null {
    return this.documentElement.find(filter);
  }

  findAll<E extends IElement = IElement>(filter: (node: E) => boolean): E[] {
    return this.documentElement.findAll(filter);
  }

  appendChild<T extends INode>(newChild: T, index?: number): T {
    throw new Error(ERROR_MSG_USE_DOCUMENT_ELEMENT);
  }

  insertBefore<T extends INode>(newChild: T, refChild: INode | null): T {
    throw new Error(ERROR_MSG_USE_DOCUMENT_ELEMENT);
  }

  removeChild<T extends INode>(oldChild: T, destroy?: boolean): T {
    throw new Error(ERROR_MSG_USE_DOCUMENT_ELEMENT);
  }

  replaceChild<T extends INode>(
    newChild: INode,
    oldChild: T,
    destroy?: boolean
  ): T {
    throw new Error(ERROR_MSG_USE_DOCUMENT_ELEMENT);
  }

  append(...nodes: INode[]): void {
    throw new Error(ERROR_MSG_USE_DOCUMENT_ELEMENT);
  }

  prepend(...nodes: INode[]): void {
    throw new Error(ERROR_MSG_USE_DOCUMENT_ELEMENT);
  }
}
