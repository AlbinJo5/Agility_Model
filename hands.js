import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
const mpHands = window;
const drawingUtils = window;
const controls = window;
const controls3d = window;
// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os

var seconds = 60;
var score = 1000;
var el = document.getElementById("seconds-counter");
var sc = document.getElementById("score");

sc.innerText = 2000;

// level master
// leftside ball x =10 , y = 100 to 800
// rightside ball x = 880 , y = 100 to 800
// topside x = 150 to 750 , y = 100
// bottomside x = 150 to 750 , y = 900

// possible combinations

const levelPoints = [
  { x: 10, y: 200 },
  { x: 10, y: 300 },
  { x: 10, y: 400 },
  { x: 10, y: 500 },
  { x: 10, y: 600 },
  { x: 10, y: 700 },
  { x: 10, y: 800 },
  { x: 880, y: 200 },
  { x: 880, y: 300 },
  { x: 880, y: 400 },
  { x: 880, y: 500 },
  { x: 880, y: 600 },
  { x: 880, y: 700 },
  { x: 880, y: 800 },
  { x: 150, y: 100 },
  { x: 300, y: 100 },
  { x: 450, y: 100 },
  { x: 600, y: 100 },
  { x: 750, y: 100 },
  { x: 150, y: 900 },
  { x: 300, y: 900 },
  { x: 450, y: 900 },
  { x: 600, y: 900 },
  { x: 750, y: 900 },
];

// level generator
const levelGenerator = async (numberOfBalls) => {
  var output = [];
  // randomly put leftside or rightside or topside or bottomside
  for (var i = 0; i < numberOfBalls; i++) {
    var randomIndex = Math.floor(Math.random() * levelPoints.length);

    var data = levelPoints[randomIndex];
    //  random true or false
    var randomBoolean = Math.random() >= 0.5;
    if (randomBoolean) {
      data.isGreen = true;
    } else {
      data.isGreen = false;
    }

    output.push(data);
    levelPoints.splice(randomIndex, 1);
  }
  return output;
};

var balls;

async function generateBalls() {
  balls = await levelGenerator(5);
}

generateBalls();

var Ballwidth;
var Ballheight;

// if screen is tablet or mobile then change the ball size
if (window.outerWidth < 760) {
  console.log(window.outerWidth);
  Ballwidth = 200;
  Ballheight = 100;
  console.log("mobile");
} else {
  console.log(window.innerWidth);
  Ballwidth = 200;
  Ballheight = 130;
  console.log("tab");
}

function decrementScore() {
  if (score >= 0) {
    score -= 100;
    seconds -= 5;
    el.innerText = seconds;
    sc.innerText = score;
    return;
  }
}

function incrementScore() {
  if (score >= 0) {
    score += 100;
    seconds += 5;
    el.innerText = seconds;

    sc.innerText = score;
    return;
  }
}

function incrementSeconds() {
  if (seconds == 0) {
    clearInterval(cancel);
    alert("Time's up!");
    return;
  }
  seconds -= 1;
  el.innerText = seconds;
}

var cancel = setInterval(incrementSeconds, 1000);

const acpectRatio = 0.75;
var gridWidth = 0;
var gridHeight = 0;
if (window.innerWidth > window.innerHeight) {
  gridHeight = window.innerHeight;
  gridWidth = window.innerHeight / acpectRatio;
} else {
  gridWidth = window.innerWidth;
  gridHeight = window.innerWidth * acpectRatio;
}

var level = 1;
var numberOfPoints = 6;
var numberofGreenBalls = 8;
var numberofRedBalls = 5;
var output = {
  greenBalls: [],
  redBalls: [],
};

async function evenlyDistributePointsInGrid(
  gridWidth,
  gridHeight,
  numberOfPoints
) {
  var output = [];
  var x_step = gridWidth / numberOfPoints;
  var y_step = gridHeight / (numberOfPoints - 1);

  // this is a flot number, so we need to convert it to int
  x_step = parseInt(x_step);
  y_step = parseInt(y_step);

  for (var x = 100; x < gridWidth; x += x_step) {
    for (var y = 70; y < gridHeight; y += y_step) {
      output.push({ x: x, y: y });
    }
  }
  return output;
}

const points = await evenlyDistributePointsInGrid(
  gridWidth + 200,
  gridHeight - 100,
  numberOfPoints
);

