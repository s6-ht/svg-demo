import { Canvas } from "@/canvas";
import { useEffect } from "react";
import styles from "./index.less";

export default function HomePage() {
  useEffect(() => {
    new Canvas({
      root: "svg-demo",
    });
  }, []);

  return <div id="svg-demo" className={styles.container}></div>;
}
