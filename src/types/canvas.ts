import { GlobalRuntime } from "@/manager/GlobalRuntime";
import { IRenderer, RenderingPlugin, RenderingContext } from "./renderer";
import { RenderingManager } from "@/manager/RenderingManager";
import Camera from "@/camera/Camera";
import { DefaultElementLifeCycleContribution } from "@/renderer/utils/DefaultElementLifeCycleContribution";

export interface CanvasConfig {
  root: string | HTMLElement;
  width?: number;
  height?: number;
  [key: string]: any;
}

export interface ContextManager<Context> {
  init: () => void;
  getContext: () => Context;
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
  camera: Camera;
  SVGElementLifeCycleContribution: DefaultElementLifeCycleContribution;
}

export interface ICanvas {}
