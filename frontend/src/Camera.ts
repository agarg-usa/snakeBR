import Background from "./gameObjects/Background";
import { getPosOfGrid } from "./grid/GridUtil";
import { World } from "./World";

export class Camera
{
	world : World;
	gridX: number;
	gridY: number;

	constructor(world: World, gridX: number = 0, gridY: number = 0)
	{
		this.world = world;
		this.gridX = gridX;
		this.gridY = gridY;
	}

	moveCamera(dx: number, dy: number)
	{
		this.gridX += dx;
		this.gridY += dy;
		this.updateAllSprites();

		if((this.world.gameState as any).background)
		{
			let background = ((this.world.gameState as any).background as Background);
			background.move(dx, dy);
		}
	}

	updateAllSprites()
	{
		this.world.grid.objects.forEach(obj => obj.updateSprite());
	}

	calcGridNum(gridX: number, gridY: number)
	{
		let newX = gridX - this.gridX;
		let newY = gridY - this.gridY;

		if(this.world.grid.isOutOfBounds(newX, newY))
		{
			return null;
			// note: if this returns null that means the current gridX, gridY is off screen
			// if this is the game, the .visible flag on the sprite should be set to false
				// there is no auto culling in pixijs, so we have to do it manually
		}

		return { x: gridX - this.gridX, y: gridY - this.gridY };
	}

	calcPos(gridX: number, gridY: number)
	{
		let newX = gridX - this.gridX;
		let newY = gridY - this.gridY;

		if(this.world.grid.isOutOfBounds(newX, newY))
		{
			return null;
		}

		return { x: getPosOfGrid(newX, newY).x, y: getPosOfGrid(newX, newY).y };
	}
}