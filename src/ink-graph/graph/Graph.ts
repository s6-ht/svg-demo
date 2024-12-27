import _, { isString } from "lodash";
import { IBaseNodeConfig, IBaseEdgeConfig, IGraphConfig } from "../types/Graph";

/**
 * 初始化graph -- 注册节点/边/布局 -- 设置节点/边 -- render -- update
 */
export class Graph<
  NodeConfig extends IBaseNodeConfig = IBaseNodeConfig,
  EdgeConfig extends IBaseEdgeConfig = IBaseEdgeConfig,
> {
  _config: IGraphConfig;

  canvas!: Canvas;
  constructor(config: IGraphConfig) {
    this._config = config;

    this.initCanvas();
    this.initNodes();
    this.initEdges();
    this.initLayout();
    this.initPlugins();
  }

  private initCanvas() {
    if (_.isNil(this._config)) return;

    const { root } = this._config;
    const canvasDomRoot = _.isString(root)
      ? document.getElementById(root)
      : root;

    if (!canvasDomRoot) {
      console.error("root is not defined");
      return;
    }

    this.canvas = new Canvas({
      root: canvasDomRoot,
      zoomDisable: true,
    });
  }

  private initNodes() {}

  private initEdges() {}

  private initLayout() {}

  private initPlugins() {}

  setNodes() {}

  setEdges() {}

  render() {}

  update() {}

  destroy() {}
}
