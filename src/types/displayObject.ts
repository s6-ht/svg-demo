import { DisplayObject } from "@/displayObjects/DisplayObject";

export type Cursor =
  | "auto"
  | "default"
  | "none"
  | "context-menu"
  | "help"
  | "pointer"
  | "progress"
  | "wait"
  | "cell"
  | "crosshair"
  | "text"
  | "vertical-text"
  | "alias"
  | "copy"
  | "move"
  | "no-drop"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "all-scroll"
  | "col-resize"
  | "row-resize"
  | "n-resize"
  | "e-resize"
  | "s-resize"
  | "w-resize"
  | "ne-resize"
  | "nw-resize"
  | "se-resize"
  | "sw-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "zoom-in"
  | "zoom-out";

type CanvasLineJoin = "bevel" | "miter" | "round";

export type TextTransform = "capitalize" | "uppercase" | "lowercase" | "none";

export interface BaseStyleProps {
  transform?: string;
  transformOrigin?: string;
  visibility?: "visible" | "hidden";
  /** 控制元素的指针事件（click touch等）的处理方式, 影响元素是否能够接收这些事件 */
  pointerEvents?: "none" | "auto" | "visible" | "fill" | "all";
  zIndex?: number;
  cursor?: Cursor;

  //   clipPath?:

  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: string;

  /** 填充规则 */
  fillRule?: "nonzero" | "evenodd";

  opacity?: number;
  /** 在进行点击测试时，增加线条的宽度，以便更容易检测到用户的点击事件 */
  increasedLineWidthForHitTesting?: string | number;
  /** 定义交互区域的属性，通常用于图形或对象的点击检测 */
  hitArea?: DisplayObject | null;

  /** 定义线条的端点样式 */
  strokeLinecap?: CanvasLineJoin;
  /** 在绘制路径的拐角处的连接样式 */
  strokeLinejoin?: CanvasLineJoin;
  /** 定义用于绘制形状轮廓的虚线段和间隙的排列形式 */
  strokeDasharray?: string | (string | number)[];
  /** 虚线与路径起点之间的偏移量 */
  strokeDashOffset?: number;
  /** 文字的转换样式 如首字母大写 */
  textTransform?: TextTransform;
  display?: string;
  draggable?: boolean;
  droppable?: boolean;
}

export enum Shape {
  GROUP = "g",
  RECT = "rect",
  CIRCLE = "circle",
  LINE = "line",
  PATH = "path",
  TEXT = "text",
  IMAGE = "image",
}
