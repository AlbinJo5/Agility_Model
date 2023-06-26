import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
const mpHands = window;
const drawingUtils = window;
const controls = window;
const controls3d = window;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getFirestore,
  setDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBOGaYJUxilYCekjvzd4kmQLIFpEF9ibgU",
  authDomain: "vitofitness-f6879.firebaseapp.com",
  projectId: "vitofitness-f6879",
  storageBucket: "vitofitness-f6879.appspot.com",
  messagingSenderId: "767780104447",
  appId: "1:767780104447:web:9dcc5fae6f92ede48d84ca",
  measurementId: "G-4VSWMZ3CVF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function getParam(paramName) {
  const paramValue = location.search.split(paramName + "=")[1];
  return paramValue === undefined ? null : decodeURIComponent(paramValue);
}

const levelMaster = [
  {
    target: 10,
    ballCount: 4,
    ballSpeed: 5000,
    toUpdateLives: 3,
    difficulty: 0.7,
    song: "/assets/audio/songs/audio (1).mpeg",
  },
  {
    target: 20,
    ballCount: 5,
    ballSpeed: 5000,
    toUpdateLives: 2,
    difficulty: 0.65,
    song: "/assets/audio/songs/audio (1).mpeg",
  },
  {
    target: 30,
    ballCount: 6,
    ballSpeed: 4500,
    toUpdateLives: 2,
    difficulty: 0.6,
    song: "/assets/audio/songs/audio (2).mpeg",
  },
  {
    target: 40,
    ballCount: 7,
    ballSpeed: 4500,
    toUpdateLives: 2,
    difficulty: 0.55,
    song: "/assets/audio/songs/audio (2).mpeg",
  },
  {
    target: 50,
    ballCount: 8,
    ballSpeed: 4000,
    toUpdateLives: 2,
    difficulty: 0.5,
    song: "/assets/audio/songs/audio (3).mpeg",
  },
  {
    target: 60,
    ballCount: 9,
    ballSpeed: 4000,
    toUpdateLives: 1,
    difficulty: 0.45,
    song: "/assets/audio/songs/audio (3).mpeg",
  },
  {
    target: 70,
    ballCount: 10,
    ballSpeed: 3500,
    toUpdateLives: 1,
    difficulty: 0.4,
    song: "/assets/audio/songs/audio (4).mpeg",
  },
  {
    target: 80,
    ballCount: 11,
    ballSpeed: 3500,
    toUpdateLives: 1,
    difficulty: 0.35,
    song: "/assets/audio/songs/audio (4).mpeg",
  },
  {
    target: 90,
    ballCount: 12,
    ballSpeed: 3500,
    toUpdateLives: 1,
    difficulty: 0.3,
    song: "/assets/audio/songs/audio (5).mpeg",
  },
  {
    target: 100,
    ballCount: 13,
    ballSpeed: 3500,
    toUpdateLives: 1,
    difficulty: 0.25,
    song: "/assets/audio/songs/audio (5).mpeg",
  },
];

// Go back to flutter Function
document.getElementById("backButton").addEventListener("click", function () {
  window.postMessage("goBackToFlutterApp");
});

async function getAgilityData() {
  const userId = getParam("userId");
  // get document from Users collection / userId / Agility / documentId
  const docRef = doc(db, "Users", userId, "Agility", "normal");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    alert("No such document!");
  }
}

async function getLeaderboadData() {
  const userId = getParam("userId");
  // get document from Users collection / userId / Agility / documentId
  const docRef = doc(db, "Leaderboard", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    alert("No such document!");
  }
}

const levelData = await getAgilityData();

const leaderboardData = await getLeaderboadData();

var levelConfig = {
  level: levelData.level,
  target: levelMaster[levelData.level - 1].target,
  ballCount: levelMaster[levelData.level - 1].ballCount,
  ballSpeed: levelMaster[levelData.level - 1].ballSpeed,
  lives: levelData.lives,
  selectedBallType: levelData.selectedBallType,
  difficulty: levelMaster[levelData.level - 1].difficulty,
};

var streaks = 0;
var redImg = new Image();
redImg.src = "./assets/red.png";

var greenImg = new Image();
greenImg.src = `./assets/balls/${levelConfig.selectedBallType}.svg`;
// var score = 1000;
var life = levelConfig.lives;
var el = document.getElementById("seconds-counter");

