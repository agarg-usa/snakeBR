import * as PIXI from "pixi.js";

const magOfDelta = 2;
const textures = {
	head_up: PIXI.Texture.from("/assets/head_up.png"),
	head_down: PIXI.Texture.from("/assets/head_down.png"),
	head_left: PIXI.Texture.from("/assets/head_left.png"),
	head_right: PIXI.Texture.from("/assets/head_right.png"),
	tail_up: PIXI.Texture.from("/assets/tail_up.png"),
	tail_down: PIXI.Texture.from("/assets/tail_down.png"),
	tail_left: PIXI.Texture.from("/assets/tail_left.png"),
	tail_right: PIXI.Texture.from("/assets/tail_right.png"),
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
		let tail = new SnakeBody(
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

		app.ticker.add((delta) => {
			let gridNumOfHead = getGridNum(head.sprite.x, head.sprite.y);
			let gridPosOfHead = getGridPos(gridNumOfHead);
			if (
				this.lastTileOfHead[0] == gridNumOfHead[0] &&
				this.lastTileOfHead[1] == gridNumOfHead[1]
				// Math.abs(gridPosOfHead[0] - head.sprite.x) > textureSize/10 &&
				// Math.abs(gridPosOfHead[1] - head.sprite.y) > textureSize/10
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
					bodyPart.setDir(lastDx, lastDy);
					let xy = getGridPos(getGridNum(bodyPart.sprite.x, bodyPart.sprite.y));
					bodyPart.sprite.x = xy[0];
					bodyPart.sprite.y = xy[1];

					lastDx = temp[0];
					lastDy = temp[1];
				}
				this.initLastTileOfHead();
			}
		});

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

	initLastTileOfHead() {
		this.lastTileOfHead = getGridNum(this.head.sprite.x, this.head.sprite.y);
	}

	add() {
		let lastElem = this.body[this.body.length - 1];
		let x = lastElem.sprite.x + -1 * lastElem.dx * textureSize + 1;
		let y = lastElem.sprite.y + -1 * lastElem.dy * textureSize;
		let newElem = new SnakeBody(
			this.app,
			x,
			y,
			lastElem.dx,
			lastElem.dy,
			snakeBodyTypes.tail
		);
		this.body.push(newElem);
		lastElem.setType(snakeBodyTypes.body);
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

		return textures[this.type + "_right"];

		// if (this.type == snakeBodyTypes.head) {
		// 	if(this.dx == 0 && this.dy == -1) {
		// 		this.sprite.anchor.set(0,1);
		// 	}
		// }
		// if (this.dx == 1 && this.dy == 0) {
		// 	return textures[this.type + "_right"];
		// }
		// if (this.dx == -1 && this.dy == 0) {
		// 	return textures[this.type + "_left"];
		// }
		// if (this.dx == 0 && this.dy == 1) {
		// 	return textures[this.type + "_down"];
		// }
		// if (this.dx == 0 && this.dy == -1) {
		// 	return textures[this.type + "_up"];
		// }
		return null;
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
		console.log("moving " +this.dx * delta * magOfDelta + " " + this.dy * delta * magOfDelta);
	}
}
