import {Util} from "./Util.js";

export class GuildAppraiser {

    constructor() {
        this.util = new Util();
        this.guild = null;
        this.maxGuildAttributes = null;
        this.energyRating = 0;
        this.fuelRating = 0;
        this.loadRating = 0;
        this.membersCountRating = 0;
        this.guildRating = 0;
    }

    calculateGuildRating() {
        this.guildRating = 0.45 * this.fuelRating
            + 0.45 * this.membersCountRating
            + 0.05 * this.loadRating
            + 0.05 * this.energyRating;
    }

    appraise() {
        this.fuelRating = this.util.getSafePercentage(this.guild.fuel, this.maxGuildAttributes.fuel);
        this.membersCountRating = this.util.getSafePercentage(this.guild.membersCount, this.maxGuildAttributes.membersCount);
        this.loadRating = this.util.getSafePercentage(this.guild.load, this.maxGuildAttributes.load);
        this.energyRating = this.util.getSafePercentage(this.guild.energy, this.maxGuildAttributes.energy);
        this.calculateGuildRating();
    }

}