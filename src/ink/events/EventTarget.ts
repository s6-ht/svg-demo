import { isFunction } from "lodash";
import { FederatedEvent, isFederatedEvent } from "./FederatedEvent";
import { EventListenerOrEventListenerObject, IEventTarget } from "./types";
import EventEmitter from "eventemitter3";
import { ICanvas } from "../types/canvas";
import { IDocument, INode } from "../dom/types";

export class EventTarget implements IEventTarget {
  public emitter = new EventEmitter();

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ) {
    const capture = options?.capture;
    const once = options?.once;
    const context = isFunction(listener) ? undefined : listener;

    const eventType = capture ? `${type}capture` : type;
    const _listener = isFunction(listener) ? listener : listener?.handleEvent;

    if (once) {
      this.emitter.once(eventType, _listener, context);
    } else {
      this.emitter.on(eventType, _listener, context);
    }

    return this;
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ) {
    const capture = options?.capture;
    const context = isFunction(listener) ? undefined : listener;

    const eventType = capture ? `${type}capture` : type;
    const _listener = isFunction(listener) ? listener : listener?.handleEvent;

    this.emitter.off(eventType, _listener, context);

    return this;
  }

  removeAllEventListeners(): void {
    this.emitter.removeAllListeners();
  }

  dispatchEvent<T extends FederatedEvent>(e: T, skipPropagate = false) {
    if (!isFederatedEvent(e)) {
      throw new Error(
        "DisplayObject cannot propagate events outside of the Federated Events API"
      );
    }

    let canvas: ICanvas | null;
    // @ts-ignore
    if (this.document) {
      canvas = this as unknown as ICanvas;
      // @ts-ignore
    } else if (this.defaultView) {
      canvas = (this as unknown as IDocument).defaultView;
    } else {
      canvas = (this as unknown as INode).ownerDocument?.defaultView || null;
    }

    if (canvas) {
      e.manager = canvas.getEventManager() || null;
      if (!e.manager) {
        return false;
      }

      e.defaultPrevented = false;
      e.path = [];

      if (!skipPropagate) {
        e.target = this;
      }

      e.manager.dispatchEvent(e, e.type, skipPropagate);
    }

    return !e.defaultPrevented;
  }
}
