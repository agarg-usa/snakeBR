import * as PIXI from "pixi.js";
import { Snake } from "./snake";
console.log('Hello World');
const width = window.innerWidth;
const height = window.innerHeight;
const app = new PIXI.Application({width, height, backgroundColor: 0xADD8E6});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.getElementById("app").appendChild(app.view);

// let sprite = PIXI.Sprite.from("/assets/bunny.png");
// sprite.scale.set(0.3);
// app.stage.addChild(sprite);
// sprite.anchor.set(0.5);
// let elapsed = 0;
// sprite.x = width / 2;
// sprite.y = height / 2;
// app.ticker.add((delta) => { //delta is how many hundredths of a second have passed since the last frame
// 	elapsed += delta;
// 	sprite.x = width/2 + 100*Math.sin(elapsed/25);
// 	sprite.y = height/2 + 100*Math.cos(elapsed/25);
// });

let snake = new Snake(app);