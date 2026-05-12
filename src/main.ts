import { ExistingCandlesLayer } from "./canvas/layers/ExistingCandlesLayer";

import { CrosshairLayer } from "./canvas/layers/CrosshairLayer";

import candles from "./demo/mock/candles.json";
import "./main.css";

const candleCanvas = document.querySelector<HTMLCanvasElement>("#chart");

const overlayCanvas = document.querySelector<HTMLCanvasElement>("#overlay");

if (!candleCanvas || !overlayCanvas) {
	throw new Error("Canvas not found");
}

/**
 * =========================
 * Resize Canvases
 * =========================
 */
const resizeCanvases = () => {
	const width = window.innerWidth;

	const height = window.innerHeight;

	candleCanvas.width = width;

	candleCanvas.height = height;

	overlayCanvas.width = width;

	overlayCanvas.height = height;
};

resizeCanvases();

/**
 * =========================
 * Layers
 * =========================
 */
const candleLayer = new ExistingCandlesLayer({
	canvas: candleCanvas,

	candles,

	baseCandleWidth: 8,

	baseCandleGap: 4,
});

const crosshairLayer = new CrosshairLayer({
	canvas: overlayCanvas,
});

/**
 * =========================
 * Initial Render
 * =========================
 */
candleLayer.render();

crosshairLayer.render();

/**
 * =========================
 * Zoom Handling
 * =========================
 */
overlayCanvas.addEventListener(
	"wheel",
	(event) => {
		event.preventDefault();

		const zoomDelta = event.deltaY < 0 ? 1 : -1;

		/**
		 * Ctrl/Cmd + Wheel
		 * Vertical zoom
		 */
		if (event.ctrlKey || event.metaKey) {
			candleLayer.zoomVertically(zoomDelta);
		} else {
			/**
			 * Default wheel
			 * Horizontal zoom
			 */
			candleLayer.zoomHorizontally(zoomDelta);
		}

		candleLayer.render();
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

overlayCanvas.addEventListener("mousedown", (event) => {
	isDragging = true;

	lastMouseX = event.clientX;

	lastMouseY = event.clientY;
});

window.addEventListener("mouseup", () => {
	isDragging = false;
});

window.addEventListener("mousemove", (event) => {
	/**
	 * Crosshair
	 */
	crosshairLayer.updateMousePosition(
		event.clientX,

		event.clientY,
	);

	crosshairLayer.render();

	/**
	 * Panning
	 */
	if (!isDragging) {
		return;
	}

	const deltaX = event.clientX - lastMouseX;

	const deltaY = event.clientY - lastMouseY;

	lastMouseX = event.clientX;

	lastMouseY = event.clientY;

	candleLayer.panHorizontally(deltaX);

	candleLayer.panVertically(deltaY);

	candleLayer.render();
});

/**
 * =========================
 * Hide Crosshair
 * =========================
 */
overlayCanvas.addEventListener("mouseleave", () => {
	crosshairLayer.hide();

	crosshairLayer.render();
});

/**
 * =========================
 * Resize Handling
 * =========================
 */
window.addEventListener("resize", () => {
	resizeCanvases();

	candleLayer.render();

	crosshairLayer.render();
});
