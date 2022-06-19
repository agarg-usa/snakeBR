import * as PIXI from "pixi.js";
import { TEXTURE_SIZE } from "../grid/Grid";
import { getPosOfGrid } from "../grid/GridUtil";
import { World } from "../World";

export function createWall(x : number, y: number)
{
	var wall = new PIXI.Sprite(PIXI.Texture.WHITE);
	wall.width = TEXTURE_SIZE;
	wall.height = TEXTURE_SIZE;
	wall.alpha = 0.7;
	wall.anchor.set(0.5);
	wall.pivot.set(0.5);
	wall.tint = 0xd9263a;
	wall.x = x;
	wall.y = y;
	return wall;
}

// theres a lot of optimization that can be done here

export class WallManager
{
	world: World;
	walls: PIXI.Sprite[] = [];

	constructor(world: World)
	{
		this.world = world;
	}

	// NOTE the gridX and gridY does not include the camera position
	addWall(gridX: number, gridY: number)
	{
		let pos = getPosOfGrid(gridX, gridY);
		let wall = createWall(pos.x, pos.y);
		this.walls.push(wall);
		this.world.app.stage.addChild(wall);
	}

	removeAllWalls()
	{
		for(let wall of this.walls)
		{
			this.world.app.stage.removeChild(wall);
		}
		this.walls = [];
	}
}