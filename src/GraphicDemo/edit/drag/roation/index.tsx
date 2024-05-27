import { ISprite } from "../../../types/sprite";
import RotateIcon from "./rotate";

interface IRotateProps {
  activeSprite?: ISprite;
}

/**
 * 计算旋转图标的位置
 * 旋转的中心点以精灵的中心点
 * 处理旋转事件
 *
 * @param param0
 * @returns
 */

const Rotate = ({ activeSprite }: IRotateProps) => {
  const onMouseDown = (e: MouseEvent) => {};

  return (
    <RotateIcon
      x={
        (activeSprite?.attrs?.coordinate?.x || 0) +
        (activeSprite?.attrs?.size?.width || 0)
      }
      y={(activeSprite?.attrs?.coordinate?.y || 0) - 18}
      onMouseDown={onMouseDown}
    />
  );
};
export default Rotate;
