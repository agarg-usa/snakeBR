import * as PIXI from "pixi.js";
import { snakeBodyTypes } from "../Textures";
import { SnakeBody, SnakeTail } from "./SnakeBody";
import { World } from "../../World";
import { Apple, generateApple, generateApples } from "../Apple";
import { EndGameState } from "../../GameState";

const deltaToMove = 50; // ms time to update snake
const percentOfScreenToMoveCamera = 0.33; // ex. if the snake is in the top 1/3 of the screen, the camera will move up

export class Snake {
	world: World;

	nextDx: number = 1;
	nextDy: number = 0;
	bufferedDx: number = 1;
	bufferedDy: number = 0;

	body: Array<SnakeBody>;
	head: SnakeBody;
	lastTileOfHead: Array<number>;

	timeOfLastMovement: number = 0;
	score: number = 0;

	constructor(world: World) {
		this.world = world;
		this.body = [];

		// let initX = Math.floor(world.grid.width/4);
		// let initY = Math.floor(world.grid.height/4);

		let initX = 5;
		let initY = 5;

		let head = new SnakeBody(
			world,
			initX,
			initY,
			this.nextDx,
			this.nextDy,
			snakeBodyTypes.head
		);

		this.head = head;
		let tail = new SnakeTail(
			world,
			initX - 1,
			initY,
			this.nextDx,
			this.nextDy,
			snakeBodyTypes.tail
		);

		this.body.push(head);
		this.body.push(tail);
		this.add();
		this.add();
		this.add();
		this.setUpController();
		generateApples(this.world);
		this.world.camera.centerCamera(this.head.gridX, this.head.gridY);
	}

	private setUpController() {
		document.addEventListener("keydown", (e) => {
			switch (e.keyCode) {
				case 37: // left arrow
					this.setDirection(-1, 0);
					break;
				case 38: // up arrow
					this.setDirection(0, -1);
					break;
				case 39: // right arrow
					this.setDirection(1, 0);
					break;
				case 40: // down arrow
					this.setDirection(0, 1);
					break;
			}
		});
	}

	getCurrDirection() {
		return { dx: this.head.dx, dy: this.head.dy };
	}

	isOppositeDir(dx1: number, dy1: number, dx2: number, dy2: number) {
		return dx1 * -1 == dx2 || dy1 * -1 == dy2;
	}

	setDirection(dx: number, dy: number) {
		if (this.nextDx == null && this.nextDy == null) {
			if (this.bufferedDx == null && this.bufferedDy == null) {
				// no buffered direction exists nor next direction exists
				this.nextDx = dx;
				this.nextDy = dy;
			} else {
				// buffered direction exists, so move up the buffered dir to next dir
				// and set this new dir to the buffered dir
				this.nextDx = this.bufferedDx;
				this.nextDy = this.bufferedDy;
				this.bufferedDx = dx;
				this.bufferedDy = dy;
			}
		} else {
			// next direction exists, set buffer
			this.bufferedDx = dx;
			this.bufferedDy = dy;
		}
	}

	getNextDirection() {
		let currDir = this.getCurrDirection();
		if (this.nextDx == null && this.nextDy == null) {
			if (this.bufferedDx == null && this.bufferedDy == null) {
				return currDir;
				// no buffered direction exists nor next direction exists, so return curr direction
			} else {
				// buffered direction exists, so return buffered dir
				let dx = this.bufferedDx;
				let dy = this.bufferedDy;
				this.bufferedDx = null;
				this.bufferedDy = null;
				if (this.isOppositeDir(dx, dy, currDir.dx, currDir.dy)) {
					return this.getNextDirection();
				}
				return { dx, dy };
			}
		} else {
			// next direction exists, so return next dir
			let dx = this.nextDx;
			let dy = this.nextDy;
			this.nextDx = null;
			this.nextDy = null;
			if (this.isOppositeDir(dx, dy, currDir.dx, currDir.dy)) {
				return this.getNextDirection();
			}
			return { dx, dy };
		}
	}

