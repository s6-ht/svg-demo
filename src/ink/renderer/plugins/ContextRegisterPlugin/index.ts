import { AbstractRendererPlugin } from "../../AbstractRendererPlugin";
import { SVGContextManager } from "./SvgContextManager";

export class ContextRegisterPlugin extends AbstractRendererPlugin {
  name = "svg-context-register-plugin";

  init(): void {
    this.context.ContextManager = SVGContextManager;
  }

  destroy(): void {
    delete this.context.ContextManager;
  }
}
