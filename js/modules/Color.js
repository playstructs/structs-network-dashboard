export class Color {
    /**
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @param {number} alpha
     */
    constructor(red, green, blue, alpha = 1) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
    }

    /**
     * @return {string}
     */
    toCSS() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}