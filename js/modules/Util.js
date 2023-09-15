export class Util {
    /**
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
     getRandomInt(min, max) {
         min = Math.ceil(min);
         max = Math.floor(max);
         return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @param {number} numerator
     * @param {number} denominator
     * @return {number}
     */
    getSafePercentage(numerator, denominator) {
         if (denominator === 0) {
            return 0;
         }
         return (numerator / denominator) * 100;
    }
}