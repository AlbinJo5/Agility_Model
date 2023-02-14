import { getImgeData } from "./ballSpwaning.js";


const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
// get element from using id from html
const scoreElement = document.getElementById('score');
const scoreElement2 = document.getElementById('score2');

var hide = false;

const imageData = getImgeData();

// function to set time out
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//funtion to set timer
function setTimer() {
    var time = 0;
    var timer = setInterval(function () {
        time++;
        console.log(time);
        if (time === 5) {
            clearInterval(timer);
            hide = true;
            console.log("hide");
        }
    }, 1000);
}

function SurfaceArea(a, b, c) {
    // a={x:0,y:0,z:0}
    // b={x:0,y:0,z:0}
    // c={x:0,y:0,z:0}
    var v1 = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
    var v2 = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
    var cp = { x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x };
    return 0.5 * Math.sqrt(cp.x * cp.x + cp.y * cp.y + cp.z * cp.z);
}

function onResults(results) {
    console.log(canvasElement.width);
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);


    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    // flip the canvas so that it is not mirrored

    // dran an image into the canvas with results.image

    try {
        if (results.multiHandLandmarks) {
            imageData.forEach(element => {
                if (!element.hide) {
                    element.img.src = element.path;
                    canvasCtx.drawImage(element.img, element.x, element.y, element.width, element.height);


                }
            });




            imageData.forEach(element2 => {


                var x = element2.center.x;
                var y = element2.center.y;

                console.log("x: " + x + " y: " + y);
                console.log(results.multiHandLandmarks.length);
                console.log(results.multiHandLandmarks);

                if (results.multiHandLandmarks.length === 2) {
                    var A_x1 = results.multiHandLandmarks[0][0].x * canvasElement.width;
                    var A_y1 = results.multiHandLandmarks[0][0].y * canvasElement.height;
                    var A_x2 = results.multiHandLandmarks[0][5].x * canvasElement.width;
                    var A_y2 = results.multiHandLandmarks[0][5].y * canvasElement.height;
                    var A_x3 = results.multiHandLandmarks[0][17].x * canvasElement.width;
                    var A_y3 = results.multiHandLandmarks[0][17].y * canvasElement.height;

                    var B_x1 = results.multiHandLandmarks[1][0].x * canvasElement.width;
                    var B_y1 = results.multiHandLandmarks[1][0].y * canvasElement.height;
                    var B_x2 = results.multiHandLandmarks[1][5].x * canvasElement.width;
                    var B_y2 = results.multiHandLandmarks[1][5].y * canvasElement.height;
                    var B_x3 = results.multiHandLandmarks[1][17].x * canvasElement.width;
                    var B_y3 = results.multiHandLandmarks[1][17].y * canvasElement.height;

                    var A_x0 = x;
                    var A_y0 = y;

                    var B_x0 = x;
                    var B_y0 = y;

                    var A_a = (A_x1 - A_x0) * (A_y2 - A_y1) - (A_x2 - A_x1) * (A_y1 - A_y0);
                    var A_b = (A_x2 - A_x0) * (A_y3 - A_y2) - (A_x3 - A_x2) * (A_y2 - A_y0);
                    var A_c = (A_x3 - A_x0) * (A_y1 - A_y3) - (A_x1 - A_x3) * (A_y3 - A_y0);

                    var B_a = (B_x1 - B_x0) * (B_y2 - B_y1) - (B_x2 - B_x1) * (B_y1 - B_y0);
                    var B_b = (B_x2 - B_x0) * (B_y3 - B_y2) - (B_x3 - B_x2) * (B_y2 - B_y0);
                    var B_c = (B_x3 - B_x0) * (B_y1 - B_y3) - (B_x1 - B_x3) * (B_y3 - B_y0);

                    if (A_a * A_b > 0 && A_b * A_c > 0 && A_c * A_a > 0) {
                        element2.hide = true;
                    }
                    else if (B_a * B_b > 0 && B_b * B_c > 0 && B_c * B_a > 0) {
                        element2.hide = true;
                    }
                    else {
                        element2.hide = false;
                    }


                }
                else {
                    var x1 = results.multiHandLandmarks[0][5].x * canvasElement.width;
                    var y1 = results.multiHandLandmarks[0][5].y * canvasElement.height;
                    var x2 = results.multiHandLandmarks[0][0].x * canvasElement.width;
                    var y2 = results.multiHandLandmarks[0][0].y * canvasElement.height;
                    var x3 = results.multiHandLandmarks[0][17].x * canvasElement.width;
                    var y3 = results.multiHandLandmarks[0][17].y * canvasElement.height;

                    var x0 = x;
                    var y0 = y;

                    var a = (x1 - x0) * (y2 - y1) - (x2 - x1) * (y1 - y0);
                    var b = (x2 - x0) * (y3 - y2) - (x3 - x2) * (y2 - y0);
                    var c = (x3 - x0) * (y1 - y3) - (x1 - x3) * (y3 - y0);

                    if (a > 0 && b > 0 && c > 0 || a < 0 && b < 0 && c < 0) {
                        // the point is inside the triangle
                        element2.hide = true;
                    }
                    else {
                        // the point is outside the triangle
                        element2.hide = false;
                        console.log("outside");
                    }

                }
            });

            // set the z coordinate of the [0] to the scoreElement
            scoreElement.innerHTML = SurfaceArea(results.multiHandLandmarks[0][0], results.multiHandLandmarks[0][5], results.multiHandLandmarks[0][17]);
            scoreElement2.innerHTML = SurfaceArea(results.multiHandLandmarks[1][0], results.multiHandLandmarks[1][5], results.multiHandLandmarks[1][17]);
        }

    } catch (error) {
        console.log(error);
    }









    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: "90vw",
    height: "90vw"
});

camera.start();