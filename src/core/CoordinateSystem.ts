export const screenToCandleIndex = ({
	screenX,
	offsetX,
	candleSpacing,
}: {
	screenX: number;
	offsetX: number;
	candleSpacing: number;
}) => {
	return (screenX - offsetX) / candleSpacing;
};

export const candleIndexToScreenX = ({
	candleIndex,
	offsetX,
	candleSpacing,
}: {
	candleIndex: number;
	offsetX: number;
	candleSpacing: number;
}) => {
	return candleIndex * candleSpacing + offsetX;
};
