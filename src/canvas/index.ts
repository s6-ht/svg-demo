import { runtime } from "@/manager/GlobalRuntime";
import { RenderingManager } from "@/manager/RenderingManager";
import Renderer from "@/renderer/renderer";
import { CanvasConfig, CanvasContext, ICanvas } from "@/types/canvas";
import { IRenderer } from "@/types/renderer";

export class Canvas {
  private inited = false;
  public context = {} as CanvasContext;

  constructor(config: CanvasConfig) {
    this.context.config = config;
    this.context.instance = this;

    this.initRenderer(true);
  }

  private initRenderer(fullPaint: boolean) {
    if (this.inited) return;

    this.context.renderer = new Renderer();

    // 执行渲染需要的插件
    this.initRendererPlugins(this.context.renderer);

    this.initManager(fullPaint);
  }

  private initRendererPlugins(renderer: IRenderer) {
    const plugins = renderer.getPlugins();

    plugins.forEach((plugin) => {
      plugin.context = this.context;
      plugin.init(runtime);
    });
  }

  private initManager(fullPaint: boolean) {
    // 初始化svg元素
    this.context.contextManager = new this.context.ContextManager({
      ...runtime,
      ...this.context,
    });

    this.context.renderingManager = new RenderingManager(runtime, this.context);

    this.context.contextManager.init();

    this.initRenderingManager(fullPaint, true);
  }

  initRenderingManager(fullPaint, async = false) {
    this.context.renderingManager.init(() => {
      this.inited = true;
    });
  }
}
