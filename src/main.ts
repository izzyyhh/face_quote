import * as faceapi from "@vladmandic/face-api";

const video = document.querySelector("video");

await Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]);

console.log("loaded models");

const setupCamera = async () => {
  if (!video || !navigator.mediaDevices) return;

  const constraints = {
    audio: false,
    video: {},
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    return stream;
  } catch (e) {
    console.error("error while getting user media data", e);
  }
};

setupCamera();

if (video) {
  video.onplay = () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = video.width;
    canvas.height = video.height;
    const displayDimensions = { height: video.height, width: video.width };
    faceapi.matchDimensions(canvas, displayDimensions);

    setInterval(async () => {
      const detection = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetection = faceapi.resizeResults(
        detection,
        displayDimensions
      );

      ctx?.clearRect(0, 0, displayDimensions.width, displayDimensions.height);
      faceapi.draw.drawDetections(canvas, resizedDetection);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetection);
    });
  };
}
