import {RadarDatasetDTO} from "../vendor/models/RadarDatasetDTO.js";
import {Color} from "./Color.js";
import {Util} from "./Util.js";

export class RadarDatasetBuilder {

    constructor() {
        this.util = new Util();
    }

    /**
     * @param {Guild} guild
     * @param {GuildAttributesDTO} minAttributes
     * @param {GuildAttributesDTO} maxAttributes
     */
    buildRadarDatasetFromGuild(guild, minAttributes, maxAttributes) {
        const fillColor = Object.assign(new Color(0, 0, 0), guild.color);
        fillColor.a = 0.2;
        const fillColorCSS = fillColor.toCSS();
        const lineColorCSS = guild.color.toCSS();

        const dataset = new RadarDatasetDTO();
        dataset.label = guild.name;
        dataset.data = [
            this.util.getSafePercentage(
                guild.fuel - minAttributes.fuel,
                maxAttributes.fuel - minAttributes.fuel
            ),
            this.util.getSafePercentage(
                guild.membersCount - minAttributes.membersCount,
                maxAttributes.membersCount - minAttributes.membersCount
            ),
            this.util.getSafePercentage(
                guild.load - minAttributes.load,
                maxAttributes.load - minAttributes.load
            ),
            this.util.getSafePercentage(
                guild.energy - minAttributes.energy,
                maxAttributes.energy - minAttributes.energy
            ),
        ];
        dataset.backgroundColor = fillColorCSS;
        dataset.borderColor = lineColorCSS;
        dataset.pointBackgroundColor = lineColorCSS;
        dataset.pointBorderColor = '#fff';
        dataset.pointHoverBackgroundColor = '#fff';
        dataset.pointHoverBorderColor = lineColorCSS;

        return dataset;
    }
}