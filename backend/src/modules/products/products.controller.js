"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
@(0, common_1.Controller)('products')
class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    @(0, common_1.Get)()
    async findAll() {
        return this.productsService.findAll();
    }
    @(0, common_1.Get)(':id')
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.productsService.findOne(+id);
    }
    @(0, common_1.Post)()
    async create(
    @(0, common_1.Body)()
    createProductDto) {
        return this.productsService.create(createProductDto);
    }
    @(0, common_1.Put)(':id')
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateProductDto) {
        return this.productsService.update(+id, updateProductDto);
    }
    @(0, common_1.Delete)(':id')
    async remove(
    @(0, common_1.Param)('id')
    id) {
        return this.productsService.remove(+id);
    }
}
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map