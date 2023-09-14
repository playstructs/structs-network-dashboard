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
}