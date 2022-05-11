import * as PIXI from "pixi.js";
import { World } from "../World";
import { getPosOfGrid } from "./GridUtil";

export class GridObject
{
	world: World;
	sprite: PIXI.Sprite;
	gridX: number;
	gridY: number;

	constructor(
		world: World,
		gridX: number,
		gridY: number
	) {
		this.world = world;
		this.sprite = new PIXI.Sprite();
		this.sprite.pivot.set(0.5);
		this.sprite.anchor.set(0.5);

		this.gridX = gridX;
		this.gridY = gridY;
		this.sprite.x = getPosOfGrid(gridX, gridY).x;
		this.sprite.y = getPosOfGrid(gridX, gridY).y;
		this.world.grid.addObject(this);

		world.app.stage.addChild(this.sprite);
	}

	setPos(gridX:number, gridY: number)
	{
		let oldX = this.gridX;
		let oldY = this.gridY;

		this.gridX = gridX;
		this.gridY = gridY;

		this.world.grid.updateObject(this, oldX, oldY);

		this.sprite.x = getPosOfGrid(gridX, gridY).x;
		this.sprite.y = getPosOfGrid(gridX, gridY).y;
	}

	delete()
	{
		this.world.grid.removeObject(this);
		this.world.app.stage.removeChild(this.sprite);
	}
}