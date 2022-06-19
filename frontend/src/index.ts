import * as PIXI from "pixi.js";
import { Snake } from "./gameObjects/snake/Snake";
import { World } from "./World";
import {Grid} from "./grid/Grid";
import { SinglePlayerGameState } from "./GameState";
import Stats from "stats.js";
import { loadTextures } from "./gameObjects/Textures";

// overlay is the div which allows you to overlay html elements on top of the canvas
let overlay = document.getElementById("overlay");

// create a div to hold the loading animation while waiting for textures to load

let loadingContainerHTML = `<div class="center"><div class="loader"></div></div>`;
let loadingContainer = document.createElement("span");
loadingContainer.innerHTML = loadingContainerHTML;
overlay.appendChild(loadingContainer);

loadTextures(() => {
	overlay.removeChild(loadingContainer);
	const app = new PIXI.Application({resizeTo: window});
	document.getElementById("app").appendChild(app.view);
	const world = new World(app);
	(window as any).world = world;

	// uncomment this for fps panel
	let stats = new Stats();
	stats.showPanel(0);
	document.body.appendChild(stats.dom);

	function animate() {

	    stats.begin();
	    stats.end();
	}

	app.ticker.add(animate);
});


