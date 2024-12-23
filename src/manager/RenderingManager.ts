import { CanvasContext } from "@/types/canvas";
import { GlobalRuntime, runtime } from "./GlobalRuntime";
import { SyncHook } from "@/utils/tapable/SyncHook";
import { AsyncParallelHook } from "@/utils/tapable/AsyncParallelHook";

/**
 * 管理选中过程中的各种操作和状态
 */
export class RenderingManager {
  public hooks = {
    init: new SyncHook(),
    initSync: new AsyncParallelHook<[]>(),
  };
  private inited = false;

  constructor(
    private globalRuntime: GlobalRuntime,
    private context: CanvasContext
  ) {}

  public init(cb: () => void) {
    const context = { ...this.globalRuntime, ...this.context };
    this.context.renderingPlugins.forEach((plugin) => {
      plugin.apply(context, runtime);
    });
    this.hooks.init.call();

    if (this.hooks.initSync.getCallbacksNum() === 0) {
      this.inited = true;
      cb();
    } else {
      this.hooks.initSync.promise().then(() => {
        this.inited = true;
        cb();
      });
    }
  }
}
