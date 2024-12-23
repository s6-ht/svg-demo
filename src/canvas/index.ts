import { CameraType } from "@/camera/types";
import { DisplayObject } from "@/displayObjects/DisplayObject";
import { Group } from "@/displayObjects/Group";
import { CanvasEvent } from "@/events/types";
import { runtime } from "@/manager/GlobalRuntime";
import { RenderingManager } from "@/manager/RenderingManager";
import Renderer from "@/renderer/renderer";
import { CanvasConfig, CanvasContext } from "@/types/canvas";
import { IRenderer } from "@/types/renderer";
import { isString } from "lodash";

/**
 * 初始化相机 -- 渲染节点
 */
export class Canvas extends EventTarget {
  private inited = false;
  public context = {} as CanvasContext;

  public document: Document;
  documentElement: Group | null = null;

  public requestAnimationFrame: (callback: FrameRequestCallback) => number;

  private readyPromise: Promise<any> | undefined;
  private resolveReadyPromise: () => void;

  constructor(config: CanvasConfig) {
    super();
    this.requestAnimationFrame = window.requestAnimationFrame;

    this.document = new Document();
    this.documentElement = new Group({
      id: "g-root",
      style: {},
    });

    this.initRenderingContext(config);
    // 初始化相机
    const { width, height } = this.getSize();
    this.initDefaultCamera(width, height);
    this.initRenderer(true);
  }

  private initRenderingContext(mergedConfig: CanvasConfig) {
    this.context.config = mergedConfig;
    // FIXME:
    this.context.renderingContext = {
      root: this.documentElement,
      renderListCurrFrame: [],
      renderReasons: new Set(),
      unculledEntities: [],
      force: false,
      dirty: false,
    };
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
    this.inited = false;
    this.readyPromise = undefined;

    this.context.renderer = new Renderer();

    // 执行渲染需要的插件
    this.context.renderingPlugins = [];
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

  initRenderingManager(fullPaint: boolean, async = false) {
    this.context.renderingManager.init(() => {
      // 插件初始化完成
      this.inited = true;
      if (fullPaint) {
        this.requestAnimationFrame.call(window, () => {
          const event = new CustomEvent(CanvasEvent.READY);
          this.dispatchEvent(event);
        });

        // 暂时看不出来作用
        if (this.readyPromise) {
          this.resolveReadyPromise();
        }
      } else {
        this.dispatchEvent(new CustomEvent(CanvasEvent.RENDERER_CHANGED));
      }

      const root = this.getRoot();
      if (!fullPaint) {
      }
      if (root) {
        this.mountChildren(root);
      }
    });
  }

  getContainer() {
    return this.context.config.root;
  }

  getSize() {
    const container = this.getContainer();
    return {
      width: container.clientWidth || 0,
      height: container.clientHeight || 0,
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

  get ready() {
    if (!this.readyPromise) {
      this.readyPromise = new Promise((resolve) => {
        this.resolveReadyPromise = () => {
          resolve(this);
        };
      });

      if (this.inited) {
        this.resolveReadyPromise();
      }
    }
    return this.readyPromise;
  }
}
