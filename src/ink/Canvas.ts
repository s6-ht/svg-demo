import { context } from "./../.umi/core/helmetContext";
import { CanvasContext, ICanvas } from "./types/canvas";

export class Canvas extends EventTarget implements ICanvas {
  public context = {} as CanvasContext;

  constructor() {
    super();
  }

  public getEventManager() {
    return this.context.eventManager;
  }
}
