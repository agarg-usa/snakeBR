import * as PIXI from "pixi.js";
import { Grid } from "./grid/Grid";

export class World
{
	app: PIXI.Application;
	grid: Grid;

	constructor(app: PIXI.Application, grid: Grid)
	{
		this.app = app;
		this.grid = grid;
	}
}