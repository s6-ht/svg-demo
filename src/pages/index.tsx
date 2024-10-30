import { useEffect, useRef } from "react";

export default function HomePage() {
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    ref.current?.addEventListener("click", () => {
      console.log("click");
    });
  }, []);

  return (
    <div>
      <svg width="200" height="200">
        <circle ref={ref} id="myCircle" cx="100" cy="100" r="50" fill="blue" />
      </svg>
    </div>
  );
}
