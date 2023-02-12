function randomNumber(min, max, count) {
    var arr = [];
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

console.log(randomNumber(0, 16, 5));

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

    for (let i = 0; i <= 200;) {
        for (let j = 0; j <= 100;) {
            imgData.push({
                img: new Image(),
                x: i,
                y: j,
                width: 50,
                height: 25,
                path: "./assets/cricketball.svg",
                hide: false,
                center:{
                    x: i + 25,
                    y: j + 12.5
                }
            });
            j += 25;
        }
        i += 50;
    }
    return imgData;
}