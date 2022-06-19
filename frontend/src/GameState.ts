import * as PIXI from "pixi.js";
import Background from "./gameObjects/Background";
import { Snake } from "./gameObjects/snake/Snake";
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

export class MenuGameState extends GameState
{
	start()
	{
		let menuSystemHTML =
		`
		<div class="center" style="background: url(/assets/forestbackground_small.jpg); background-size: 100vw;">
		<div class="menuMainElem">
			<img src="/assets/snake_mainscreen.jpg" class="main-snake-img">
			<div class="horizontal-flexbox">
				<button id="single-player-button" class="main-button">Single Player</button>
				<button id="multiplayer-button" class="main-button">Multiplayer</button>
			</div>
		</div>
	</div>
		`;

		let menuElem = document.createElement("span");
		menuElem.innerHTML = menuSystemHTML;
		let overlay = document.getElementById("overlay");
		overlay.appendChild(menuElem);

		let singlePlayerButton = document.getElementById("single-player-button");
		let multiPlayerButton = document.getElementById("multiplayer-button");

		singlePlayerButton.addEventListener("click", () => {
			menuElem.remove();
			this.world.changeGameState(new SinglePlayerGameState(this.world));
		});

	}

	end()
	{

	}
}

export class SinglePlayerGameState extends GameState
{
	snake: Snake;
	moveFunction : any;
	background : Background;
	resizeCallback
	start()
	{
		this.background = new Background();
		let brightnessFilter = new PIXI.filters.ColorMatrixFilter();
		brightnessFilter.brightness(0.75, false);
		// this.background.filters = [brightnessFilter];
		this.world.app.stage.addChild(this.background);

		// this.background.onResize(this.world.app.screen.width, this.world.app.screen.height);
		this.resizeCallback = this.onResize.bind(this);
		window.addEventListener("resize", this.resizeCallback);

		this.snake = new Snake(this.world);
		this.moveFunction = this.snake.move.bind(this.snake);
		this.world.app.ticker.add(this.moveFunction);
	}

	onResize()
	{
		this.background.onResize(window.innerWidth, window.innerHeight);
	}

	end()
	{
		this.world.app.ticker.remove(this.moveFunction);
		window.removeEventListener("resize", this.resizeCallback);
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
		prevStage.filterArea = new PIXI.Rectangle(0,0,window.innerWidth, window.innerHeight);
		this.world.app.stage = new PIXI.Container();
		this.world.app.stage.addChild(prevStage);

		this.world.app.ticker.stop();

		let endGameText = new PIXI.Text("Game Over\nYou had a score of " + this.score + ".",
			{fontSize : 50, fill : 0xFFFFFF, align : "center"});
		endGameText.anchor.set(0.5, 0.5);
		endGameText.x = this.world.app.screen.width / 2;
		endGameText.y = this.world.app.screen.height / 2;

		this.world.app.stage.addChild(endGameText);
	}
}