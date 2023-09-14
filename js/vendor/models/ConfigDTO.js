import {DataDTO} from "./DataDTO.js";

export class ConfigDTO {
    constructor() {
        this.type = '';
        this.data = new DataDTO();
        this.options = {};
    }
}
