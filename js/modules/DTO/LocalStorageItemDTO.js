export class LocalStorageItemDTO {
    constructor(data) {
        this.data = data;
        this.timestamp = Date.now();
    }
}