import * as PIXI from "pixi.js";
import { Snake } from "./gameObjects/snake";
import { World } from "./World";
import {Grid} from "./grid/Grid";

const app = new PIXI.Application({resizeTo: window, backgroundColor: 0xADD8E6});
document.getElementById("app").appendChild(app.view);
const grid = new Grid(50,50);
const world = new World(app, grid);
let snake = new Snake(world);