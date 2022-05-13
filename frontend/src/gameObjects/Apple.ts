import * as PIXI from "pixi.js";
import { GridObject } from "../grid/GridObject";
import { World } from "../World";
import { textures } from "./Textures";

export function generateApple(world: World): Apple {
	// let gridX = Math.floor(Math.random() * world.grid.width);
	// let gridY = Math.floor(Math.random() * world.grid.height);

	//TODO once camera system is added undo this hard coding

	let gridX = Math.floor(5 * Math.random() + 5);
	let gridY = Math.floor(5 * Math.random() + 5);

	while(world.grid.getObjAtPosition(gridX, gridY))
	{
		// gridX = Math.floor(Math.random() * world.grid.width);
		// gridY = Math.floor(Math.random() * world.grid.height);
		gridX = Math.floor(10 * Math.random() + 5);
		gridY = Math.floor(5 * Math.random() + 5);
	}

 	return new Apple(world, gridX, gridY);
}

export class Apple extends GridObject {
	constructor(world: World, gridX: number, gridY: number) {
		super(world, gridX, gridY);
		this.sprite.texture = textures.apple;
	}
}