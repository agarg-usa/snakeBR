import * as PIXI from 'pixi.js';
import { TilingSprite } from 'pixi.js';
import { TEXTURE_SIZE } from '../grid/Grid';
import { textures } from './Textures';

// https://medium.com/anvoevodin/endless-background-with-tiling-sprite-in-pixijs-v5-79d95a08fe7

export default class Background extends TilingSprite {
	constructor()
	{
		super(textures.background, window.innerWidth, window.innerHeight);
	}

	onResize(width, height) {
        this.width = width
		this.height = height
    }

	move(dx, dy)
	{
		//creates a parallax scrolling-like effect
		this.tilePosition.x -= dx * TEXTURE_SIZE/4;
		this.tilePosition.y -= dy * TEXTURE_SIZE/4;
	}
}