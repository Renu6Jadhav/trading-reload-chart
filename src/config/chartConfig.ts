import type { ChartConfig } from "./chartConfig.types";

export const CHART_CONFIG: ChartConfig = {
	zoom: {
		x: {
			speed: 0.05,
			min: 0.03,
			max: 20,
		},
		y: {
			speed: 0.1,
			min: 1,
			max: 5000,
		},
	},
	candles: {
		defaultWidth: 8,
		defaultGap: 2,
		minBodyHeight: 1,
		autoFollowLatestCandle: true,
		autoFollowThresholdCandles: 10,
		rightOffsetCandles: 15,
		livePriceLine: {
			visible: true,
			width: 1,
			opacity: 0.7,
			dash: [4, 4],
			bullishColor: "#22c55e",
			bearishColor: "#ef4444",
		},
	},
	crosshair: {
		color: "rgba(255,255,255,0.35)",
		thickness: 1,
		style: "dashed",
	},
	colors: {
		bullish: "#22c55e",
		bearish: "#ef4444",
		background: "#11131a",
	},
};
