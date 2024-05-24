import { useUnmount, useMount } from "ahooks";
import { useRef } from "react";
import { ICoordinate, ISprite, TSizeCoordinate } from "../../../types/sprite";
import { marqueeDefaultProps } from "../../../constant";

interface IMoveProps {
  activeSprite?: ISprite;
  activeSpriteInfo?: TSizeCoordinate & { transform: string };
}

const Move = ({ activeSpriteInfo, activeSprite }: IMoveProps) => {
  const { width, height, x, y } = activeSpriteInfo || marqueeDefaultProps;
  const initialPos = useRef<ICoordinate>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: MouseEvent) => {
    // 获取到精灵 改变精灵的位置
  };

  const handleMouseUp = () => {
    //
  };

  const handleMouseDown = (e: MouseEvent) => {
    // 找到当前点击的元素的坐标
    // 然后记录鼠标点击位置和精灵坐标的便宜

    // 添加move和up事件
    document.addEventListener("pointermove", handleMouseMove, false);
    document.addEventListener("pointerup", handleMouseUp, false);
  };

  useMount(() => {
    document.addEventListener("pointerdown", handleMouseDown, false);
    document.addEventListener("pointerup", handleMouseUp, false);
  });

  useUnmount(() => {
    document.removeEventListener("pointerdown", handleMouseDown, false);
    document.removeEventListener("pointermove", handleMouseMove, false);
    document.removeEventListener("pointerup", handleMouseUp, false);
  });

  if (!activeSprite) return;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="#0566e5"
      fill="none"
      className="active-sprites-rect"
    ></rect>
  );
};
export default Move;
