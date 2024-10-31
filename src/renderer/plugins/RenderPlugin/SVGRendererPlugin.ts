import { RenderingPluginContext } from "@/types/renderer";
import { SVGRendererPluginOptions } from "@/types/SVGRendererPluginOptions";

export class SVGRendererPlugin {
  constructor(
    private pluginOptions: SVGRendererPluginOptions,
    private context: RenderingPluginContext
  ) {}

  apply(context: RenderingPluginContext) {
    this.context = context;
    const { renderingManager } = this.context;

    const canvas = this.context.instance;

    renderingManager.hooks.init.tap(() => {});
  }
}
