const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

var hide = false;

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);


    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

    // dran an image into the canvas with results.image


    if (results.multiHandLandmarks) {

        if (!hide) {

            // var img2 = new Image();
            // img2.src = "./assets/test.png";
            // canvasCtx.drawImage(img2, 1, 1);

            // var img = new Image();
            // img.src = "https://www.w3schools.com/images/w3schools_green.jpg";
            // canvasCtx.drawImage(img, 1, 1);
        }

        // timeout to hide the image

        for (const landmarks of results.multiHandLandmarks) {
            // shade the area of the triangle
            canvasCtx.beginPath();
            canvasCtx.moveTo(landmarks[5].x * canvasElement.width, landmarks[5].y * canvasElement.height);
            canvasCtx.lineTo(landmarks[0].x * canvasElement.width, landmarks[0].y * canvasElement.height);
            canvasCtx.lineTo(landmarks[17].x * canvasElement.width, landmarks[17].y * canvasElement.height);
            canvasCtx.fillStyle = "rgba(0, 255, 0, 0.5)";
            canvasCtx.fill();
        }

        for (const landmarks of results.multiHandLandmarks) {


            // get the coordinates of the image
            var x = 100;
            var y = 100;
            var w = 1000;
            var h = 1000;

            // get the coordinates of the triangle
            var x1 = results.multiHandLandmarks[0][5].x * canvasElement.width;
            var y1 = results.multiHandLandmarks[0][5].y * canvasElement.height;
            var x2 = results.multiHandLandmarks[0][0].x * canvasElement.width;
            var y2 = results.multiHandLandmarks[0][0].y * canvasElement.height;
            var x3 = results.multiHandLandmarks[0][17].x * canvasElement.width;
            var y3 = results.multiHandLandmarks[0][17].y * canvasElement.height;

            // check if the image touching the triangle
            var A = 1 / 2 * (-y2 * x3 + y1 * (-x2 + x3) + x1 * (y2 - y3) + x2 * y3);
            var sign = A < 0 ? -1 : 1;
            var s = (y1 * x3 - x1 * y3 + (y3 - y1) * x + (x1 - x3) * y) * sign;
            var t = (x1 * y2 - y1 * x2 + (y1 - y2) * x + (x2 - x1) * y) * sign;

            if (s > 0 && t > 0 && (s + t) < 2 * A * sign) {
                console.log("touching");
                // delete the image
                hide = true;
            }
            else {
                console.log("not touching");
                console.log(s);
                console.log(t);
                console.log(A);
                console.log(sign);

            }




        }
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
    width: window.innerWidth,
    height: window.innerWidth
});

camera.start();