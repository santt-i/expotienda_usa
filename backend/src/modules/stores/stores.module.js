"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresModule = void 0;
const common_1 = require("@nestjs/common");
const stores_controller_1 = require("./stores.controller");
const stores_service_1 = require("./stores.service");
@(0, common_1.Module)({
    controllers: [stores_controller_1.StoresController],
    providers: [stores_service_1.StoresService]
})
class StoresModule {
}
exports.StoresModule = StoresModule;
//# sourceMappingURL=stores.module.js.map