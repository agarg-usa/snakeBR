import * as PIXI from "pixi.js";
import { GameState } from "./GameState";
import { Grid } from "./grid/Grid";

export class World
{
	app: PIXI.Application;
	grid: Grid;
	gameState : GameState;

	constructor(app: PIXI.Application, grid: Grid, gameState: GameState = null)
	{
		this.app = app;
		this.grid = grid;
		this.gameState = gameState;
	}
}