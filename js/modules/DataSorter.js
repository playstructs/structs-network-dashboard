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

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByMemberCounts(guilds) {
        return guilds.sort((a, b) => b.membersCount - a.membersCount);
    }

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsForLeaderboard(guilds) {
        const sortAttribute = ['fuel', 'membersCount', 'load', 'energy'];

        return guilds.sort((a, b) => {
            let comparison = 0;
            let priority = 0;

            while (comparison === 0 && priority < sortAttribute.length) {
                comparison = b[sortAttribute[priority]] - a[sortAttribute[priority]];
                priority++;
            }

            return comparison;
        })
    }
}
