import type { Candle } from "../../models/Candle";

type ExistingCandlesLayerOptions = {
	canvas: HTMLCanvasElement;

	candles: Candle[];

	candleWidth?: number;

	candleGap?: number;

	bullishColor?: string;

	bearishColor?: string;

	backgroundColor?: string;
};

export class ExistingCandlesLayer {
	readonly #canvas: HTMLCanvasElement;

	readonly #ctx: CanvasRenderingContext2D;

	candles: Candle[];

	candleWidth: number;

	candleGap: number;

	bullishColor: string;

	bearishColor: string;

	backgroundColor: string;

	constructor(options: ExistingCandlesLayerOptions) {
		this.#canvas = options.canvas;

		const ctx = this.#canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Canvas 2D context not supported");
		}

		this.#ctx = ctx;

		this.candles = options.candles;
		this.candleWidth = options.candleWidth ?? 8;

		this.candleGap = options.candleGap ?? 2;

		this.bullishColor = options.bullishColor ?? "#22c55e";

		this.bearishColor = options.bearishColor ?? "#ef4444";

		this.backgroundColor = options.backgroundColor ?? "#0f172a";
	}

	render() {
		const ctx = this.#ctx;

		const canvasWidth = this.#canvas.width;

		const canvasHeight = this.#canvas.height;

		/**
		 * Background
		 */
		ctx.fillStyle = this.backgroundColor;

		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		if (this.candles.length === 0) {
			return;
		}

		/**
		 * Ignore last candle for now.
		 * Live candle will come later.
		 */
		const candles = this.candles.slice(0, -1);

		/**
		 * Find visible price range
		 */
		let minPrice = Number.POSITIVE_INFINITY;

		let maxPrice = Number.NEGATIVE_INFINITY;

		for (const candle of candles) {
			if (candle.low < minPrice) {
				minPrice = candle.low;
			}

			if (candle.high > maxPrice) {
				maxPrice = candle.high;
			}
		}

		const priceRange = maxPrice - minPrice;

		/**
		 * Draw candles
		 */
		for (let i = 0; i < candles.length; i++) {
			const candle = candles[i];

			const x = i * (this.candleWidth + this.candleGap);

			/**
			 * Stop drawing outside viewport
			 */
			if (x > canvasWidth) {
				break;
			}

			const openY = canvasHeight - ((candle.open - minPrice) / priceRange) * canvasHeight;

			const closeY = canvasHeight - ((candle.close - minPrice) / priceRange) * canvasHeight;

			const highY = canvasHeight - ((candle.high - minPrice) / priceRange) * canvasHeight;

			const lowY = canvasHeight - ((candle.low - minPrice) / priceRange) * canvasHeight;

			const bullish = candle.close >= candle.open;

			const color = bullish ? this.bullishColor : this.bearishColor;

			ctx.strokeStyle = color;

			ctx.fillStyle = color;

			/**
			 * Wick
			 */
			const centerX = x + this.candleWidth / 2;

			ctx.beginPath();

			ctx.moveTo(centerX, highY);

			ctx.lineTo(centerX, lowY);

			ctx.stroke();

			/**
			 * Body
			 */
			const bodyY = Math.min(openY, closeY);

			const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

			ctx.fillRect(x, bodyY, this.candleWidth, bodyHeight);
		}
	}
}
