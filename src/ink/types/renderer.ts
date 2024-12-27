import { GlobalRuntime } from "@/ink/manager/GlobalRuntime";
import { CanvasContext } from "./canvas";
import { Group } from "@/ink/displayObjects/Group";

export interface IRenderer {
  registerPlugin: (plugin: RendererPlugin) => void;
  unregisterPlugin: (plugin: RendererPlugin) => void;
  getPlugins: () => RendererPlugin[];
}

export interface RendererPlugin {
  name: string;
  context: CanvasContext;
  init: (runtime: GlobalRuntime) => void;
  destroy: () => void;
}

export type RenderingPluginContext = CanvasContext & GlobalRuntime;

export interface RenderingPlugin {
  apply: (context: RenderingPluginContext, runtime: GlobalRuntime) => void;
}

export interface RenderingContext {}
