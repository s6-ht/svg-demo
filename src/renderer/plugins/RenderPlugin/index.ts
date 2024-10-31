import { AbstractRendererPlugin } from "@/renderer/AbstractRendererPlugin";
import { SVGRendererPlugin } from "./SvgRendererPlugin";

export class RenderPlugin extends AbstractRendererPlugin {
  name = "render-plugin";

  init() {
    this.addRenderingPlugin(
      new SVGRendererPlugin(
        {
          outputSVGElementId: true,
          outputSVGElementName: true,
        },
        this.context
      )
    );
  }

  destroy() {
    this.removeAllRenderingPlugins();
  }
}