var gameOverScreen = document.getElementById("gameOver");
var victoryScreen = document.getElementById("victory");
var container = document.getElementById("container");
var sc = document.getElementById("score");
var ready = document.getElementById("ready");
var audio = document.getElementById("myAudio");
var bellSound = document.getElementById("bellSound");
var wrongSound = document.getElementById("wrongSound");
var gameOverSound = document.getElementById("gameOverSound");
var gameWinSound = document.getElementById("gameWinSound");
var audioCanvas = document.getElementById("audioCanvas");
var readyText = document.getElementById("readyText");
var mainReady = true;

ready.style.display = "none";
// audio.pause();

const soundEffect = new Audio();
soundEffect.src =
  levelConfig.level != "1"
    ? levelMaster[levelConfig.level - 1].song
    : levelMaster[0].song;
soundEffect.loop = true;
// soundEffect.pause();
audioCanvas.addEventListener("click", () => {
  soundEffect.play();
  readyText.innerText = "🙌";
  readyText.style.fontSize = "2em";
  //   soundEffect.play();
});

// if level is 1 then show infinite lives
// sc.innerText =  life;
sc.innerText = levelConfig.level != "1" ? life : "∞";
el.innerText = streaks;

var isCompleted = false;

const targetHit = async () => {
  // update firebase data
  soundEffect.pause();
  setTimeout(() => {
    gameWinSound.play();
  }, 1000);
  const updatedLevelData = {
    level: levelConfig.level != 10 ? levelConfig.level + 1 : levelConfig.level,
    lives:
      levelConfig.level != 10
        ? levelMaster[levelConfig.level].toUpdateLives + levelConfig.lives
        : levelConfig.lives,
  };

  isCompleted = true;
  // replace container with victory screen
  container.style.display = "none";
  sc.style.display = "none";
  el.style.display = "none";
  victoryScreen.style.display = "flex";

  const userId = getParam("userId");
  //  set docs
  const docRef = doc(db, "Users", userId, "Agility", "normal");
  await setDoc(docRef, updatedLevelData, { merge: true });
  await setDoc(
    doc(db, "Leaderboard", userId),
    {
      normalCurrentLevel: levelConfig.level + 1,
      normalPrevLevel: levelConfig.level,
      normalWin: leaderboardData.normalWin + 1,
    },
    { merge: true }
  );
};

const gameOver = async () => {
  // connect to firebase
  soundEffect.pause();
  setTimeout(() => {
    gameOverSound.play();
  }, 1000);
  const updatedLevelData = {
    level: levelConfig.level - 1,
    lives: levelMaster[levelConfig.level].toUpdateLives,
  };

  isCompleted = true;
  // replace container with gameover screen
  container.style.display = "none";
  sc.style.display = "none";
  el.style.display = "none";
  gameOverScreen.style.display = "flex";

  const userId = getParam("userId");
  //  set docs

  const docRef = doc(db, "Users", userId, "Agility", "normal");
  await setDoc(docRef, updatedLevelData, { merge: true });
  await setDoc(
    doc(db, "Leaderboard", userId),
    {
      normalCurrentLevel: levelConfig.level - 1,
      normalPrevLevel: levelConfig.level,
      normalLose: leaderboardData.normalLose + 1,
    },
    { merge: true }
  );
};

// level master
// leftside ball x =10 , y = 100 to 800
// rightside ball x = 880 , y = 100 to 800
// topside x = 150 to 750 , y = 100
// bottomside x = 150 to 750 , y = 900

// possible combinations

const levelPoints = [
  { x: 125, y: 250 },
  { x: 125, y: 350 },
  { x: 125, y: 450 },
  { x: 125, y: 550 },
  { x: 125, y: 650 },
  { x: 125, y: 750 },

  { x: 980, y: 250 },
  { x: 980, y: 350 },
  { x: 980, y: 450 },
  { x: 980, y: 550 },
  { x: 980, y: 650 },
  { x: 980, y: 750 },

  { x: 150, y: 150 },
  { x: 300, y: 150 },
  { x: 450, y: 150 },
  { x: 600, y: 150 },
  { x: 750, y: 150 },

  { x: 150, y: 850 },
  { x: 300, y: 850 },
  { x: 450, y: 850 },
  { x: 600, y: 850 },
  { x: 750, y: 850 },
];