	private createEndGameState() {
		this.world.changeGameState(new EndGameState(this.world, this.score));
	}

	private moveCamera()
	{
		let screenGrid = this.world.camera.getScreenGrid();
		let currHeadPosOnScreen = this.world.camera.calcGridNum(this.head.gridX, this.head.gridY);

		// if the head is in the left 25% of the screen, move the camera left
		if(currHeadPosOnScreen.gridX < screenGrid.gridX*percentOfScreenToMoveCamera )
		//TODO: BUG: if the screen is made smaller this will crash (gridX for some reason will come out as null?)
		// maybe because its moved from too big to too small or something like that
		{
			this.world.camera.moveCamera(-1, 0);
		}
		else if(currHeadPosOnScreen.gridX > screenGrid.gridX * (1-percentOfScreenToMoveCamera))
		{
			this.world.camera.moveCamera(1, 0);
		}
		else if(currHeadPosOnScreen.gridY < screenGrid.gridY*percentOfScreenToMoveCamera)
		{
			this.world.camera.moveCamera(0, -1);
		}
		else if(currHeadPosOnScreen.gridY > screenGrid.gridY* (1-percentOfScreenToMoveCamera))
		{
			this.world.camera.moveCamera(0, 1);
		}

	}

	private headMovement(nextDx, nextDy) {
		let head = this.head;
		head.setDir(nextDx, nextDy);

		let nextTile = { x: head.gridX + head.dx, y: head.gridY + head.dy };

		if (this.world.grid.isOutOfBounds(nextTile.x, nextTile.y)) {
			this.createEndGameState();
			head.gridX = nextTile.x;
			head.gridY = nextTile.y;
			head.updateSprite(); // move the sprite to a new position without moving the grid tile
			return;
		}

		let nextTileObj = this.world.grid.getObjAtPosition(nextTile.x, nextTile.y);
		if (nextTileObj instanceof Apple) {
			this.add();
			generateApple(this.world);
			nextTileObj.delete();
			this.score++;
		} else if (
			nextTileObj instanceof SnakeBody &&
			!(nextTileObj instanceof SnakeTail)
		) {
			this.createEndGameState();
		}

		this.head.move();
		// this.world.camera.moveCamera(this.head.dx, this.head.dy);
		this.moveCamera();
	}

	move() {
		if (Date.now() - this.timeOfLastMovement > deltaToMove) {
			this.timeOfLastMovement = Date.now();

			let dir = this.getNextDirection();
			let lastDx = dir.dx;
			let lastDy = dir.dy;

			for (let i = 0; i < this.body.length - 1; i++) {
				let bodyPart = this.body[i];
				let tempDir = [bodyPart.dx, bodyPart.dy];
				if (i == 0) {
					this.headMovement(lastDx, lastDy);
				} else {
					bodyPart.setDir(
						lastDx,
						lastDy,
						this.body[i - 1].dx,
						this.body[i - 1].dy
					);
					bodyPart.move();
				}


				lastDx = tempDir[0];
				lastDy = tempDir[1];
			}

			// we deal with the tail movement separately
			let tail = this.body[this.body.length - 1];
			let beforeTail = this.body[this.body.length - 2];

			tail.setDir(beforeTail.dx, beforeTail.dy);
			tail.setPos(beforeTail.gridX - tail.dx, beforeTail.gridY - tail.dy);
		}
	}

	add() {
		let tail = this.body[this.body.length - 1];
		let bodyElem = new SnakeBody(
			this.world,
			tail.gridX,
			tail.gridY,
			tail.dx,
			tail.dy,
			snakeBodyTypes.body
		);

		tail.setPos(tail.gridX - tail.dx, tail.gridY - tail.dy);
		this.body.splice(this.body.length - 1, 0, bodyElem); //appends bodyElem to second to last element
	}
}
