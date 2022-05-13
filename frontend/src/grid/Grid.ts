import { GridObject } from "./GridObject";

export const TEXTURE_SIZE = 64;
export const DEFAULT_GRID_LENGTH = 100;

export class Grid
{
	grid : Array<Array<GridObject>>;
	objects: Array<GridObject> = [];
	width: number;
	height: number;
	constructor(width: number = DEFAULT_GRID_LENGTH, height: number = DEFAULT_GRID_LENGTH)
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
		this.objects.push(gridObject);
	}

	updateObject(gridObject: GridObject, oldX: number, oldY: number)
	{
		if(this.getObjAtPosition(oldX, oldY) == gridObject)
		{
			this.setPosition(oldX, oldY, null);
		}

		this.setPosition(gridObject.gridX, gridObject.gridY, gridObject);
	}

	removeObject(gridObject: GridObject)
	{
		this.setPosition(gridObject.gridX, gridObject.gridY, null);
		this.objects.splice(this.objects.indexOf(gridObject), 1);
	}

	setPosition(x : number, y : number, gridObject? : GridObject)
	{
		if(x < 0 || x >= this.width || y < 0 || y >= this.height)
		{
			throw new Error("Grid out of bounds");
		}

		this.grid[x][y] = gridObject;
	}

	isOutOfBounds(x: number, y: number)
	{
		return x < 0 || x >= this.width || y < 0 || y >= this.height;
	}

	getObjAtPosition(x : number, y : number) : GridObject
	{
		return this.grid[x][y];
	}

}