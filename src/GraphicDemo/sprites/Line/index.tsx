import { IDefaultGraphicProps, ISprite } from "../../types/sprite";
import { BaseSprite } from "../BaseSprite";

interface ILineProps extends IDefaultGraphicProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const Line = (props: ILineProps) => {
  return <line stroke="#ffa245" strokeWidth={10} {...props}></line>;
};

export class LineSprite extends BaseSprite<ILineProps & { sprite: ISprite }> {
  render() {
    const { sprite } = this.props;
    const { props } = sprite;
    return <Line {...props} />;
  }
}

const lineSpriteMeta = {
  type: "LineSprite",
  spriteComponent: LineSprite,
};

export default lineSpriteMeta;
