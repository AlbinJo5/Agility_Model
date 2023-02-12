const positionHolder = [
    { x: 0, y: 0 },
    { x: 50, y: 0 },
    { x: 100, y: 0 },
    { x: 150, y: 0 },
    { x: 200, y: 0 },
    { x: 250, y: 0 },

    { x: 0, y: 25 },
    { x: 50, y: 25 },
    { x: 100, y: 25 },
    { x: 150, y: 25 },
    { x: 200, y: 25 },
    { x: 250, y: 25 },

    { x: 0, y: 50 },
    { x: 50, y: 50 },
    { x: 100, y: 50 },
    { x: 150, y: 50 },
    { x: 200, y: 50 },
    { x: 250, y: 50 },

    { x: 0, y: 75 },
    { x: 50, y: 75 },
    { x: 100, y: 75 },
    { x: 150, y: 75 },
    { x: 200, y: 75 },
    { x: 250, y: 75 },

    { x: 0, y: 100 },
    { x: 50, y: 100 },
    { x: 100, y: 100 },
    { x: 150, y: 100 },
    { x: 200, y: 100 },
    { x: 250, y: 100 },

    { x: 0, y: 125 },
    { x: 50, y: 125 },
    { x: 100, y: 125 },
    { x: 150, y: 125 },
    { x: 200, y: 125 },
    { x: 250, y: 125 },

]

function randomNumber(min, max, count, array = []) {
    var arr = [];
    if (array.length > 0) {
        for (var i = 0; i < count; i++) {
            // first check if the array contains the number
            var num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (array.indexOf(num) === -1) {
                if (arr.indexOf(num) === -1) {
                    arr.push(num);
                }
                else {
                    i--;
                }
            }
            else {
                i--;
            }
        }
    }
    else {

        for (var i = 0; i < count; i++) {
            // first check if the array contains the number
            var num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (arr.indexOf(num) === -1) {
                arr.push(num);
            }
            else {
                i--;
            }
        }
        return arr;
    }
}
// {
//     img: new Image(),
//     x: 0,
//     y: 0,
//     width: 50,
//     height: 25,
//     path: "./assets/cricketball.svg",
//     hide: false
// },


export const getImgeData = () => {
    var imgData = [];

    var greenBalls = randomNumber(0, 35, 5);
    var redBalls = randomNumber(0, 35, 3, greenBalls);

    greenBalls.forEach(element => {
        imgData.push({
            img: new Image(),
            x: positionHolder[element].x,
            y: positionHolder[element].y,
            width: 50,
            height: 25,
            path: "./assets/green.svg",
            hide: false,
            center: {
                x: positionHolder[element].x + 25,
                y: positionHolder[element].y + 12.5
            }
        })
    });

    redBalls.forEach(element => {
        imgData.push({
            img: new Image(),
            x: positionHolder[element].x,
            y: positionHolder[element].y,
            width: 50,
            height: 25,
            path: "./assets/red.svg",
            hide: false,
            center: {
                x: positionHolder[element].x + 25,
                y: positionHolder[element].y + 12.5
            }
        })
    });


    return imgData;
}