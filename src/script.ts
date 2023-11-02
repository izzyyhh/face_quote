import * as faceapi from "@vladmandic/face-api";

export const loadModels = async () => {
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.load("/models"),
    faceapi.nets.ageGenderNet.load("/models"),
    faceapi.nets.faceLandmark68Net.load("/models"),
    faceapi.nets.faceRecognitionNet.load("/models"),
    faceapi.nets.faceExpressionNet.load("/models"),
  ]);

  console.log("models loaded");
};

export const setupCamera = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  if (!navigator.mediaDevices) {
    console.log("error");
    return null;
  }

  console.info(video);
  console.info(canvas);

  const constraints = {
    audio: false,
    video: { facingMode: "user", resizeMode: "crop-and-scale" },
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    return stream;
  } catch (e) {
    console.error("error while getting user media data", e);
  }
};
