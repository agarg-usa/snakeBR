import * as PIXI from "pixi.js";
import { Camera } from "./Camera";
import { GameState, MenuGameState, SinglePlayerGameState } from "./GameState";
import { Grid } from "./grid/Grid";
import { getPosOfGrid } from "./grid/GridUtil";

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
			// gameState = new SinglePlayerGameState(this);
			// todo change this to menu state
			gameState = new MenuGameState(this);
		}

		if(camera == null)
		{
			camera = new Camera(this);
		}

		this.gameState = gameState;
		this.camera = camera;
		gameState.start();
	}

	destroyAndRecreate(grid = new Grid(), app = new PIXI.Application({resizeTo: window}))
	{
		this.app.destroy(true);  // destroy app along with the canvas view
		this.app = app;
		document.getElementById("app").appendChild(this.app.view);
		this.grid = grid;
	}

	changeGameState(gameState : GameState, destroy = false)
	{
		if(destroy)
		{
			this.destroyAndRecreate();
		}

		this.gameState.end();
		this.gameState = gameState;
		this.gameState.start();
	}
}