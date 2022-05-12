import * as PIXI from "pixi.js";
import { Snake } from "./gameObjects/snake";
import { World } from "./World";
import {Grid} from "./grid/Grid";
import { SinglePlayerGameState } from "./GameState";
import Stats from "stats.js";

const app = new PIXI.Application({resizeTo: window});
document.getElementById("app").appendChild(app.view);
const grid = new Grid(50,50);
const world = new World(app, grid);
world.gameState = new SinglePlayerGameState(world);
world.gameState.start();

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function animate() {

    stats.begin();
    stats.end();

    requestAnimationFrame( animate );

}

requestAnimationFrame( animate );
