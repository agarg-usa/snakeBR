import * as PIXI from "pixi.js";
import {arraysEqual} from "../../grid/GridUtil"
import { textures } from "../Textures";

interface CornerDirection {
	str: string;
	dirIn: Array<number[]>;
	dirOut: Array<number[]>;
}

type CornerDirections = {
	[key: string]: CornerDirection;
};

const cornerDirections: CornerDirections = {
	topLeft: {
		str: "tleft",
		dirIn: [
			[0, -1],
			[-1, 0],
		],
		dirOut: [
			[1, 0],
			[0, 1],
		],
	},
	topRight: {
		str: "tright",
		dirIn: [
			[1, 0],
			[0, -1],
		],
		dirOut: [
			[0, 1],
			[-1, 0],
		],
	},
	bottomLeft: {
		str: "bleft",
		dirIn: [
			[0, 1],
			[-1, 0],
		],
		dirOut: [
			[1, 0],
			[0, -1],
		],
	},
	bottomRight: {
		str: "bright",
		dirIn: [
			[1, 0],
			[0, 1],
		],
		dirOut: [
			[0, -1],
			[-1, 0],
		],
	},
};

export function getCornerTexture(currDx: number, currDy: number, nextDx: number, nextDy: number) : PIXI.Texture {
	const dirIn = [currDx, currDy];
	const dirOut = [nextDx, nextDy];

	for (const key in cornerDirections) {
		if (
			(arraysEqual(cornerDirections[key].dirIn[0], dirIn) &&
				arraysEqual(cornerDirections[key].dirOut[0], dirOut)) ||
			(arraysEqual(cornerDirections[key].dirIn[1], dirIn) &&
				arraysEqual(cornerDirections[key].dirOut[1], dirOut))
		) {
			let textureStr = "corner_" + cornerDirections[key].str;
			return textures[textureStr];
		}
	}

	throw new Error(`Corner Piece: Direction (${dirIn[0]}, ${dirIn[1]}) to (${dirOut[0]}, ${dirOut[1]}) not found`);
}