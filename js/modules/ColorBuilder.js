import {Util} from "./Util.js";
import {Color} from "./Color.js";

export class ColorBuilder {

    constructor() {
        this.util = new Util();
    }

    /**
     * @return {Color}
     */
    buildRandom() {
        return new Color(
            this.util.getRandomInt(0, 255),
            this.util.getRandomInt(0, 255),
            this.util.getRandomInt(0, 255)
        );
    }

    /**
     * @param {Color} lineColor
     * @return {Color}
     */
    createFillColorFromLineColor(lineColor) {
        const fillColor = Object.assign(new Color(0, 0, 0), lineColor);
        fillColor.a = 0.2;
        return fillColor;
    }
}