import * as PIXI from "pixi.js";
import {textures, snakeBodyTypes} from "../Textures";
import { getCornerTexture } from "./CornerPiece";
import { GridObject } from "../../grid/GridObject";
import { World } from "../../World";

export class SnakeBody extends GridObject {
	dx: number;
	dy: number;
	nextDx : number;
	nextDy : number;
	type: string;

	constructor(
		world: World,
		gridX: number,
		gridY: number,
		dx: number,
		dy: number,
		type: string
	) {
		super(world, gridX, gridY);

		this.type = type;
		this.dx = dx;
		this.dy = dy;
		this.nextDx = dx;
		this.nextDy = dy;


		this.sprite.texture = this.getTexture();
		
	}

	setDir(dx: number, dy: number, nextDx: number = null, nextDy: number = null) {
		this.dx = dx;
		this.dy = dy;

		if(nextDx == null || nextDy == null) {
			nextDx = dx;
			nextDy = dy;
		}

		this.nextDx = nextDx;
		this.nextDy = nextDy;

		this.sprite.texture = this.getTexture();
	}



	getTexture(): PIXI.Texture {
		if (this.type == snakeBodyTypes.body) {
			// this texture should be a corner block
			if(this.dx != this.nextDx || this.dy != this.nextDy) {
				return getCornerTexture(this.dx, this.dy, this.nextDx, this.nextDy);
			}
			else if (this.dy) {
				return textures.body_vert;
			} else {
				return textures.body_horiz;
			}
		}

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

		return textures[this.type]; // for head / tail
	}

	move() {
		this.setPos(this.gridX + this.dx, this.gridY + this.dy);
	}
}

export class SnakeTail extends SnakeBody {
	prevDisplacement: number[] = [0, 0];

	setPos(gridX: number, gridY: number): void {
		if (this.dx == 1 && this.dy == 0) {
			this.prevDisplacement = [0, 0];
		} else if (this.dx == -1 && this.dy == 0) {
			this.prevDisplacement = [-1, -1];
		} else if (this.dx == 0 && this.dy == 1) {
			this.prevDisplacement = [-1, 1];
		} else if (this.dx == 0 && this.dy == -1) {
			this.prevDisplacement = [0, -1];
		}
		super.setPos(gridX, gridY);
		this.sprite.x += this.prevDisplacement[0];
		this.sprite.y += this.prevDisplacement[1];
	}
}