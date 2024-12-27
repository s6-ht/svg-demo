import { GlobalRuntime } from "@/ink/manager/GlobalRuntime";
import { CanvasContext } from "@/ink/types/canvas";
import { RenderingPlugin } from "@/ink/types/renderer";

export abstract class AbstractRendererPlugin<T = any> {
  public context: CanvasContext & T;
  protected plugins: RenderingPlugin[] = [];

  protected addRenderingPlugin(plugin: RenderingPlugin) {
    this.plugins.push(plugin);
    this.context.renderingPlugins.push(plugin);
  }

  protected removeAllRenderingPlugins() {
    this.plugins.forEach((plugin) => {
      const index = this.context.renderingPlugins.indexOf(plugin);
      if (index >= 0) {
        this.context.renderingPlugins.splice(index, 1);
      }
    });
  }

  abstract name: string;
  abstract init(runtime: GlobalRuntime): void;
  abstract destroy(runtime: GlobalRuntime): void;
}
