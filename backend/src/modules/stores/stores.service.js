"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const create_store_dto_1 = require("./dto/create-store.dto");
@(0, common_1.Injectable)()
class StoresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.store.findMany({
            include: { owner: true, products: true }
        });
    }
    async findOne(id) {
        const store = await this.prisma.store.findUnique({
            where: { id },
            include: { owner: true, products: true }
        });
        if (!store) {
            throw new common_1.NotFoundException(`Tienda con id ${id} no encontrada`);
        }
        return store;
    }
    async create(createStoreDto, ownerId) {
        // Verificar si el usuario ya tiene una tienda
        const existingStore = await this.prisma.store.findUnique({
            where: { ownerId }
        });
        if (existingStore) {
            throw new common_1.ForbiddenException('Ya tienes una tienda creada');
        }
        return this.prisma.store.create({
            data: {
                name: createStoreDto.name,
                ownerId: ownerId
            }
        });
    }
    async update(id, updateStoreDto, userId, userRole) {
        const store = await this.findOne(id);
        // Solo el dueño o un admin pueden editar
        if (store.ownerId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('No tienes permiso para editar esta tienda');
        }
        return this.prisma.store.update({
            where: { id },
            data: updateStoreDto
        });
    }
    async remove(id, userId, userRole) {
        const store = await this.findOne(id);
        // Solo el dueño o un admin pueden eliminar
        if (store.ownerId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('No tienes permiso para eliminar esta tienda');
        }
        return this.prisma.store.delete({
            where: { id }
        });
    }
}
exports.StoresService = StoresService;
//# sourceMappingURL=stores.service.js.map