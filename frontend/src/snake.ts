import * as PIXI from "pixi.js";

const magOfDelta = 2;
const textures = {
	head: PIXI.Texture.from("/assets/head.png"),
	tail: PIXI.Texture.from("/assets/tail.png"),
	body_vert: PIXI.Texture.from("/assets/body_vert.png"),
	body_horiz: PIXI.Texture.from("/assets/body_horiz.png"),
	corner_tleft: PIXI.Texture.from("/assets/corner_tleft.png"),
	corner_tright: PIXI.Texture.from("/assets/corner_tright.png"),
	corner_bleft: PIXI.Texture.from("/assets/corner_bleft.png"),
	corner_bright: PIXI.Texture.from("/assets/corner_bright.png"),
	apple: PIXI.Texture.from("/assets/apple.png"),
};
const textureSize = 64;

const snakeBodyTypes = {
	head: "head",
	tail: "tail",
	body: "body",
};

function getGridNum(x: number, y: number) {
	return [Math.round(x / textureSize), Math.round(y / textureSize)];
}

function getGridPos(gridNum: number[]) {
	return [textureSize * gridNum[0], textureSize * gridNum[1]];
}

export class Snake {
	app: PIXI.Application;
	nextDx: number = 1;
	nextDy: number = 0;
	body: Array<SnakeBody>;
	head: SnakeBody;
	lastTileOfHead: Array<number>;

	constructor(app: PIXI.Application) {
		this.app = app;
		this.body = [];
		let initX = app.screen.width / 4;
		let initY = app.screen.height / 4;
		let head = new SnakeBody(
			app,
			initX,
			initY,
			this.nextDx,
			this.nextDy,
			snakeBodyTypes.head
		);
		this.head = head;
		let tail = new SnakeTail(
			app,
			initX - textureSize,
			initY,
			this.nextDx,
			this.nextDy,
			snakeBodyTypes.tail
		);
		this.body.push(head);
		this.body.push(tail);
		this.add();
		this.add();
		this.initLastTileOfHead();

		app.ticker.add(this.move.bind(this));

		document.addEventListener("keydown", (e) => {
			switch (e.keyCode) {
				case 37: // left arrow
					this.nextDx = -1;
					this.nextDy = 0;
					break;
				case 38: // up arrow
					this.nextDx = 0;
					this.nextDy = -1;
					break;
				case 39: // right arrow
					this.nextDx = 1;
					this.nextDy = 0;
					break;
				case 40: // down arrow
					this.nextDx = 0;
					this.nextDy = 1;
					break;
			}
		});
	}

	private getGridNumWithDirCompensation(
		x: number,
		y: number,
		dx: number,
		dy: number
	) {
		if (dx == 1 || dy == 1) {
			// we are moving right, so gridNum snaps back to left most
			//we are moving down so girdNum snaps to top most
			return [Math.floor(x / textureSize), Math.floor(y / textureSize)];
		} else {
			//we are moving left so gridNum snaps to right most
			//we are moving up so gridNum snaps to bottom most
			return [Math.ceil(x / textureSize), Math.ceil(y / textureSize)];
		}
	}

	move(delta) {
		let gridNumOfHead = this.getGridNumWithDirCompensation(
			this.head.sprite.x,
			this.head.sprite.y,
			this.head.dx,
			this.head.dy
		);

		if (
			this.lastTileOfHead[0] == gridNumOfHead[0] &&
			this.lastTileOfHead[1] == gridNumOfHead[1]
		) {
			//we didn't move a whole tile yet
			for (let bodyPart of this.body) {
				bodyPart.move(delta);
			}
		} //we moved a tile, change dir for everything
		else {
			let lastDx = this.nextDx;
			let lastDy = this.nextDy;
			for (let bodyPart of this.body) {
				let temp = [bodyPart.dx, bodyPart.dy];
				let xy = getGridPos(getGridNum(bodyPart.sprite.x, bodyPart.sprite.y));
				bodyPart.sprite.x = xy[0];
				bodyPart.sprite.y = xy[1];
				bodyPart.setDir(lastDx, lastDy);

				lastDx = temp[0];
				lastDy = temp[1];
			}
			this.initLastTileOfHead();
		}
	}

