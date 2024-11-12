import { CameraType } from "@/camera/types";
import { DisplayObject } from "@/displayObjects/DisplayObject";
import { Group } from "@/displayObjects/Group";
import { runtime } from "@/manager/GlobalRuntime";
import { RenderingManager } from "@/manager/RenderingManager";
import Renderer from "@/renderer/renderer";
import { CanvasConfig, CanvasContext } from "@/types/canvas";
import { IRenderer } from "@/types/renderer";
import { isString } from "lodash";

export class Canvas extends EventTarget {
  private inited = false;
  public context = {} as CanvasContext;

  documentElement: Group | null = null;

  constructor(config: CanvasConfig) {
    super();

    this.context.config = config;
    this.context.instance = this;

    this.createRoot();
    const { width, height } = this.getSize();

    // 设置初始相机
    this.initDefaultCamera(width, height);

    this.initRenderer(true);
  }

  private initDefaultCamera(width: number, height: number) {
    // 实例化相机 并 设置相机的初始状态
    const camera = new runtime.CameraContribution();

    camera
      .setType(CameraType.ORBITING)
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setOrthographic(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        0.1,
        1000
      );
    camera.canvas = this;

    this.context.camera = camera;
  }

  private initRenderer(fullPaint: boolean) {
    if (this.inited) return;

    this.context.renderer = new Renderer();

    // 执行渲染需要的插件
    this.context.renderingPlugins = [];
    this.initRendererPlugins(this.context.renderer);

    this.initManager(fullPaint);

    this.mountChildren(this.getRoot());
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

  initRenderingManager(fullPaint: boolean, async = false) {
    this.context.renderingManager.init(() => {
      this.inited = true;

      if (fullPaint) {
      }
    });
  }

  getContainer() {
    return isString(this.context.config.root)
      ? document.getElementById(this.context.config.root)
      : this.context.config.root;
  }

  getSize() {
    const container = this.getContainer();
    return {
      width: container?.clientWidth || 0,
      height: container?.clientHeight || 0,
    };
  }

  public mountChildren(parent: DisplayObject) {
    // parent.childNodes.forEach(item => {})
  }

  createRoot() {
    // @ts-ignore
    this.documentElement = new Group({
      id: "g-root",
      style: {},
    });
  }

  getRoot() {
    return this.documentElement;
  }
}
