import { ContextManager } from '../manager/ContextManager';
import { EventManager } from '../manager/EventManager';
import { GlobalRuntime } from '../manager/GlobalRuntimeManager';
import { RenderingManager } from '../manager/RenderingManager';
import { IRenderer, RenderingPlugin } from '../renderer/types';
import { RenderingContext } from '../manager/types';
import {
  IEventTarget,
  EventListenerOrEventListenerObject,
} from '../events/types';
import { CustomElementRegistry } from './CustomElementRegistry';
import { ICamera } from '../camera';
import { DisplayObject } from '../displayObjects';
import { AABB } from '../shapes/AABB';
import { Rectangle } from '../shapes/Rectangle';
import { IAnimationTimeline } from '../types/Animation';
import {
  Cursor,
  BaseStyleProps,
  DisplayObjectConfig,
  ColorType,
  ICSSStyleDeclaration,
} from '../displayObjects/types';
import { PointLike } from '../shapes/Point';

export type CanvasProxy = ICanvas;

export interface ICanvas extends IEventTarget, AnimationFrameProvider {
  document: IDocument;
  customElements: CustomElementRegistry;

  devicePixelRatio: number;

  supportsTouchEvents: boolean;
  supportsPointerEvents: boolean;

  render: () => void;
  destroy: (destroyScenegraph?: boolean) => void;
  resize: (width: number, height: number) => void;

  context: CanvasContext;

  mountChildren: (parent: INode) => void;
  unmountChildren: (parent: INode) => void;

  getConfig: () => Partial<CanvasConfig>;
  getCamera: () => ICamera;
  getContextManager: () => ContextManager<unknown>;
  getRenderingManager: () => RenderingManager;
  getEventManager: () => EventManager;

  getContainer: () => HTMLElement;

  client2Viewport: (client: PointLike) => PointLike;
  viewport2Client: (viewport: PointLike) => PointLike;
  canvas2Viewport: (canvas: PointLike) => PointLike;
  viewport2Canvas: (viewport: PointLike) => PointLike;
}

export interface CanvasConfig {
  rendererType?: string;
  root?: HTMLElement;
  canvas?: CanvasProxy;
  document?: Document;
  offscreenCanvas?: CanvasProxy;
  devicePixelRatio?: number;
  createImage?: (src: string) => HTMLImageElement;
  supportsPointerEvents?: boolean;
  // supportMouseEvent?: () => boolean;
  supportsTouchEvents?: boolean;
  supportsCSSTransform?: boolean;
  width?: number;
  height?: number;
  background?: ColorType;
  cursor?: Cursor;
  zoomDisable?: boolean;
  dragDisable?: boolean;
  scrollDisable?: boolean;
  [key: string]: any;
  onDrag?: () => void;
}

export interface CanvasContext {
  config: Partial<CanvasConfig>;
  renderer: IRenderer;
  camera: ICamera;
  ContextManager: new (
    context: GlobalRuntime & CanvasContext,
  ) => ContextManager<unknown>;
  contextManager: ContextManager<unknown>;
  renderingManager: RenderingManager;
  eventManager: EventManager;
  renderingContext: RenderingContext;
  renderingPlugins: RenderingPlugin[];
}

export interface CanvasLike extends EventTarget {
  width: number;
  height: number;

  getContext: ((
    contextId: '2d',
    contextAttributes?: CanvasRenderingContext2DSettings,
  ) => CanvasRenderingContext2D | null) &
    ((
      contextId: 'webgl',
      contextAttributes?: WebGLContextAttributes,
    ) => WebGLRenderingContext | null) &
    ((
      contextId: 'webgl2',
      contextAttributes?: WebGLContextAttributes,
    ) => WebGL2RenderingContext | null);

  addEventListener: (<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) => void) &
    ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) => void);
  removeEventListener: (<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) => void) &
    ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ) => void);
}