	initLastTileOfHead() {
		this.lastTileOfHead = getGridNum(this.head.sprite.x, this.head.sprite.y);
	}

	add() {
		let tail = this.body[this.body.length - 1];
		let bodyElem = new SnakeBody(
			this.app,
			tail.sprite.x,
			tail.sprite.y,
			tail.dx,
			tail.dy,
			snakeBodyTypes.body
		);
		tail.sprite.x = tail.sprite.x + -1 * tail.dx * textureSize + 1;
		tail.sprite.y = tail.sprite.y + -1 * tail.dy * textureSize;
		this.body.splice(this.body.length - 1, 0, bodyElem); //appends bodyElem to second to last element
	}
}

class SnakeBody {
	app: PIXI.Application;
	sprite: PIXI.Sprite;
	dx: number;
	dy: number;
	type: string;
	constructor(
		app: PIXI.Application,
		x: number,
		y: number,
		dx: number = 1,
		dy: number = 0,
		type: string = snakeBodyTypes.head
	) {
		this.app = app;
		this.type = type;
		this.dx = dx;
		this.dy = dy;

		this.sprite = new PIXI.Sprite();
		this.sprite.texture = this.getTexture();
		this.sprite.x = x;
		this.sprite.y = y;
		this.sprite.anchor.set(0.5);
		app.stage.addChild(this.sprite);
	}

	/**
	 * sets the direction of the body part, as well as the texture
	 * this function might modify the position of the body part as well
	 *
	 * @param dx direction of movement x
	 * @param dy direction of movement y
	 */
	setDir(dx: number, dy: number) {
		this.dx = dx;
		this.dy = dy;
		this.sprite.texture = this.getTexture();
	}

	setType(type: string) {
		this.type = type;
		this.sprite.texture = this.getTexture();
	}

	getTexture(): PIXI.Texture {
		if (this.type == snakeBodyTypes.body) {
			if (this.dy) {
				return textures.body_vert;
			} else {
				return textures.body_horiz;
			}
		}

		this.sprite.pivot.set(0.5);

		if (this.dx == 1 && this.dy == 0) {
			this.sprite.angle = 0;
		}
		if (this.dx == -1 && this.dy == 0) {
			this.sprite.angle = 180;
		}
		if (this.dx == 0 && this.dy == 1) {
			this.sprite.angle = 90;
		}
		if (this.dx == 0 && this.dy == -1) {
			this.sprite.angle = 270;
		}

		return textures[this.type];
	}

	getNextPos(delta) {
		return [
			this.sprite.x + this.dx * delta * magOfDelta,
			this.sprite.y + this.dy * delta * magOfDelta,
		];
	}

	move(delta: number) {
		this.sprite.x += this.dx * delta * magOfDelta;
		this.sprite.y += this.dy * delta * magOfDelta;
	}
}

class SnakeTail extends SnakeBody {
	prevDisplacement: number[] = [0, 0];
	/**
	 * this is a modified version of the snake body class
	 * the setDir is modified just for the tail because for some reason the tail is displaced form the body
	 * by a little bit based on its direction
	 * this is a hacky solution, but it works
	 */
	setDir(dx: number, dy: number): void {
		if (dx == 1 && dy == 0) {
			this.prevDisplacement = [1, 0.5];
		} else if (dx == -1 && dy == 0) {
			this.prevDisplacement = [-1, -0.5];
		} else if (dx == 0 && dy == 1) {
			this.prevDisplacement = [-0.5, 1];
		} else if (dx == 0 && dy == -1) {
			this.prevDisplacement = [0.5, -1];
		}

		this.sprite.x += this.prevDisplacement[0];
		this.sprite.y += this.prevDisplacement[1];
		super.setDir(dx, dy);
	}
}
