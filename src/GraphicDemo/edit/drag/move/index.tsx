import { useUnmount, useMount } from "ahooks";
import { useRef } from "react";
import { ICoordinate, ISprite, TSizeCoordinate } from "../../../types/sprite";
import { marqueeDefaultProps } from "../../../constant";
import { findParentByClass } from "../../../helper";

interface IMoveProps {
  activeSprite?: ISprite;
  activeSpriteInfo?: TSizeCoordinate & { transform: string };
  updateSpriteCoordinate: (id: string, pos: ICoordinate) => void;
}

const Move = ({
  activeSpriteInfo,
  activeSprite,
  updateSpriteCoordinate,
}: IMoveProps) => {
  const { width, height, x, y } = activeSpriteInfo || marqueeDefaultProps;

  const initData = useRef({
    id: "",
    size: { width: 0, height: 0 },
    offset: { x: 0, y: 0 },
  });

  const handleMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const { offset, id } = initData.current;
    const coordinate = {
      x: pageX - offset.x,
      y: pageY - offset.y,
    };
    // 更新
    updateSpriteCoordinate(id, coordinate);
  };

  const handleMouseUp = () => {
    document.removeEventListener("pointerdown", handleMouseDown, false);
    document.removeEventListener("pointermove", handleMouseMove, false);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const spriteDom = findParentByClass(e.target, "sprite-container");
    if (!spriteDom) {
      return;
    }
    const spriteId = spriteDom.getAttribute("data-sprite-id");

    if (!spriteId) return;

    // 找到当前点击的元素的坐标
    initData.current = {
      id: spriteId,
      size: {
        width: activeSpriteInfo?.width || 0,
        height: activeSpriteInfo?.height || 0,
      },
      offset: {
        x: e.pageX - (activeSpriteInfo?.x || 0),
        y: e.pageY - (activeSpriteInfo?.y || 0),
      },
    };
    // 添加move和up事件
    document.addEventListener("pointermove", handleMouseMove, false);
    document.addEventListener("pointerup", handleMouseUp, false);
  };

  useMount(() => {
    document.addEventListener("mousedown", handleMouseDown, false);
    document.addEventListener("pointerup", handleMouseUp, false);
  });

  useUnmount(() => {
    document.removeEventListener("pointerdown", handleMouseDown, false);
    document.removeEventListener("pointermove", handleMouseMove, false);
    document.removeEventListener("pointerup", handleMouseUp, false);
  });

  if (!activeSprite) return null;

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
