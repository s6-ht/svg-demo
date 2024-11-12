import { GlobalRuntime } from "@/manager/GlobalRuntime";
import { AbstractRendererPlugin } from "../../AbstractRendererPlugin";
import { CanvasConfig } from "@/types/canvas";
import { isString } from "lodash";
import { createSVGElement } from "../../utils/dom";

export class SVGContextManager extends AbstractRendererPlugin {
  name = "svg-context-register-plugin";
  private canvasConfig: Partial<CanvasConfig>;
  private $root: HTMLElement | null;
  private $namespace: SVGElement | null = null;
  private dpr = 1;

  constructor(public context: GlobalRuntime & CanvasConfig) {
    super();
    this.canvasConfig = context.config;
    this.$root = null;
  }

  init(): void {
    this.$root = this.getRoot() || null;

    if (this.$root) {
      const size = this.getRootSize();
      const $namespace = createSVGElement("svg");
      // @ts-ignore
      $namespace.setAttribute("width", size.width);
      // @ts-ignore
      $namespace.setAttribute("height", size.height);

      this.$root.appendChild($namespace);
      this.$namespace = $namespace;
    }

    const { devicePixelRatio } = this.canvasConfig;
    let dpr = devicePixelRatio || window.devicePixelRatio || 1;
    dpr = dpr >= 1 ? Math.ceil(dpr) : 1;
    this.dpr = dpr;
  }

  getRoot() {
    return isString(this.canvasConfig.root)
      ? document.getElementById(this.canvasConfig.root)
      : this.canvasConfig.root;
  }

  getRootSize() {
    let size = { width: 0, height: 0 };
    if (this.$root) {
      size = {
        width: this.$root.clientWidth,
        height: this.$root.clientHeight,
      };
    }
    return size;
  }

  getContext() {
    return this.$namespace;
  }

  destroy(): void {
    delete this.context.ContextManager;
  }
}
