import { ExistingCandlesLayer } from "./canvas/layers/ExistingCandlesLayer";

import candles from "./demo/mock/candles.json";

const canvas = document.querySelector<HTMLCanvasElement>("#chart");

if (!canvas) {
	throw new Error("Canvas not found");
}

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

const layer = new ExistingCandlesLayer({
	canvas,

	candles,

	baseCandleWidth: 8,

	baseCandleGap: 4,
});

layer.render();

/**
 * =========================
 * Zoom Handling
 * =========================
 */
canvas.addEventListener(
	"wheel",
	(event) => {
		event.preventDefault();

		const zoomDelta = event.deltaY < 0 ? 1 : -1;

		if (event.ctrlKey || event.metaKey) {
			/**
			 * Ctrl/Cmd + Wheel
			 * Vertical zoom
			 */
			layer.zoomVertically(zoomDelta);
			layer.render();
			return;
		}

		/**
		 * Default wheel
		 * Horizontal zoom
		 */
		layer.zoomHorizontally(zoomDelta);
		layer.render();
	},
	{
		passive: false,
	},
);

/**
 * =========================
 * Panning
 * =========================
 */
let isDragging = false;

let lastMouseX = 0;

let lastMouseY = 0;

canvas.addEventListener("mousedown", (event) => {
	isDragging = true;

	lastMouseX = event.clientX;

	lastMouseY = event.clientY;
});

window.addEventListener("mouseup", () => {
	isDragging = false;
});

window.addEventListener("mousemove", (event) => {
	if (!isDragging) {
		return;
	}

	const deltaX = event.clientX - lastMouseX;

	const deltaY = event.clientY - lastMouseY;

	lastMouseX = event.clientX;

	lastMouseY = event.clientY;

	layer.panHorizontally(deltaX);

	layer.panVertically(deltaY);

	layer.render();
});

/**
 * =========================
 * Resize Handling
 * =========================
 */
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;

	canvas.height = window.innerHeight;

	layer.render();
});