// level generator
const levelGenerator = async (numberOfBalls, difficulty) => {
  var output = [];
  // randomly put leftside or rightside or topside or bottomside
  for (var i = 0; i < numberOfBalls; i++) {
    var randomIndex = Math.floor(Math.random() * levelPoints.length);

    var data = levelPoints[randomIndex];

    // check if the ball is already present
    var isPresent = output.find((item) => {
      return item.x === data.x && item.y === data.y;
    });

    if (isPresent) {
      i--;
      continue;
    }

    //  random true or false
    var randomBoolean = Math.random() <= difficulty;
    if (randomBoolean) {
      data.isGreen = true;
    } else {
      data.isGreen = false;
    }

    output.push(data);
  }
  return output;
};

var balls;

async function generateBalls() {
  balls = await levelGenerator(levelConfig.ballCount, levelConfig.difficulty);
}

generateBalls();
// if isCompleted is true then stop the interval
// setInterval(generateBalls, levelConfig.ballSpeed);

setInterval(() => {
  if (isCompleted) {
    return;
  }
  generateBalls();
}, levelConfig.ballSpeed);

var Ballwidth;
var Ballheight;

var decreaseX = 0;
var decreaseY = 0;

// if screen is tablet or mobile then change the ball size
if (window.outerWidth < 760) {
  Ballwidth = 100;
  Ballheight = 50;
  decreaseX = 50;
  decreaseY = 25;
} else {
  Ballwidth = 100;
  Ballheight = 80;
  decreaseX = 50;
  decreaseY = 40;
}

function decrementScore() {
  if (levelConfig.level != 1) {
    life = life - 1;
    if (life <= 0) {
      gameOver();
      return;
    }
    sc.innerText = life;
    streaks = 0;
    el.innerText = 0;
  }
}

function incrementScore() {
  streaks = streaks + 1;
  if (streaks >= levelConfig.target) {
    targetHit();
    return;
  }
  el.innerText = streaks;
}

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
  spinner.style.display = "none";
};

var handsDetected = false;
var continousHandsDetected = 0;

function onResults(results) {
  // Hide the spinner.
  document.body.classList.add("loaded");
  //   audio.play();
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
      // if 2 hands are detected for 3 seconds
      if (readyText.innerText != "Tap") {
        if (results.multiHandLandmarks.length == 2) {
          continousHandsDetected++;
          if (continousHandsDetected == 5) {
            readyText.innerText = "Get";
          }
          if (continousHandsDetected == 40) {
            readyText.innerText = "Palms";
          }
          if (continousHandsDetected == 70) {
            readyText.innerText = "Ready";
          }
          if (continousHandsDetected > 100) {
            handsDetected = true;
            mainReady = false;
            ready.style.display = "none";
          }
        } else {
          continousHandsDetected = 0;
          readyText.innerText = "🙌";
          readyText.style.fontSize = "2em";
        }
      }

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
      canvasCtx.fillStyle = "#000000";
      canvasCtx.fill();

      canvasCtx.lineWidth = 5;
    }
  }
  canvasCtx.restore();

  if (handsDetected) {
    balls.forEach((point, i) => {
      canvasCtx.drawImage(
        point.isGreen ? greenImg : redImg,
        point.x - decreaseX,
        point.y - decreaseY,
        Ballwidth,
        Ballheight
      );

      // if the above drawn circle touches the ball then remove the ball
      if (results.multiHandLandmarks && results.multiHandedness) {
        for (
          let index = 0;
          index < results.multiHandLandmarks.length;
          index++
        ) {
          const landmarks = results.multiHandLandmarks[index];
          const middlePoint = {
            x: (landmarks[9].x + landmarks[0].x) / 2,
            y: (landmarks[9].y + landmarks[0].y) / 2,
            z: (landmarks[9].z + landmarks[0].z) / 2,
          };

          if (
            Math.sqrt(
              Math.pow(point.x - middlePoint.x * canvasElement.width, 2) +
                Math.pow(point.y - middlePoint.y * canvasElement.height, 2)
            ) < 50
          ) {
            if (point.isGreen) {
              bellSound.play();
              incrementScore();
            } else {
              wrongSound.play();
              decrementScore();
            }
            balls.splice(balls.indexOf(point), 1);
            break;
          }
        }
      }
    });
  }
}
const hands = new mpHands.Hands(config);

// only run the model if the game is not completed
// hands.onResults(onResults);
hands.onResults((results) => {
  if (!isCompleted) {
    if (mainReady) {
      ready.style.display = "flex";
    }
    onResults(results);
  }
});

new controls.ControlPanel(controlsElement, {
  selfieMode: true,
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.1,
  minTrackingConfidence: 0.1,
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
