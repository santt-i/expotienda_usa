"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const create_product_dto_1 = require("./dto/create-product.dto");
@(0, common_1.Injectable)()
class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.product.findMany({
            include: { store: true }
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { store: true }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con id ${id} no encontrado`);
        }
        return product;
    }
    async create(createProductDto) {
        return this.prisma.product.create({
            data: createProductDto
        });
    }
    async update(id, updateProductDto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.delete({
            where: { id }
        });
    }
}
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map