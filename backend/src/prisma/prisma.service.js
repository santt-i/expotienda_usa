"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
@(0, common_1.Injectable)()
class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
}
exports.PrismaService = PrismaService;
//# sourceMappingURL=prisma.service.js.map