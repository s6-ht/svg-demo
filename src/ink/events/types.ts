import { FederatedEvent } from "./FederatedEvent";

export enum ElementType {
  // 在一个节点被直接插入文档或通过子树间接插入文档之后触发
  MOUNTED = "DOMNodeInsertedIntoDocument",
}

export enum CanvasEvent {
  READY = "ready",
  RENDERER_CHANGED = "rendererchanged",
}

export enum ElementEvent {
  MOUNTED = "DOMNodeInsertedIntoDocument",
}

export interface IEventTarget {
  addEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ) => void;
  removeEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ) => void;
  dispatchEvent: <T extends FederatedEvent>(
    e: T,
    skipPropagate?: boolean
  ) => boolean;
}

interface EventListener {
  (evt: FederatedEvent): void;
}

interface EventListenerObject {
  handleEvent(object: FederatedEvent): void;
}

export type EventListenerOrEventListenerObject =
  | EventListener
  | EventListenerObject;
