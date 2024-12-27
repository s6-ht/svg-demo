import { ElementEvent, IEventTarget } from '../events/types';
import { MutationEvent } from '../events/MutationEvent';
import {
  BaseStyleProps,
  ICSSStyleDeclaration,
  ParsedBaseStyleProps,
} from '../displayObjects/types';
import { Node } from './Node';
import {
  ERROR_MSG_APPEND_DESTROYED_ELEMENT,
  ERROR_MSG_METHOD_NOT_IMPLEMENTED,
} from '../constants/error';
import { runtime } from '../manager/GlobalRuntimeManager';
import { isNil, isSymbol } from 'lodash';
import { Rectangle } from '../shapes/Rectangle';
import { AABB } from '../shapes/AABB';
import { Renderable } from '../components/Renderable';
import { Transform } from '../components/Transform';
import { Sortable } from '../components/Sortable';
import { Geometry } from '../components/Geometry';
import { CustomEvent } from '../events/CustomEvent';
import { formatAttributeName } from '../utils/assert';
import { unsetKeywordValue } from '../css/CSS';
import { IElement, INode, IChildNode } from './types';
import { DisplayObject } from '../displayObjects';
import { Cullable, Strategy } from '../components';

let entityCounter = 0;
export function resetEntityCounter() {
  entityCounter = 0;
}

const insertedEvent = new MutationEvent(
  ElementEvent.INSERTED,
  null,
  '',
  '',
  '',
  0,
  '',
  '',
);
const removedEvent = new MutationEvent(
  ElementEvent.REMOVED,
  null,
  '',
  '',
  '',
  0,
  '',
  '',
);
const destroyEvent = new CustomEvent(ElementEvent.DESTROY);

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element
 *  EventTarget <-- Node  <-- Element
 *
 * @export
 * @class Element
 * @extends {Node}
 * @implements {IElement<StyleProps, ParsedStyleProps>}
 * @template StyleProps
 * @template ParsedStyleProps
 */
