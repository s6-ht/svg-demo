import { AbstractRendererPlugin } from "@/renderer/AbstractRendererPlugin";
import { SVGRendererPlugin } from "./SVGRendererPlugin";
import { DefaultElementLifeCycleContribution } from "@/renderer/utils/DefaultElementLifeCycleContribution";

export class RenderPlugin extends AbstractRendererPlugin {
  name = "render-plugin";

  init() {
    this.context.SVGElementLifeCycleContribution =
      new DefaultElementLifeCycleContribution();

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
