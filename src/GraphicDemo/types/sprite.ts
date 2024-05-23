export interface ISize {
  width: number;
  height: number;
}

export interface ICoordinate {
  x: number;
  y: number;
}

export type TSizeCoordinate = ICoordinate & ISize;

export interface ISpriteAttrs {
  size: ISize;
  coordinate: ICoordinate;
  angle?: number;
}

export interface ISprite<IProps = any> {
  id: string;
  type: string;
  props: IProps;
  attrs: ISpriteAttrs;
}

export interface ISpriteMeta<IProps = any> {
  type: string;
  spriteComponent:
    | React.JSXElementConstructor<any>
    | ((props: any) => React.ReactNode);
  initProps?: IProps;
  initAttrs?: ISpriteAttrs;
}

export interface IDefaultGraphicProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}
