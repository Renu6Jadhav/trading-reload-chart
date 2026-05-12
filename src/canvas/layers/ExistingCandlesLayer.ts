import type { Candle } from "../models/Candle";
import type { ChartTheme } from "../models/Theme";
import type { Viewport } from "../core/Viewport";
import { CoordinateSystem } from "../core/CoordinateSystem";


type ExistingCandlesLayerOptions = {
    ctx: CanvasRenderingContext2D;

    theme: ChartTheme;

    viewport: Viewport;

    coordinateSystem: CoordinateSystem;

    candleWidth: number;

    candleGap: number;

    wickWidth?: number;

    borderRadius?: number;

    showVolume?: boolean;

    volumeHeight?: number;
};

export class ExistingCandlesLayer {
    private ctx: CanvasRenderingContext2D;

    private theme: ChartTheme;

    private viewport: Viewport;

    private coordinateSystem: CoordinateSystem;

    private candleWidth: number;

    private candleGap: number;

    private wickWidth: number;

    private borderRadius: number;

    private showVolume: boolean;

    private volumeHeight: number;

    constructor(options: ExistingCandlesLayerOptions) {
        this.ctx = options.ctx;

        this.theme = options.theme;

        this.viewport = options.viewport;

        this.coordinateSystem = options.coordinateSystem;

        this.candleWidth = options.candleWidth;

        this.candleGap = options.candleGap;

        this.wickWidth = options.wickWidth ?? 1;

        this.borderRadius = options.borderRadius ?? 0;

        this.showVolume = options.showVolume ?? true;

        this.volumeHeight = options.volumeHeight ?? 120;
    }

    render(candles: Candle[]) {
        const ctx = this.ctx;

        ctx.clearRect(
            0,
            0,
            this.viewport.width,
            this.viewport.height
        );

        if (candles.length <= 1) return;

        /**
         * Exclude live candle.
         * Last candle should render in LiveCandleLayer.
         */
        const historicalCandles = candles.slice(0, -1);

        const processedCandles =
            this.processCandles(historicalCandles);

        ctx.save();

        for (const candle of processedCandles) {
            this.drawCandle(candle);
        }

        if (this.showVolume) {
            for (const candle of processedCandles) {
                this.drawVolume(candle);
            }
        }

        ctx.restore();
    }

    private processCandles(
        candles: Candle[]
    ): ProcessedCandle[] {
        const processed: ProcessedCandle[] = [];

        const volumeMax = this.getMaxVolume(candles);

        for (let i = 0; i < candles.length; i++) {
            const candle = candles[i];

            const x =
                this.coordinateSystem.indexToX(i);

            /**
             * Skip invisible candles.
             */
            if (
                x + this.candleWidth < 0 ||
                x > this.viewport.width
            ) {
                continue;
            }

            const openY =
                this.coordinateSystem.priceToY(
                    candle.open
                );

            const highY =
                this.coordinateSystem.priceToY(
                    candle.high
                );

            const lowY =
                this.coordinateSystem.priceToY(
                    candle.low
                );

            const closeY =
                this.coordinateSystem.priceToY(
                    candle.close
                );

            const bullish =
                candle.close >= candle.open;

            const bodyY = Math.min(openY, closeY);

            const bodyHeight = Math.max(
                Math.abs(closeY - openY),
                1
            );

            let volumeY = 0;
            let volumeHeight = 0;

            if (this.showVolume) {
                volumeHeight =
                    (candle.volume / volumeMax) *
                    this.volumeHeight;

                volumeY =
                    this.viewport.height -
                    volumeHeight;
            }

            processed.push({
                x,

                openY,
                highY,
                lowY,
                closeY,

                bodyY,
                bodyHeight,

                width: this.candleWidth,

                bullish,

                volumeY,
                volumeHeight
            });
        }

        return processed;
    }

    private drawCandle(candle: ProcessedCandle) {
        const ctx = this.ctx;

        const color = candle.bullish
            ? this.theme.bullishCandle
            : this.theme.bearishCandle;

        ctx.strokeStyle = color;

        ctx.fillStyle = color;

        ctx.lineWidth = this.wickWidth;

        const centerX =
            candle.x + candle.width / 2;

        /**
         * Wick
         */
        ctx.beginPath();

        ctx.moveTo(centerX, candle.highY);

        ctx.lineTo(centerX, candle.lowY);

        ctx.stroke();

        /**
         * Body
         */
        if (this.borderRadius <= 0) {
            ctx.fillRect(
                candle.x,
                candle.bodyY,
                candle.width,
                candle.bodyHeight
            );

            return;
        }

        this.drawRoundedRect(
            candle.x,
            candle.bodyY,
            candle.width,
            candle.bodyHeight,
            this.borderRadius
        );
    }

    private drawVolume(candle: ProcessedCandle) {
        if (
            candle.volumeHeight === undefined ||
            candle.volumeY === undefined
        ) {
            return;
        }

        const ctx = this.ctx;

        ctx.fillStyle = candle.bullish
            ? this.theme.volumeBullish
            : this.theme.volumeBearish;

        ctx.fillRect(
            candle.x,
            candle.volumeY,
            candle.width,
            candle.volumeHeight
        );
    }

    private drawRoundedRect(
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) {
        const ctx = this.ctx;

        ctx.beginPath();

        ctx.moveTo(x + radius, y);

        ctx.lineTo(x + width - radius, y);

        ctx.quadraticCurveTo(
            x + width,
            y,
            x + width,
            y + radius
        );

        ctx.lineTo(
            x + width,
            y + height - radius
        );

        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height
        );

        ctx.lineTo(x + radius, y + height);

        ctx.quadraticCurveTo(
            x,
            y + height,
            x,
            y + height - radius
        );

        ctx.lineTo(x, y + radius);

        ctx.quadraticCurveTo(
            x,
            y,
            x + radius,
            y
        );

        ctx.closePath();

        ctx.fill();
    }

    private getMaxVolume(candles: Candle[]) {
        let max = 0;

        for (const candle of candles) {
            if (candle.volume > max) {
                max = candle.volume;
            }
        }

        return max || 1;
    }
}