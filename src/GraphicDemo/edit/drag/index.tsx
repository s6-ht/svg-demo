import { useCallback, useEffect, useMemo } from "react";
import { useUnmount } from "ahooks";
import { ISprite } from "../../types/sprite";
import { findParentByClass, getSpriteBBox } from "../../helper";
import { marqueeDefaultProps } from "../../constant";

interface IActiveSpriteContainerProps {
  store: {
    activeSprite?: ISprite;
    spriteList: ISprite[];
  };
  apis: {
    updateActiveSprite: (sprite?: ISprite) => void;
  };
}

const ActiveSpriteContainer = ({
  store,
  apis,
}: IActiveSpriteContainerProps) => {
  /**
   *  判断点击的位置是否为精灵不是直接返回，是则获取该精灵的属性 用于设置选框的大小 、位置和旋转
   */
  const handleSelect = useCallback(
    (e: PointerEvent) => {
      const spriteDom = findParentByClass(e.target, "sprite-container");
      if (!spriteDom) {
        apis.updateActiveSprite(undefined);
        return;
      }

      const id = spriteDom.getAttribute("data-sprite-id");
      if (id === store.activeSprite?.id) return;
      const selectedSprite = store.spriteList.find((item) => item.id === id);
      console.log(id, "id");
      apis.updateActiveSprite(selectedSprite);
    },
    [apis, store.activeSprite?.id, store.spriteList]
  );

  const handleMouseDown = useCallback(
    (e: PointerEvent) => {
      handleSelect(e);
    },
    [handleSelect]
  );

  useEffect(() => {
    document.addEventListener("pointerdown", handleMouseDown, false);
  }, [handleMouseDown]);

  useUnmount(() => {
    document.removeEventListener("pointerdown", handleSelect, false);
  });

  const marqueeProps = useMemo(() => {
    if (!store.activeSprite?.attrs) return marqueeDefaultProps;
    const { angle } = store.activeSprite?.attrs;

    const { x, y, width, height } = getSpriteBBox(store.activeSprite);

    return {
      x,
      y,
      width,
      height,
      transform: `rotate(${angle || 0}, ${x + width / 2} ${y + height / 2})`,
    };
  }, [store.activeSprite]);

  if (!store.activeSprite) return null;

  return (
    <g className="active-sprites-container" transform={marqueeProps.transform}>
      <rect
        {...marqueeProps}
        stroke="#0067ed"
        fill="none"
        className="active-sprites-content"
        strokeWidth={3}
      ></rect>
    </g>
  );
};

export default ActiveSpriteContainer;
