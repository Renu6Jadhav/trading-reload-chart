export const CHART_CONFIG = {
	zoom: {
		x: {
			speed: 0.1,

			min: 0.03,

			max: 20,
		},

		y: {
			speed: 0.1,

			min: 0.2,

			max: 10,
		},
	},

	candles: {
		defaultWidth: 8,

		defaultGap: 2,

		minBodyHeight: 1,
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
} as const;
