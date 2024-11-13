import { Canvas } from "@/canvas";
import { useEffect } from "react";
import styles from "./index.less";

export default function HomePage() {
  useEffect(() => {
    new Canvas({
      root: "svg-demo",
      nodes: [
        {
          type: "rect",
          style: {
            width: 200,
            height: 200,
          },
        },
      ],
    });
  }, []);

  return <div id="svg-demo" className={styles.container}></div>;
}
