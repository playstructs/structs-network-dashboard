import {Color} from "./Color.js";
import {Util} from "./Util.js";

export class GuildPaletteManager {

    static assignedColors = new Map();

    constructor() {
        this.util = new Util();
        this.structsHighlightPalette = [
            new Color(67, 205, 182),  // 170, 67, 80 [Green]
            new Color(221, 78, 142), //  333, 65, 87 [Pink]
            new Color(148, 164, 228), // 228, 35, 89 [Blue]
            new Color(243, 200, 120), //  39, 51, 95 [Yellow]
            new Color(238, 125, 105), //   9, 56, 93 [Red]
        ];
    }

    /**
     * @param {number} h
     * @param {number} s
     * @param {number} b
     * @return {string}
     */
    getColorKey(h, s, b) {
        return `h${h},s${s},b${b}`;
    }

    /**
     * @return {Color}
     */
    getRandomColor() {
        let colorKey = '';
        let newColor = null;

        // Try to find a free color otherwise oh well
        for (let i = 0; i < 360; i++) {
            const randIndex = this.util.getRandomInt(0, this.structsHighlightPalette.length - 1);
            const baseColor = this.structsHighlightPalette[randIndex];
            const hsb = this.rgbToHSB(baseColor);
            const randHue = this.util.getRandomInt(0, 359);
            colorKey = this.getColorKey(randHue, hsb[1], hsb[2]);
            newColor = this.hsbToRGB(randHue, hsb[1], hsb[2]);
            if (!GuildPaletteManager.assignedColors.has(colorKey)) {
                break;
            }
        }

        GuildPaletteManager.assignedColors.set(colorKey, newColor);

        return newColor;
    }

    /**
     * @param {Color} rgbColor
     * @return {number[]}
     */
    rgbToHSB(rgbColor) {
        const r = rgbColor.r / 255;
        const g = rgbColor.g / 255;
        const b = rgbColor.b / 255;

        const v = Math.max(r, g, b);
        const n = v - Math.min(r, g, b);
        let h;

        if (n === 0) {
            h = 0;
        } else if (v === r) {
            h = (g - b) / n;
        } else if (v === g) {
            h = 2 + (b - r) / n;
        } else {
            h = 4 + (r - g) / n;
        }

        const hue = (h) => 60 * (h < 0 ? h + 6 : h);
        const saturation = (v, n) => v && (n / v) * 100;
        const brightness = (v) => v * 100;

        return [
            hue(h),
            saturation(v, n),
            brightness(v)
        ];
    };

    /**
     * @param {number} h
     * @param {number} s
     * @param {number} b
     * @return {Color}
     */
    hsbToRGB(h, s, b) {
        s /= 100;
        b /= 100;
        const k = (n) => (n + h / 60) % 6;
        const f = (n) => Math.round(255 * b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1))));
        return new Color(
            f(5),
            f(3),
            f(1)
        );
    };
}
