import {

  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";

import "@xyflow/react/dist/base.css";
import { toPng } from "html-to-image";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.05
    );
    const el = document.querySelector(".react-flow__viewport");
    if (el)
      toPng(el as HTMLElement, {
        backgroundColor: "#f0f0f0",
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}`,
          height: `${imageHeight}`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      }).then(downloadImage);
  };

  return (
    <button className="button-36" onClick={onClick}>
      Download Image
    </button>
  );
}
