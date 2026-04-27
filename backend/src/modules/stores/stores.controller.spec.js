"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stores_controller_1 = require("./stores.controller");
describe('StoresController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [stores_controller_1.StoresController],
        }).compile();
        controller = module.get(stores_controller_1.StoresController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=stores.controller.spec.js.map