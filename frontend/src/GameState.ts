import * as PIXI from "pixi.js";
import Background from "./gameObjects/Background";
import { Snake } from "./gameObjects/snake";
import { World } from "./World";

export class GameState
{
	world: World;
	constructor(world: World)
	{
		this.world = world;
	}

	start() {}
	end() {}
}

export class SinglePlayerGameState extends GameState
{
	snake: Snake;
	moveFunction : any;
	bg : Background;
	start()
	{
		this.bg = new Background();
		let brightnessFilter = new PIXI.filters.ColorMatrixFilter();
		brightnessFilter.brightness(0.75, false);
		this.bg.filters = [brightnessFilter];
		this.world.app.stage.addChild(this.bg);

		this.bg.onResize(this.world.app.screen.width, this.world.app.screen.height);
		window.addEventListener("resize", this.onResize.bind(this));

		this.snake = new Snake(this.world);
		this.moveFunction = this.snake.move.bind(this.snake);
		this.world.app.ticker.add(this.moveFunction);
	}

	onResize()
	{
		this.bg.onResize(window.innerWidth, window.innerHeight);
	}

	end()
	{
		this.world.app.ticker.remove(this.moveFunction);
	}
}

export class EndGameState extends GameState
{
	score : number;

	constructor(world: World, score :number)
	{
		super(world);
		this.score = score;
	}

	start()
	{
		let prevStage = this.world.app.stage;
		let brightnessFilter = new PIXI.filters.ColorMatrixFilter();
		brightnessFilter.brightness(0.3, false);
		prevStage.filters = [brightnessFilter];
		this.world.app.stage = new PIXI.Container();
		this.world.app.stage.addChild(prevStage);

		let endGameText = new PIXI.Text("Game Over\nYou had a score of " + this.score + ".",
			{fontSize : 50, fill : 0xFFFFFF, align : "center"});
		endGameText.anchor.set(0.5, 0.5);
		endGameText.x = this.world.app.screen.width / 2;
		endGameText.y = this.world.app.screen.height / 2;

		this.world.app.stage.addChild(endGameText);
	}
}