export class DataSorter {

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByEnergy(guilds) {
        return guilds.sort((a, b) => b.fuel - a.fuel);
    }

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByFuel(guilds) {
        return guilds.sort((a, b) => b.fuel - a.fuel);
    }

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByLoad(guilds) {
        return guilds.sort((a, b) => b.load - a.load);
    }
}
