import { useRef } from "react";
import GraphicEditorCore, { IGraphicEditorCoreRef } from "./GraphicEditorCore";
import { ISprite } from "./types/sprite";
import rectSpriteMeta from "./sprites/Rect";
import lineSpriteMeta from "./sprites/Line";
import { useMount } from "ahooks";

// 默认精灵列表
const defaultSpriteList: ISprite[] = [
  {
    id: "RectSprite1",
    type: "RectSprite",
    props: {
      fill: "#fdc5bf",
    },
    attrs: {
      coordinate: { x: 100, y: 100 },
      size: { width: 160, height: 100 },
      angle: 0,
    },
  },
  {
    id: "LineSpriteMeta1",
    type: "LineSprite",
    props: {
      stroke: "#84db92",
      strokeWidth: 6,
      x1: 0,
      y1: 0,
      x2: 160,
      y2: 100,
    },
    attrs: {
      coordinate: { x: 100, y: 240 },
      size: { width: 160, height: 100 },
      angle: 0,
    },
  },
];

const GraphicDemo = () => {
  const graphicEditorRef = useRef<IGraphicEditorCoreRef>(null);
  const inited = useRef(false);

  useMount(() => {
    if (inited.current) return;
    graphicEditorRef.current?.registerSprite(rectSpriteMeta);
    graphicEditorRef.current?.registerSprite(lineSpriteMeta);
    graphicEditorRef.current?.addSpriteToStage(defaultSpriteList);
    inited.current = true;
  });

  return <GraphicEditorCore ref={graphicEditorRef} width={800} height={600} />;
};
export default GraphicDemo;
