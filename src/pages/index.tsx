import { useEffect } from "react";
import styles from "./index.less";
import { Graph } from "@/ink-graph";

export default function HomePage() {
  useEffect(() => {
    const graph = new Graph({
      root: "svg-demo",
    });
  }, []);

  return <div id="svg-demo" className={styles.container}></div>;
}
