import _, { isString } from "lodash";
import { IBaseEdgeConfig, IBaseNodeConfig, IGraphConfig } from "./types";
import { Canvas } from "@/canvas";

/**
 * 初始化graph -- 注册节点/边/布局 -- 设置节点/边 -- render -- update
 */
export class Graph<
  NodeConfig extends IBaseNodeConfig = IBaseNodeConfig,
  EdgeConfig extends IBaseEdgeConfig = IBaseEdgeConfig
> {
  _config: IGraphConfig;

  canvas: Canvas;
  constructor(config: IGraphConfig) {
    this._config = config;
    // 初始化画布
    this.initCanvas();
    // 注册节点
    // 注册边
    // 注册布局
  }

  private initCanvas() {
    if (_.isNil(this._config)) return;
    const { root } = this._config;
    const rootElement = _.isString(root) ? document.getElementById(root) : root;

    if (!rootElement) {
      console.error("root is not defined");
      return;
    }

    this.canvas = new Canvas({
      root: rootElement,
      zoomDisable: true,
    });
  }

  private initNodes() {}

  private initEdges() {}

  private initLayout() {}

  setNodes() {}

  setEdges() {}

  render() {}

  update() {}

  destroy() {}
}
