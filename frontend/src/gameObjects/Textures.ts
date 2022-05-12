//todo probably need to make this a better system
import * as PIXI from "pixi.js";

export const textures = {
	head: PIXI.Texture.from("/assets/head.png"),
	tail: PIXI.Texture.from("/assets/tail.png"),
	body_vert: PIXI.Texture.from("/assets/body_vert.png"),
	body_horiz: PIXI.Texture.from("/assets/body_horiz.png"),
	corner_tleft: PIXI.Texture.from("/assets/corner_tleft.png"),
	corner_tright: PIXI.Texture.from("/assets/corner_tright.png"),
	corner_bleft: PIXI.Texture.from("/assets/corner_bleft.png"),
	corner_bright: PIXI.Texture.from("/assets/corner_bright.png"),
	apple: PIXI.Texture.from("/assets/apple.png"),
	background : PIXI.Texture.from("/assets/forestbackground.jpg"),
};

export const snakeBodyTypes = {
	head: "head",
	tail: "tail",
	body: "body",
};