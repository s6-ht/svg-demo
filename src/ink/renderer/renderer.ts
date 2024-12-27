import AbstractRenderer from "./AbstractRenderer";
import { ContextRegisterPlugin } from "./plugins/ContextRegisterPlugin";
import { RenderPlugin } from "./plugins/RenderPlugin";

export default class Renderer extends AbstractRenderer {
  constructor() {
    super();
    this.registerPlugin(new ContextRegisterPlugin());
    this.registerPlugin(new RenderPlugin());
  }
}
