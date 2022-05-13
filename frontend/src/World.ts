import * as PIXI from "pixi.js";
import { Camera } from "./Camera";
import { GameState, SinglePlayerGameState } from "./GameState";
import { Grid } from "./grid/Grid";

export class World
{
	app: PIXI.Application;
	grid: Grid;
	gameState : GameState;
	camera : Camera;

	constructor(app: PIXI.Application, grid: Grid = new Grid(), gameState: GameState = null, camera: Camera = null)
	{
		this.app = app;
		this.grid = grid;

		if(gameState == null)
		{
			gameState = new SinglePlayerGameState(this);
			// todo change this to menu state
		}

		if(camera == null)
		{
			camera = new Camera(this);
		}

		this.gameState = gameState;
		this.camera = camera;
		gameState.start();
	}
}