import {RadarDatasetDTO} from "../vendor/models/RadarDatasetDTO.js";
import {Color} from "./Color.js";

export class RadarDatasetBuilder {

    /**
     * @param {Guild} guild
     * @param {GuildAttributesDTO} maxAttributes
     */
    buildRadarDatasetFromGuild(guild, maxAttributes) {
        const fillColor = Object.assign(new Color(0, 0, 0), guild.color);
        fillColor.a = 0.2;
        const fillColorCSS = fillColor.toCSS();
        const lineColorCSS = guild.color.toCSS();

        const dataset = new RadarDatasetDTO();
        dataset.label = guild.name;
        dataset.data = [
            (guild.fuel / Math.max(maxAttributes.fuel, 1)) * 100,
            (guild.membersCount / Math.max(maxAttributes.membersCount, 1)) * 100,
            (guild.load / Math.max(maxAttributes.load, 1)) * 100,
            (guild.energy / Math.max(maxAttributes.energy, 1)) * 100,
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