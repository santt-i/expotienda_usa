"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresController = void 0;
const common_1 = require("@nestjs/common");
const stores_service_1 = require("./stores.service");
const create_store_dto_1 = require("./dto/create-store.dto");
const passport_1 = require("@nestjs/passport");
@(0, common_1.Controller)('stores')
class StoresController {
    storesService;
    constructor(storesService) {
        this.storesService = storesService;
    }
    @(0, common_1.Get)()
    findAll() {
        return this.storesService.findAll();
    }
    @(0, common_1.Get)(':id')
    findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.storesService.findOne(+id);
    }
    @(0, common_1.Post)()
    @(0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')) // SOLO usuarios autenticados
    create(
    @(0, common_1.Body)()
    createStoreDto, 
    @(0, common_1.Request)()
    req) {
        // req.user tiene la info del token (userId, email, role)
        return this.storesService.create(createStoreDto, req.user.userId);
    }
    @(0, common_1.Put)(':id')
    @(0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))
    update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateStoreDto, 
    @(0, common_1.Request)()
    req) {
        return this.storesService.update(+id, updateStoreDto, req.user.userId, req.user.role);
    }
    @(0, common_1.Delete)(':id')
    @(0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))
    remove(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Request)()
    req) {
        return this.storesService.remove(+id, req.user.userId, req.user.role);
    }
}
exports.StoresController = StoresController;
//# sourceMappingURL=stores.controller.js.map