export interface IElement<StyleProps = any, ParsedStyleProps = any>
  extends INode,
    IChildNode,
    IParentNode {
  id: string;
  tagName: string;
  name: string;
  className: string;
  classList: string[];
  attributes: StyleProps;

  style: StyleProps & ICSSStyleDeclaration<StyleProps>;
  parsedStyle: ParsedStyleProps;

  getElementById: <E extends IElement = IElement>(id: string) => E | null;
  getElementsByName: <E extends IElement = IElement>(name: string) => E[];
  getElementsByClassName: <E extends IElement = IElement>(
    className: string,
  ) => E[];
  getElementsByTagName: <E extends IElement = IElement>(tagName: string) => E[];

  scrollLeft: number;
  scrollTop: number;
  clientLeft: number;
  clientTop: number;

  getGeometryBounds(): AABB;
  getRenderBounds(): AABB;
  getBounds(): AABB;
  getLocalBounds(): AABB;
  getBoundingClientRect(): Rectangle;
  getClientRects(): Rectangle[];

  setAttribute: <Key extends keyof StyleProps>(
    attributeName: Key,
    value: StyleProps[Key],
    force?: boolean,
  ) => void;

  getAttribute: (
    attributeName: keyof StyleProps,
  ) => StyleProps[keyof StyleProps] | undefined;

  removeAttribute: (attributeName: keyof StyleProps) => void;

  hasAttribute: (qualifiedName: string) => boolean;
}

export interface IDocument extends INode, IParentNode {
  readonly defaultView: ICanvas | null;
  readonly documentElement: IElement;
  readonly ownerDocument: null;
  readonly timeline: IAnimationTimeline;

  createElement: <
    T extends DisplayObject<StyleProps>,
    StyleProps extends BaseStyleProps,
  >(
    tagName: string,
    options: DisplayObjectConfig<StyleProps>,
  ) => T;

  elementFromPoint: (x: number, y: number) => Promise<DisplayObject>;
  elementsFromPoint: (x: number, y: number) => Promise<DisplayObject[]>;
  elementsFromBBox: (
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ) => DisplayObject[];
}

export interface INode extends IEventTarget {
  shadow: boolean;
  readonly baseURI: string;
  readonly childNodes: IChildNode[];
  readonly firstChild: IChildNode | null;
  isConnected: boolean;
  readonly lastChild: IChildNode | null;
  readonly nextSibling: IChildNode | null;
  readonly nodeName: string;
  readonly nodeType: number;
  nodeValue: string | null;
  ownerDocument: IDocument | null;
  readonly parentElement: IElement | null;
  parentNode: (INode & IParentNode) | null;
  readonly previousSibling: IChildNode | null;
  textContent: string | null;
  appendChild: <T extends INode>(newChild: T, index?: number) => T;
  cloneNode: (deep?: boolean) => INode;
  compareDocumentPosition: (other: INode) => number;
  contains: (other: INode | null) => boolean;
  getRootNode: (options?: GetRootNodeOptions) => INode;
  getAncestor: (n: number) => INode | null;
  forEach: (callback: (o: INode) => void | boolean, assigned?: boolean) => void;
  hasChildNodes: () => boolean;
  insertBefore: <T extends INode>(newChild: T, refChild: INode | null) => T;
  isDefaultNamespace: (namespace: string | null) => boolean;
  isEqualNode: (otherNode: INode | null) => boolean;
  isSameNode: (otherNode: INode | null) => boolean;
  lookupNamespaceURI: (prefix: string | null) => string | null;
  lookupPrefix: (namespace: string | null) => string | null;
  normalize: () => void;
  removeChild: <T extends INode>(oldChild: T) => T;
  replaceChild: <T extends INode>(newChild: INode, oldChild: T) => T;
  destroy: () => void;
}

export interface IChildNode extends INode {
  after: (...nodes: INode[]) => void;
  before: (...nodes: INode[]) => void;
  remove: () => void;
  replaceWith: (...nodes: INode[]) => void;
}

export interface IParentNode {
  readonly childElementCount: number;
  readonly children: IElement[];
  readonly firstElementChild: IElement | null;
  readonly lastElementChild: IElement | null;
  append: (...nodes: INode[]) => void;
  prepend: (...nodes: INode[]) => void;
  querySelector: <E extends IElement = IElement>(selectors: string) => E | null;
  querySelectorAll: <E extends IElement = IElement>(selectors: string) => E[];
  find: <E extends IElement = IElement>(
    filter: (node: E) => boolean,
  ) => E | null;
  findAll: <E extends IElement = IElement>(filter: (node: E) => boolean) => E[];
}
