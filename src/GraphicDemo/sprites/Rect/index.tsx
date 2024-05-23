import { IDefaultGraphicProps, ISprite, ISpriteMeta } from "../../types/sprite";
import { BaseSprite } from "../BaseSprite";

type IRectProps = IDefaultGraphicProps;

export const Rect = (props: IRectProps) => {
  return (
    <rect
      x="0"
      y="0"
      fill="#f2e7ff"
      stroke="#ccc"
      strokeWidth={3}
      {...props}
    />
  );
};

export class RectSprite extends BaseSprite<IRectProps & { sprite: ISprite }> {
  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size || { width: 0, height: 0 };
    return <Rect {...props} x={0} y={0} width={width} height={height} />;
  }
}

const rectSpriteMeta: ISpriteMeta<IRectProps> = {
  type: "RectSprite",
  spriteComponent: RectSprite,
};

export default rectSpriteMeta;