export class Element<
    StyleProps extends BaseStyleProps = any,
    ParsedStyleProps extends ParsedBaseStyleProps = any,
  >
  extends Node
  implements IElement<StyleProps, ParsedStyleProps>
{
  static isElement(
    target: IEventTarget | INode | IElement,
  ): target is IElement {
    return !!(target as IElement).getAttribute;
  }

  entity = entityCounter++;

  renderable: Renderable = {
    bounds: undefined,
    boundsDirty: true,
    renderBounds: undefined,
    renderBoundsDirty: true,
    dirtyRenderBounds: undefined,
    dirty: false,
    proxyNodeName: undefined,
  };

  cullable: Cullable = {
    strategy: Strategy.Standard,
    visibilityPlaneMask: -1,
    visible: true,
    enable: true,
  };

  transformable: Transform = {
    dirtyFlag: false,
    localDirtyFlag: false,
    frozen: false,

    localPosition: [0, 0, 0],
    localRotation: [0, 0, 0, 1],
    localScale: [1, 1, 1],
    localTransform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    localSkew: [0, 0],
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
    scaling: [1, 1, 1],
    worldTransform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    origin: [0, 0, 0],
  };

  sortable: Sortable = {
    dirty: false,
    sorted: undefined,
    renderOrder: 0,
    dirtyChildren: [],
    dirtyReason: undefined,
  };

  geometry: Geometry = {
    contentBounds: undefined,
    renderBounds: undefined,
  };

  id: string;

  get className() {
    return (this.getAttribute('class') as string) || '';
  }

  set className(className: string) {
    this.setAttribute('class', className);
  }

  name: string;

  namespaceURI = 'g';

  get classList() {
    return this.className.split(' ').filter((c) => c !== '');
  }

  scrollLeft = 0;
  scrollTop = 0;

  clientTop = 0;
  clientLeft = 0;

  get tagName(): string {
    return this.nodeName;
  }

  get children(): IElement[] {
    return this.childNodes as unknown as IElement[];
  }

  get childElementCount(): number {
    return this.childNodes.length;
  }

  get firstElementChild(): IElement | null {
    return this.firstChild as unknown as IElement;
  }

  get lastElementChild(): IElement | null {
    return this.lastChild as unknown as IElement;
  }

  get parentElement(): IElement | null {
    return this.parentNode as unknown as IElement;
  }

  get nextSibling(): IElement | null {
    if (this.parentNode) {
      const index = this.parentNode.childNodes.indexOf(this);
      return (
        (this.parentNode.childNodes[index + 1] as unknown as IElement) || null
      );
    }

    return null;
  }

  get previousSibling(): IElement | null {
    if (this.parentNode) {
      const index = this.parentNode.childNodes.indexOf(this);
      return (this.parentNode.childNodes[index - 1] as IElement) || null;
    }

    return null;
  }

  cloneNode(deep?: boolean): this {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  appendChild<T extends INode>(child: T, index?: number): T {
    if ((child as unknown as Element).destroyed) {
      throw new Error(ERROR_MSG_APPEND_DESTROYED_ELEMENT);
    }

    runtime.sceneGraphManager.attach(child, this, index);

    if (this.ownerDocument?.defaultView) {
      this.ownerDocument.defaultView.mountChildren(child);
    }

    insertedEvent.relatedNode = this as IElement;
    child.dispatchEvent(insertedEvent);

    return child;
  }

  insertBefore<T extends INode>(newChild: T, refChild: INode | null): T {
    if (!refChild) {
      this.appendChild(newChild);
    } else {
      if (newChild.parentElement) {
        newChild.parentElement.removeChild(newChild);
      }

      const index = this.childNodes.indexOf(refChild as IChildNode);

      if (index === -1) {
        this.appendChild(newChild);
      } else {
        this.appendChild(newChild, index);
      }
    }

    return newChild;
  }

  replaceChild<T extends INode>(newChild: INode, oldChild: T): T {
    const index = this.childNodes.indexOf(oldChild as unknown as IChildNode);
    this.removeChild(oldChild);
    this.appendChild(newChild, index);
    return oldChild;
  }

  removeChild<T extends INode>(child: T): T {
    // should emit on itself before detach
    removedEvent.relatedNode = this as IElement;
    child.dispatchEvent(removedEvent);

    if (child.ownerDocument?.defaultView) {
      child.ownerDocument.defaultView.unmountChildren(child);
    }

    // remove from scene graph
    runtime.sceneGraphManager.detach(child);
    return child;
  }

  removeChildren() {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      const child = this.childNodes[i] as this;
      this.removeChild(child);
    }
  }

  destroyChildren() {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      const child = this.childNodes[i] as this;
      if (child.childNodes.length) {
        child.destroyChildren();
      }
      child.destroy();
    }
  }

  matches(selector: string): boolean {
    return runtime.sceneGraphManager.matches(selector, this as IElement);
  }
  getElementById<E extends IElement = IElement>(id: string): E | null {
    return runtime.sceneGraphManager.querySelector<IElement, E>(
      `#${id}`,
      this as IElement,
    );
  }
  getElementsByName<E extends IElement = IElement>(name: string): E[] {
    return runtime.sceneGraphManager.querySelectorAll<IElement, E>(
      `[name="${name}"]`,
      this as IElement,
    );
  }
  getElementsByClassName<E extends IElement = IElement>(
    className: string,
  ): E[] {
    return runtime.sceneGraphManager.querySelectorAll<IElement, E>(
      `.${className}`,
      this as IElement,
    );
  }
  getElementsByTagName<E extends IElement = IElement>(tagName: string): E[] {
    return runtime.sceneGraphManager.querySelectorAll<IElement, E>(
      tagName,
      this as IElement,
    );
  }
  querySelector<E extends IElement = IElement>(selectors: string): E | null {
    return runtime.sceneGraphManager.querySelector<IElement, E>(
      selectors,
      this as IElement,
    );
  }
  querySelectorAll<E extends IElement = IElement>(selectors: string): E[] {
    return runtime.sceneGraphManager.querySelectorAll<IElement, E>(
      selectors,
      this as IElement,
    );
  }

  closest<E extends IElement = IElement>(selectors: string): E | null {
    let el = this as unknown as E;
    do {
      if (runtime.sceneGraphManager.matches(selectors, el)) return el;
      el = el.parentElement as E;
    } while (el !== null);
    return null;
  }

  find<E extends IElement = IElement>(filter: (node: E) => boolean): E | null {
    let target: E | null = null;
    this.forEach((object) => {
      if (object !== this && filter(object as E)) {
        target = object as E;
        return true;
      }
      return false;
    });
    return target;
  }

  findAll<E extends IElement = IElement>(filter: (node: E) => boolean): E[] {
    const objects: E[] = [];
    this.forEach((object) => {
      if (object !== this && filter(object as E)) {
        objects.push(object as E);
      }
    });
    return objects;
  }

  after(...nodes: INode[]) {
    if (this.parentNode) {
      const index = this.parentNode.childNodes.indexOf(this);
      nodes.forEach((node, i) =>
        this.parentNode?.appendChild(node!, index + i + 1),
      );
    }
  }

  before(...nodes: INode[]) {
    if (this.parentNode) {
      const index = this.parentNode.childNodes.indexOf(this);
      const [first, ...rest] = nodes;
      this.parentNode.appendChild(first!, index);
      (first as IChildNode).after(...rest);
    }
  }

  replaceWith(...nodes: INode[]) {
    this.after(...nodes);
    this.remove();
  }

  append(...nodes: INode[]) {
    nodes.forEach((node) => this.appendChild(node));
  }

  prepend(...nodes: INode[]) {
    nodes.forEach((node, i) => this.appendChild(node, i));
  }

  replaceChildren(...nodes: INode[]) {
    while (this.childNodes.length && this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.append(...nodes);
  }

  remove(): this {
    if (this.parentNode) {
      return this.parentNode.removeChild(this);
    }
    return this;
  }

  destroyed = false;
  destroy() {
    // destroy itself before remove
    this.dispatchEvent(destroyEvent);

    // remove from scene graph first
    this.remove();

    // remove event listeners
    this.emitter.removeAllListeners();

    this.destroyed = true;
  }

  getGeometryBounds(): AABB {
    return runtime.sceneGraphManager.getGeometryBounds(this);
  }

  getRenderBounds(): AABB {
    return runtime.sceneGraphManager.getBounds(this, true);
  }

  /**
   * get bounds in world space, account for children
   */
  getBounds(): AABB {
    return runtime.sceneGraphManager.getBounds(this);
  }

  /**
   * get bounds in local space, account for children
   */
  getLocalBounds(): AABB {
    return runtime.sceneGraphManager.getLocalBounds(this);
  }

  getBoundingClientRect(): Rectangle {
    return runtime.sceneGraphManager.getBoundingClientRect(this);
  }

  getClientRects() {
    return [this.getBoundingClientRect()];
  }

  style: StyleProps & ICSSStyleDeclaration<StyleProps> = {} as StyleProps &
    ICSSStyleDeclaration<StyleProps>;
  computedStyle: any = runtime.enableCSSParsing
    ? {
        anchor: unsetKeywordValue,
        opacity: unsetKeywordValue,
        fillOpacity: unsetKeywordValue,
        strokeOpacity: unsetKeywordValue,
        fill: unsetKeywordValue,
        stroke: unsetKeywordValue,
        transform: unsetKeywordValue,
        transformOrigin: unsetKeywordValue,
        visibility: unsetKeywordValue,
        pointerEvents: unsetKeywordValue,
        lineWidth: unsetKeywordValue,
        lineCap: unsetKeywordValue,
        lineJoin: unsetKeywordValue,
        increasedLineWidthForHitTesting: unsetKeywordValue,
        fontSize: unsetKeywordValue,
        fontFamily: unsetKeywordValue,
        fontStyle: unsetKeywordValue,
        fontWeight: unsetKeywordValue,
        fontVariant: unsetKeywordValue,
        textAlign: unsetKeywordValue,
        textBaseline: unsetKeywordValue,
        textTransform: unsetKeywordValue,
        zIndex: unsetKeywordValue,
        filter: unsetKeywordValue,
        shadowType: unsetKeywordValue,
      }
    : null;

  parsedStyle: ParsedStyleProps = {} as ParsedStyleProps;

  computedStyleMap() {
    return new Map(Object.entries(this.computedStyle));
  }

  readonly attributes: StyleProps = {} as StyleProps;

  getAttributeNames(): string[] {
    return Object.keys(this.attributes);
  }

  getAttribute(name: keyof StyleProps) {
    if (isSymbol(name)) {
      return runtime.enableCSSParsing ? null : undefined;
    }

    let value = this.attributes[name];
    if (value === undefined) {
      const attributeName = formatAttributeName(name as string);
      value = this.attributes[attributeName];

      return runtime.enableCSSParsing ? (isNil(value) ? null : value) : value;
    } else {
      return value;
    }
  }

  hasAttribute(qualifiedName: string): boolean {
    return this.getAttributeNames().includes(qualifiedName);
  }

  hasAttributes(): boolean {
    return !!this.getAttributeNames().length;
  }

  removeAttribute(attributeName: keyof StyleProps) {
    this.setAttribute(attributeName, null);
    delete this.attributes[attributeName];
  }

  setAttribute<Key extends keyof StyleProps>(
    attributeName: Key,
    value: StyleProps[Key],
    force = false,
  ) {
    this.attributes[attributeName] = value;
  }

  getAttributeNS(namespace: string, localName: string): string {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  getAttributeNode(qualifiedName: string): Attr {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  getAttributeNodeNS(namespace: string, localName: string): Attr {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  hasAttributeNS(namespace: string, localName: string): boolean {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  removeAttributeNS(namespace: string, localName: string): void {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  removeAttributeNode(attr: Attr): Attr {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  setAttributeNS(
    namespace: string,
    qualifiedName: string,
    value: string,
  ): void {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  setAttributeNode(attr: Attr): Attr {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  setAttributeNodeNS(attr: Attr): Attr {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  toggleAttribute(qualifiedName: string, force?: boolean): boolean {
    throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }
}
