import * as PIXI from "pixi.js";
import { Snake } from "./gameObjects/snake";
import { World } from "./World";
import {Grid} from "./grid/Grid";
import { SinglePlayerGameState } from "./GameState";
import Stats from "stats.js";
import { loadTextures } from "./gameObjects/Textures";

let overlay = document.getElementById("overlay");
let loaderContainer = document.createElement("div");
loaderContainer.classList.add("center");
let loader = document.createElement("div");
loader.classList.add("loader");
loaderContainer.appendChild(loader);
overlay.appendChild(loaderContainer);

loadTextures(() => {
	overlay.removeChild(loaderContainer);
	const app = new PIXI.Application({resizeTo: window});
	document.getElementById("app").appendChild(app.view);
	const world = new World(app);
	(window as any).world = world;
});

//uncomment this for fps panel
// let stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

// function animate() {

//     stats.begin();
//     stats.end();

//     requestAnimationFrame( animate );
// }

// requestAnimationFrame( animate );
