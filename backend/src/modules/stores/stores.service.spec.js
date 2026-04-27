"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stores_service_1 = require("./stores.service");
describe('StoresService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [stores_service_1.StoresService],
        }).compile();
        service = module.get(stores_service_1.StoresService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=stores.service.spec.js.map