async function generateRandomPoints(
  points,
  numberofGreenBalls,
  numberofRedBalls
) {
  var greenBalls = [];
  var redBalls = [];

  var tempPoints = points;

  for (var i = 0; i < numberofGreenBalls; i++) {
    var randomIndex = Math.floor(Math.random() * tempPoints.length);
    greenBalls.push(tempPoints[randomIndex]);
    tempPoints.splice(randomIndex, 1);
  }

  for (var i = 0; i < numberofRedBalls; i++) {
    var randomIndex = Math.floor(Math.random() * tempPoints.length);
    redBalls.push(tempPoints[randomIndex]);
    tempPoints.splice(randomIndex, 1);
  }

  output.greenBalls = greenBalls;
  output.redBalls = redBalls;
}
await generateRandomPoints(points, numberofGreenBalls, numberofRedBalls);

console.log(output);

testSupport([{ client: "Chrome" }]);
function testSupport(supportedDevices) {
  const deviceDetector = new DeviceDetector();
  const detectedDevice = deviceDetector.parse(navigator.userAgent);
  let isSupported = false;
  for (const device of supportedDevices) {
    if (device.client !== undefined) {
      const re = new RegExp(`^${device.client}$`);
      if (!re.test(detectedDevice.client.name)) {
        continue;
      }
    }
    if (device.os !== undefined) {
      const re = new RegExp(`^${device.os}$`);
      if (!re.test(detectedDevice.os.name)) {
        continue;
      }
    }
    isSupported = true;
    break;
  }

  if (!isSupported) {
    // alert(`This demo, running on ${detectedDevice.client.name}/${detectedDevice.os.name}, ` +
    //     `is not well supported at this time, continue at your own risk.`);
  }
}
// Our input frames will come from here.
const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const controlsElement = document.getElementsByClassName("control-panel")[0];
const canvasCtx = canvasElement.getContext("2d");
const config = {
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
  },
};
// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
const fpsControl = new controls.FPS();
// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector(".loading");
spinner.ontransitionend = () => {
  console.log("spinner transition end");
  spinner.style.display = "none";
};
function onResults(results) {
  // Hide the spinner.
  document.body.classList.add("loaded");
  // Update the frame rate.
  fpsControl.tick();
  // Draw the overlays.
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      // find the middle point between wrist and middle finger
      const landmarks = results.multiHandLandmarks[index];
      const middlePoint = {
        x: (landmarks[9].x + landmarks[0].x) / 2,
        y: (landmarks[9].y + landmarks[0].y) / 2,
        z: (landmarks[9].z + landmarks[0].z) / 2,
      };
      // draw a circle at the middle point
      canvasCtx.beginPath();
      canvasCtx.arc(
        middlePoint.x * canvasElement.width,
        middlePoint.y * canvasElement.height,
        50,
        0,
        2 * Math.PI
      );
      canvasCtx.fillStyle = "#FF0000";
      canvasCtx.fill();
    }
  }
  canvasCtx.restore();

  var redImg = new Image();
  redImg.src = "./assets/red.svg";

  var greenImg = new Image();
  greenImg.src = "./assets/green.svg";

  balls.forEach((point) => {
    canvasCtx.drawImage(
      point.isGreen ? greenImg : redImg,
      point.x,
      point.y,
      Ballwidth,
      Ballheight
    );

    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const landmarks = results.multiHandLandmarks[index];
        const middlePoint = {
          x: (landmarks[9].x + landmarks[0].x) / 2,
          y: (landmarks[9].y + landmarks[0].y) / 2,
          z: (landmarks[9].z + landmarks[0].z) / 2,
        };
        // draw a point at the middle point
        canvasCtx.beginPath();
        canvasCtx.arc(
          middlePoint.x * canvasElement.width,
          middlePoint.y * canvasElement.height,
          5,
          0,
          2 * Math.PI
        );
        canvasCtx.fillStyle = "#0000FF";
        canvasCtx.fill();

        if (
          Math.sqrt(
            Math.pow(point.x * canvasElement.width - (point.x - 20), 2) +
              Math.pow(middlePoint.y * canvasElement.height - point.y, 2)
          ) < 50
        ) {
          balls.splice(output.redBalls.indexOf(point), 1);
          decrementScore();
        }
      }
    }


  });

  // output.redBalls.forEach((point) => {
  //   canvasCtx.drawImage(redImg, point.x, point.y, 100, 100);

  //   // if the above drawn circle touches the red ball, then remove the red ball
  //   if (results.multiHandLandmarks && results.multiHandedness) {
  //     for (let index = 0; index < results.multiHandLandmarks.length; index++) {
  //       const landmarks = results.multiHandLandmarks[index];
  //       const middlePoint = {
  //         x: (landmarks[9].x + landmarks[0].x) / 2,
  //         y: (landmarks[9].y + landmarks[0].y) / 2,
  //         z: (landmarks[9].z + landmarks[0].z) / 2,
  //       };
  //       // draw a point at the middle point
  //       canvasCtx.beginPath();
  //       canvasCtx.arc(
  //         middlePoint.x * canvasElement.width,
  //         middlePoint.y * canvasElement.height,
  //         5,
  //         0,
  //         2 * Math.PI
  //       );
  //       canvasCtx.fillStyle = "#0000FF";
  //       canvasCtx.fill();

  //       if (
  //         Math.sqrt(
  //           Math.pow(.x * canvasElement.width - (point.x - 20), 2) +
  //             Math.pow(middlePoint.y * canvasElement.height - point.y, 2)
  //         ) < 50
  //       ) {
  //         output.redBalls.splice(output.redBalls.indexOf(point), 1);
  //         decrementScore();
  //       }
  //     }
  //   }
  // });

  // output.greenBalls.forEach((point) => {
  //   canvasCtx.drawImage(greenImg, point.x, point.y, 100, 100);

  //   // if the above drawn circle touches the green ball, then remove the green ball
  //   if (results.multiHandLandmarks && results.multiHandedness) {
  //     for (let index = 0; index < results.multiHandLandmarks.length; index++) {
  //       const landmarks = results.multiHandLandmarks[index];
  //       const middlePoint = {
  //         x: (landmarks[9].x + landmarks[0].x) / 2,
  //         y: (landmarks[9].y + landmarks[0].y) / 2,
  //         z: (landmarks[9].z + landmarks[0].z) / 2,
  //       };

  //       if (
  //         Math.sqrt(
  //           Math.pow(middlePoint.x * canvasElement.width - (point.x - 20), 2) +
  //             Math.pow(middlePoint.y * canvasElement.height - point.y, 2)
  //         ) < 50
  //       ) {
  //         console.table({
  //           x: middlePoint.x * canvasElement.width,
  //           y: middlePoint.y * canvasElement.height,
  //           pointX: point.x,
  //           pointY: point.y,
  //           distance: Math.sqrt(
  //             Math.pow(
  //               middlePoint.x * canvasElement.width - (point.x - 20),
  //               2
  //             ) + Math.pow(middlePoint.y * canvasElement.height - point.y, 2)
  //           ),
  //         });

  //         incrementScore();

  //         output.greenBalls.splice(output.greenBalls.indexOf(point), 1);
  //       }
  //     }
  //   }
  // });

  // if green and red balls are empty, then regenerate them
  if (output.redBalls.length == 0 && output.greenBalls.length == 0) {
    generateRandomPoints(points, numberofGreenBalls, numberofRedBalls);
    document.body.classList.remove("loaded");
  }
}
const hands = new mpHands.Hands(config);
hands.onResults(onResults);

