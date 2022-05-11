import * as PIXI from "pixi.js";
import {snakeBodyTypes} from "../Textures";
import { SnakeBody, SnakeTail } from "./SnakeBody";
import { World } from "../../World";
import { Apple, generateApple } from "../Apple";

const deltaToMove = 500; // move a grid every 200 ms

export class Snake {
	world: World;
	nextDx: number = 1;
	nextDy: number = 0;
	body: Array<SnakeBody>;
	head: SnakeBody;
	lastTileOfHead: Array<number>;

	timeOfLastMovement: number = 0;

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

		// setInterval(() => {this.add()}, 2000);

		this.world.app.ticker.add(this.move.bind(this));
		this.setUpController();
		generateApple(this.world);
	}

	private setUpController()
	{
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

	move() {
		if(Date.now() - this.timeOfLastMovement > deltaToMove)
		{
			this.timeOfLastMovement = Date.now();

			let lastDx = this.nextDx;
			let lastDy = this.nextDy; //todo add buffering system to moving

			for(let i = 0; i < this.body.length - 1; i++)
			{
				let bodyPart = this.body[i];
				let temp = [bodyPart.dx, bodyPart.dy];
				if(i == 0) // this is the head of the snake
				{
					let head = bodyPart; // for readability
					head.setDir(lastDx, lastDy);

					let nextTileObj = this.world.grid.getObjAtPosition(head.gridX + head.dx, head.gridY + head.dy);
					if(nextTileObj instanceof Apple)
					{
						this.add();
						generateApple(this.world);
						nextTileObj.delete();
					}
				}
				else
				{
					bodyPart.setDir(lastDx, lastDy, this.body[i - 1].dx, this.body[i - 1].dy);
				}

				bodyPart.move();
				lastDx = temp[0];
				lastDy = temp[1];
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



