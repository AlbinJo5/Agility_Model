import { getAgilityData } from "./firebase.js";
// X axis = 300
// Y axis = 150
const levels = [
    {
        level: 1,
        name:"Level 1",
        greenBalls: 5,
        redBalls: 3,
        time: 30,
        
    }
]


const agilityData = await getAgilityData();
console.log(agilityData);