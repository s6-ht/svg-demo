import { IPoint } from "@/ink/types/point";

export interface IBaseNodeConfig {
  id: string;
  type: string;
  style?: {
    width?: number;
    height?: number;
    stroke?: string;
    fill?: string;
    zIndex?: number;
    [key: string]: unknown;
  };
  position?: {
    x: number;
    y: number;
  };
  visible?: boolean;
  isStartNode?: boolean;
  children?: IBaseNodeConfig[];
  [key: string]: unknown;
}

export interface IBaseEdgeConfig {
  id?: string;
  type: string;
  source: string;
  target: string;
  style?: {
    fill?: string;
    stroke?: string;
    lineWidth?: number;
    zIndex?: number;
    strokeDasharray?: number[];
    [key: string]: unknown;
  };

  points: IPoint[];
  [key: string]: unknown;
}

export interface IGraphConfig {
  root: string | HTMLElement;
  layout?: {
    type: string;
    [key: string]: unknown;
  };
  scrollDisable?: boolean;
}
