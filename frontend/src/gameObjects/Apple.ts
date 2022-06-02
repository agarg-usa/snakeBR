import * as PIXI from "pixi.js";
import { GridObject } from "../grid/GridObject";
import { World } from "../World";
import { textures } from "./Textures";

export function generateApples(world: World, density:number = 350) // every density grids there should be ~ 1 apple
{
	let numOfApples = Math.ceil(world.grid.width * world.grid.height / density);

	for(let i = 0; i < numOfApples; i++)
	{
		generateApple(world);
	}
}

export function generateApple(world: World): Apple {
	let gridX = Math.floor(Math.random() * world.grid.width);
	let gridY = Math.floor(Math.random() * world.grid.height);


	while(world.grid.getObjAtPosition(gridX, gridY))
	{
		gridX = Math.floor(Math.random() * world.grid.width);
		gridY = Math.floor(Math.random() * world.grid.height);
	}

 	return new Apple(world, gridX, gridY);
}

export class Apple extends GridObject {
	constructor(world: World, gridX: number, gridY: number) {
		super(world, gridX, gridY);
		this.sprite.texture = textures.apple;
	}
}