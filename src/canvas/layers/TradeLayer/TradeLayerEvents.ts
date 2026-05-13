import type { TradeHandleHitbox, TradeLayerEventsOptions } from "./TradeLayer.types";

const EVENT_TYPES_TO_HANDLE = ["pointerdown", "pointermove", "pointerup"] as const;

export class TradeLayerEvents {
	readonly #canvas: HTMLCanvasElement;

	readonly #getHandleHitboxes: () => TradeHandleHitbox[];

	readonly #onDrag: TradeLayerEventsOptions["onDrag"];

	readonly #onTradeModified: TradeLayerEventsOptions["onTradeModified"];

	#activeDragHitbox: TradeHandleHitbox | null = null;

	#lastMouseY = 0;

	constructor(options: TradeLayerEventsOptions) {
		this.#canvas = options.canvas;

		this.#getHandleHitboxes = options.getHandleHitboxes;

		this.#onDrag = options.onDrag;

		this.#onTradeModified = options.onTradeModified;
	}

	handlePointerEvent(event: PointerEvent | WheelEvent | MouseEvent) {
		if (!EVENT_TYPES_TO_HANDLE.includes(event.type as (typeof EVENT_TYPES_TO_HANDLE)[number])) {
			return false;
		}

		const rect = this.#canvas.getBoundingClientRect();

		const mouseX = event.clientX - rect.left;

		const mouseY = event.clientY - rect.top;

		/**
		 * =========================
		 * Active Drag
		 * =========================
		 */
		if (event.type === "pointermove" && this.#activeDragHitbox) {
			const deltaY = mouseY - this.#lastMouseY;

			this.#lastMouseY = mouseY;

			const pricePerPixel = this.#activeDragHitbox.viewport.priceRange / this.#canvas.height;

			const nextPrice = this.#activeDragHitbox.price - deltaY * pricePerPixel;

			this.#activeDragHitbox.price = nextPrice;

			this.#onDrag?.({
				trade: this.#activeDragHitbox.trade,
				type: this.#activeDragHitbox.type,
				price: nextPrice,
			});

			event.stopPropagation();

			event.preventDefault();

			return true;
		}

		/**
		 * =========================
		 * Drag End
		 * =========================
		 */
		if (event.type === "pointerup") {
			const price = Number(this.#activeDragHitbox.price.toFixed(3));
			if (this.#activeDragHitbox.type === "stopLoss") {
				this.#onTradeModified?.({
					ticket: this.#activeDragHitbox.trade.ticket,
					sl: price,
				});
			} else {
				this.#onTradeModified?.({
					ticket: this.#activeDragHitbox.trade.ticket,
					tp: price,
				});
			}

			this.#activeDragHitbox = null;
			return false;
		}

		const handleHitboxes = this.#getHandleHitboxes();
		let isHoveringHandle = false;

		for (const hitbox of handleHitboxes) {
			const isInsideX = mouseX >= hitbox.x && mouseX <= hitbox.x + hitbox.width;

			const isInsideY = mouseY >= hitbox.y && mouseY <= hitbox.y + hitbox.height;

			if (isInsideX && isInsideY) {
				isHoveringHandle = true;
				document.body.style.cursor = hitbox.type === "startPrice" ? "crosshair" : "ns-resize";
				if (event.type === "pointerdown" && hitbox.type !== "startPrice") {
					this.#activeDragHitbox = hitbox;
					this.#lastMouseY = mouseY;
				}

				if (hitbox.type !== "startPrice") {
					event.stopPropagation();
					event.preventDefault();
					return true;
				}

				return false;
			}
		}
		if (!isHoveringHandle && !this.#activeDragHitbox) {
			document.body.style.cursor = "crosshair";
		}

		return false;
	}
}
