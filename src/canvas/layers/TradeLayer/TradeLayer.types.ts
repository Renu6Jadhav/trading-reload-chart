import type { ChartViewport } from "../../../models/ChartViewport";
import type { OpenTrade } from "../../../models/Trade";

export type TradeHandleType = "startPrice" | "stopLoss" | "takeProfit";

export type TradeHandleHitbox = {
	x: number;
	y: number;
	width: number;
	height: number;
	trade: OpenTrade;
	type: TradeHandleType;
	price: number;
	viewport: ChartViewport;
};

export type TradeLayerEventsOptions = {
	canvas: HTMLCanvasElement;
	getHandleHitboxes: () => TradeHandleHitbox[];
	onDrag?: (payload: { trade: OpenTrade; type: TradeHandleType; price: number }) => void;
	onTradeModified?: (payload: { ticket: number; tp?: number; sl?: number }) => void;
};

export type TradeLayerOptions = {
	canvas: HTMLCanvasElement;
};
