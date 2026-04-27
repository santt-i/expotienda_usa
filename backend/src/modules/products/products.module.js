"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const prisma_service_1 = require("../../../../../../../../../../../src/prisma/prisma.service");
@(0, common_1.Module)({
    controllers: [products_controller_1.ProductsController],
    providers: [products_service_1.ProductsService, prisma_service_1.PrismaService],
})
class ProductsModule {
}
exports.ProductsModule = ProductsModule;
//# sourceMappingURL=products.module.js.map