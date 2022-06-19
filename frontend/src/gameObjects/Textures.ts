import * as PIXI from "pixi.js";

const textureLinks =
{
	head: "/assets/snake/head.png",
	tail: "/assets/snake/tail.png",
	body_vert: "/assets/snake/body_vert.png",
	body_horiz: "/assets/snake/body_horiz.png",
	corner_tleft: "/assets/snake/corner_tleft.png",
	corner_tright: "/assets/snake/corner_tright.png",
	corner_bleft: "/assets/snake/corner_bleft.png",
	corner_bright: "/assets/snake/corner_bright.png",
	apple: "/assets/apple.png",
	background : "/assets/forestbackground.jpg",
	// background : "/assets/apple.png",

}

export let textures = {
	head : null,
	tail : null,
	body_vert : null,
	body_horiz : null,
	corner_tleft : null,
	corner_tright : null,
	corner_bleft : null,
	corner_bright : null,
	apple : null,
	background : null,
};

export function loadTextures(callback: Function)
{
	let loader = PIXI.Loader.shared;
	for(let key in textureLinks)
	{
		loader.add(key, textureLinks[key]);
	}
	loader.load(() => {
		for(let key in textureLinks)
		{
			textures[key] = loader.resources[key].texture;
		}
		callback();
	});
}

export const snakeBodyTypes = {
	head: "head",
	tail: "tail",
	body: "body",
};