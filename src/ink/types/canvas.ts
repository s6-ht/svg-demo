import { EventManager } from "../manager/EventManager";

export interface CanvasConfig {
  root: HTMLElement;
  width?: number;
  height?: number;
  devicePixelRatio?: number;
  [key: string]: any;
}

export interface ContextManager<Context> {
  init: () => void;
  getContext: () => Context;
}

export interface CanvasContext {
  config: CanvasConfig;
  eventManager: EventManager;
}

export interface ICanvas {
  getEventManager: () => EventManager;
}
