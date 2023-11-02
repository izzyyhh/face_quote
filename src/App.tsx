import { useEffect, useRef } from "react";
import "./App.css";
import { loadModels, setupCamera } from "./script";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      setupCamera(videoRef.current, canvasRef.current);
    }

    loadModels()
      .then(() => {
        console.info("models loaded");
      })
      .catch((e) => {
        console.error(e, "failed loading models");
      });
  }, []);

  return (
    <>
      <h1>Face Quote</h1>
      <div style={{ position: "relative" }}>
        <video playsInline autoPlay id="video" ref={videoRef}></video>
        <canvas
          ref={canvasRef}
          id="canvas"
          style={{ position: "fixed", zIndex: 10, left: 0 }}
        ></canvas>
      </div>
    </>
  );
}

export default App;
