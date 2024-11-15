import { DisplayObject } from "@/displayObjects/DisplayObject";
import { ElementType } from "@/events/types";
import { ElementSVG } from "@/renderer/components/ElementSVG";
import { createSVGElement } from "@/renderer/utils/dom";
import { ContextManager } from "@/types/canvas";
import { RenderingPluginContext } from "@/types/renderer";
import { SVGRendererPluginOptions } from "@/types/SVGRendererPluginOptions";
import { numberToLongString } from "@/utils/format";
import { mat4 } from "gl-matrix";

export class SVGRendererPlugin {
  private $camera: SVGElement | null = null;

  private svgElementMap: WeakMap<SVGElement, DisplayObject> = new WeakMap();

  constructor(
    private pluginOptions: SVGRendererPluginOptions,
    private context: RenderingPluginContext
  ) {}

  apply(context: RenderingPluginContext) {
    this.context = context;
    const { renderingManager, renderingContext, camera } = this.context;
    const canvas = camera.canvas;

    const handleMounted = (e: Event) => {
      const object = e.target as unknown as DisplayObject;

      this.createSVGDom(object, this.$camera!);
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

  createSVGDom(object: DisplayObject, root: SVGElement) {
    // @ts-ignore
    object.elementSVG = new ElementSVG();
    // @ts-ignore
    const svgElement = object.elementSVG;

    // 创建一个元素 设置属性 添加到父元素

    const $el = this.context.SVGElementLifeCycleContribution.createElement(
      object,
      this.svgElementMap
    );

    // 给元素添加id
    if (this.pluginOptions.outputSVGElementId) {
      $el.id = this.getId(object);
    }

    // 给元素添加name
    if (this.pluginOptions.outputSVGElementName && object.name) {
      $el.setAttribute("name", object.name);
    }

    // 保存svg元素
    svgElement.$el = $el;

    this.applyAttributes(object);
  }

  applyAttributes(object: DisplayObject) {
    // @ts-ignore
    const elementSVG = object.elementSVG as ElementSVG;
    const $el = elementSVG.$el;

    if ($el) {
      const { attributes } = $el;
      $el.setAttribute("fill", "none");
      this.updateAttribute(object, Object.keys(attributes));
    }
  }

  updateAttribute(object: DisplayObject, attributes: string[]) {
    // 检查属性是否需要更新
    // 需要更新就把它设置到el上
  }

  getId(object: DisplayObject) {
    return `g-svg-${object.entity}`;
  }
}
