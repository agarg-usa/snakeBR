import Background from "./gameObjects/Background";
import { WallManager } from "./gameObjects/Wall";
import { getGridFromCord, getPosOfGrid } from "./grid/GridUtil";
import { World } from "./World";

export class Camera {
	world: World;
	/**
	 * The top right point of the camera's x position
	 */
	gridX: number;
	/**
	 * the top right point of the camera's y position
	 */
	gridY: number;
	wallManager: WallManager;

	constructor(world: World, gridX: number = 0, gridY: number = 0) {
		this.world = world;
		this.gridX = gridX;
		this.gridY = gridY;
		this.wallManager = new WallManager(world);
	}

	moveCamera(dx: number, dy: number) {
		this.gridX += dx;
		this.gridY += dy;
		this.updateAllSprites();
		this.updateWalls();

		if ((this.world.gameState as any).background) {
			let background = (this.world.gameState as any).background as Background;
			background.move(dx, dy);
		}
	}

	setCameraPosition(x: number, y: number) {
		let dx = x - this.gridX;
		let dy = y - this.gridY;
		this.moveCamera(dx, dy);
	}

	updateAllSprites() {
		this.world.grid.objects.forEach((obj) => obj.updateSprite());
	}

	updateWalls() {
		this.wallManager.removeAllWalls();
		let screenSize = this.getScreenGrid();

		for (let i = this.gridX - 1; i < this.gridX + screenSize.gridX + 1 ; i++) {
			for (let j = this.gridY - 1; j < this.gridY + screenSize.gridY + 1; j++) {
				if (this.world.grid.isOutOfBounds(i, j)) {
					let gridX = i - this.gridX;
					let gridY = j - this.gridY;
					this.wallManager.addWall(gridX, gridY);
				}
			}
		}
	}

	/*
		returns the grid number of the bottom right of the screen
		this does not take into account the camera position
	*/
	getScreenGrid() {
		return getGridFromCord(window.innerWidth, window.innerHeight);
	}

	/**
	 * centers the camera around the given grid position
	 */
	centerCamera(gridX: number, gridY: number) {
		let screenGrid = this.getScreenGrid();
		let cameraNewX = Math.floor(gridX - screenGrid.gridX / 2);
		let cameraNewY = Math.floor(gridY - screenGrid.gridY / 2);

		this.setCameraPosition(cameraNewX, cameraNewY);
	}

	/**
	 * Given a gridX and gridY on the screen, calculates the corresponding
	 * gridX,gridY position for the grid object taking to account the camera position
	 */
	calcGridNum(gridX: number, gridY: number) {
		let newX = gridX - this.gridX;
		let newY = gridY - this.gridY;

		let maxGridSize = this.getScreenGrid();

		if (
			newX < 0 ||
			newY < 0 ||
			newX > maxGridSize.gridX ||
			newY > maxGridSize.gridY
		) {
			// note: if this returns null that means the current gridX, gridY is off screen
			// if this is the game, the .visible flag on the sprite should be set to false
			// there is no auto culling in pixijs, so we have to do it manually
			return null;
		}

		return { gridX: gridX - this.gridX, gridY: gridY - this.gridY };
	}

	calcPos(gridX: number, gridY: number) {
		let gridNum = this.calcGridNum(gridX, gridY);

		if (gridNum == null) {
			return null;
		}

		return getPosOfGrid(gridNum.gridX, gridNum.gridY);
	}
}
