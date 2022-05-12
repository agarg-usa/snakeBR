import * as PIXI from 'pixi.js';
import { TilingSprite } from 'pixi.js';
import { textures } from './Textures';

// https://medium.com/anvoevodin/endless-background-with-tiling-sprite-in-pixijs-v5-79d95a08fe7

//TODO the background itself is way too big
// need to chunk up the background into bits and then fetch each tile
	// start searching more about tiles and stuff
// this will be paired with a camera system

export default class Background extends TilingSprite {
	constructor()
	{
		super(textures.background, 1, textures.background.height);
	}

	onResize(width, height) {
        this.width = width
		this.height = height
    }

	onUpdate(delta)
	{
		// this.tilePosition.x -= delta;
	}
}