new controls.ControlPanel(controlsElement, {
  selfieMode: true,
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.9,
  minTrackingConfidence: 0.5,
})
  .add([
    new controls.StaticText({ title: "MediaPipe Hands" }),
    fpsControl,
    new controls.Toggle({ title: "Selfie Mode", field: "selfieMode" }),
    new controls.SourcePicker({
      onFrame: async (input, size) => {
        const aspect = size.height / size.width;
        let width, height;
        if (window.innerWidth > window.innerHeight) {
          height = window.innerHeight;
          width = height / aspect;
        } else {
          width = window.innerWidth;
          height = width * aspect;
        }
        await hands.send({ image: input });
      },
    }),
    new controls.Slider({
      title: "Max Number of Hands",
      field: "maxNumHands",
      range: [1, 4],
      step: 1,
    }),
    new controls.Slider({
      title: "Model Complexity",
      field: "modelComplexity",
      discrete: ["Lite", "Full"],
    }),
    new controls.Slider({
      title: "Min Detection Confidence",
      field: "minDetectionConfidence",
      range: [0, 1],
      step: 0.01,
    }),
    new controls.Slider({
      title: "Min Tracking Confidence",
      field: "minTrackingConfidence",
      range: [0, 1],
      step: 0.01,
    }),
  ])
  .on((x) => {
    const options = x;
    videoElement.classList.toggle("selfie", options.selfieMode);
    hands.setOptions(options);
  });
