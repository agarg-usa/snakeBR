import { textureSize } from "./Grid";

export function arraysEqual(a: Array<any>, b: Array<any>): boolean {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

// given an x,y cord get the grid number
export function getGridFromCord(x: number, y: number) {
	return {x: Math.round(x / textureSize), y: Math.round(y / textureSize)};
}

// given a grid x,y pos get the x,y cord
export function getPosOfGrid(x:number, y:number) {
	return { x: textureSize * x, y: textureSize * y};
}
