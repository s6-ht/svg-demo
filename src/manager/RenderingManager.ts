import { CanvasContext } from "@/types/canvas";
import { GlobalRuntime } from "./GlobalRuntime";
import { SyncHook } from "@/utils/tapable/SyncHook";

/**
 * 管理选中过程中的各种操作和状态
 */
export class RenderingManager {
  public hooks = {
    init: new SyncHook(),
  };

  constructor(
    private runtime: GlobalRuntime,
    private context: CanvasContext
  ) {}

  public init(cb: () => void) {
    this.hooks.init.call({});
  }
}
