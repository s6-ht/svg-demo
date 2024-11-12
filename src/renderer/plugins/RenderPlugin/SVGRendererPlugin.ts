import { DisplayObject } from "@/displayObjects/DisplayObject";
import { ElementType } from "@/events/types";
import { createSVGElement } from "@/renderer/utils/dom";
import { ContextManager } from "@/types/canvas";
import { RenderingPluginContext } from "@/types/renderer";
import { SVGRendererPluginOptions } from "@/types/SVGRendererPluginOptions";
import { numberToLongString } from "@/utils/format";
import { mat4 } from "gl-matrix";

export class SVGRendererPlugin {
  private $camera: SVGElement | null = null;

  constructor(
    private pluginOptions: SVGRendererPluginOptions,
    private context: RenderingPluginContext
  ) {}

  apply(context: RenderingPluginContext) {
    this.context = context;
    const { renderingManager, renderingContext, camera } = this.context;
    const canvas = camera.canvas;

    const handleMounted = (e: Event) => {
      const object = e.target;
    };

    renderingManager.hooks.init.tap(() => {
      // 添加g-camera
      // 监听画布的一些事件
      const $svg = (
        this.context.contextManager as ContextManager<SVGElement>
      ).getContext();

      $svg.setAttribute("color-interpolation-filters", "sRGB");

      // 创建camera group
      this.$camera = createSVGElement("g");
      this.$camera.id = "g-svg-camera";
      // TODO: 这个矩阵不是很明白
      this.applyTransform(this.$camera, this.context.camera.getOrthoMatrix());
      $svg.appendChild(this.$camera);

      canvas?.addEventListener(ElementType.MOUNTED, handleMounted);
    });
  }

  applyTransform($el: SVGElement, rts: mat4) {
    $el.setAttribute(
      "transform",
      `matrix(${numberToLongString(rts[0])},${numberToLongString(
        rts[1]
      )},${numberToLongString(rts[4])},${numberToLongString(
        rts[5]
      )},${numberToLongString(rts[12])},${numberToLongString(rts[13])})`
    );
  }
}
