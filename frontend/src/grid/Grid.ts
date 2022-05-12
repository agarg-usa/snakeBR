import { GridObject } from "./GridObject";

export const textureSize = 64;

export class Grid
{
	grid : Array<Array<GridObject>>;
	width: number;
	height: number;
	constructor(width: number, height: number)
	{
		this.width = width;
		this.height = height;
		this.grid = new Array(width);
		for(let i = 0; i < width; i++)
		{
			this.grid[i] = new Array(height);
		}
	}

	addObject(gridObject: GridObject)
	{
		this.setPosition(gridObject.gridX, gridObject.gridY, gridObject);
	}

	updateObject(gridObject: GridObject, oldX: number, oldY: number)
	{
		// this.setPosition(oldX, oldY, null);
		this.setPosition(gridObject.gridX, gridObject.gridY, gridObject);
	}

	removeObject(gridObject: GridObject)
	{
		this.setPosition(gridObject.gridX, gridObject.gridY, null);
	}

	setPosition(x : number, y : number, gridObject? : GridObject)
	{
		if(x < 0 || x >= this.width || y < 0 || y >= this.height)
		{
			throw new Error("Grid out of bounds");
		}

		// if(this.grid[x][y] && gridObject)
		// {
		// 	console.warn(`Overriding object in grid position (${x},${y})`);
		// }

		this.grid[x][y] = gridObject;
	}

	getObjAtPosition(x : number, y : number) : GridObject
	{
		return this.grid[x][y];
	}

}