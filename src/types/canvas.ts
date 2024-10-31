import { GlobalRuntime } from "@/manager/GlobalRuntime";
import { IRenderer, RenderingPlugin, RenderingContext } from "./renderer";
import { RenderingManager } from "@/manager/RenderingManager";

export interface CanvasConfig {
  root: string | HTMLElement;
  width?: number;
  height?: number;
  [key: string]: any;
}

export interface ContextManager<Context> {
  init: () => void;
}

export interface CanvasContext {
  renderer: IRenderer;
  config: CanvasConfig;
  renderingPlugins: RenderingPlugin[];
  ContextManager: new (
    context: GlobalRuntime & CanvasContext
  ) => ContextManager<unknown>;
  contextManager: ContextManager<unknown>;
  renderingManager: RenderingManager;
  renderingContext: RenderingContext;
  instance: ICanvas;
}

export interface ICanvas {}
