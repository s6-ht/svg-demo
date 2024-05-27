import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ICoordinate, ISprite, ISpriteMeta } from "./types/sprite";
import { Stage } from "./stage";
import { Sprite } from "./sprite";
import ActiveSpriteContainer from "./edit/drag";

interface IGraphicEditorCoreProps {
  width: number;
  height: number;
}

const GraphicEditorCore = (
  { width, height }: IGraphicEditorCoreProps,
  ref: ForwardedRef<IGraphicEditorCoreRef>
) => {
  const registerSpriteMetaMap = useRef<Record<string, ISpriteMeta>>({});
  const [spriteList, setSpriteList] = useState<ISprite[]>([]);

  // 注册精灵
  const registerSprite = (spriteMeta: ISpriteMeta) => {
    const type = spriteMeta.type;
    if (registerSpriteMetaMap.current[type]) {
      console.error(`Sprite ${spriteMeta.type} is already registered`);
      return;
    }
    registerSpriteMetaMap.current = {
      ...registerSpriteMetaMap.current,
      [type]: spriteMeta,
    };
  };

  // 添加精灵到画布
  const addSpriteToStage = (sprite: ISprite | ISprite[]) => {
    const newList: ISprite[] = [];
    if (Array.isArray(sprite)) {
      newList.push(...sprite);
    } else {
      newList.push(sprite);
    }

    setSpriteList((prev) => [...prev, ...newList]);
  };

  useImperativeHandle(ref, () => {
    return {
      registerSprite,
      addSpriteToStage,
    };
  });

  const [activeSprite, setActiveSprite] = useState<ISprite>();
  const updateActiveSprite = (sprite?: ISprite) => {
    setActiveSprite(sprite);
  };

  const updateSpriteCoordinate = (id: string, pos: ICoordinate) => {
    const item = spriteList.find((item) => item.id === id);
    if (item) {
      setActiveSprite({
        ...item,
        attrs: {
          ...item.attrs,
          coordinate: pos,
        },
      });
    }
    setSpriteList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, attrs: { ...item.attrs, coordinate: pos } };
        }
        return item;
      })
    );
  };

  return (
    <Stage width={width} height={height}>
      {spriteList.map((item, index) => {
        const spriteMeta = registerSpriteMetaMap.current[item.type];

        const SpriteComponent = spriteMeta.spriteComponent as any;

        if (!SpriteComponent) return null;
        return (
          <Sprite sprite={item} key={`${item.id}-${index}`}>
            <SpriteComponent sprite={item} />
          </Sprite>
        );
      })}

      <ActiveSpriteContainer
        store={{
          activeSprite,
          spriteList,
        }}
        apis={{
          updateActiveSprite,
          updateSpriteCoordinate,
        }}
      />
    </Stage>
  );
};

export default forwardRef(GraphicEditorCore);

export interface IGraphicEditorCoreRef {
  registerSprite: (spriteMeta: ISpriteMeta) => void;
  addSpriteToStage: (sprite: ISprite | ISprite[]) => void;
}
