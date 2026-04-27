"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
@(0, common_1.Global)()
@(0, common_1.Module)({
    providers: [prisma_service_1.PrismaService],
    exports: [prisma_service_1.PrismaService],
})
class PrismaModule {
}
exports.PrismaModule = PrismaModule;
//# sourceMappingURL=prisma.module.js.map