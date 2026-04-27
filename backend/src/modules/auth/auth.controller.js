"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
@(0, common_1.Controller)('auth')
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    @(0, common_1.Post)('register')
    async register(
    @(0, common_1.Body)()
    registerDto) {
        return this.authService.register(registerDto);
    }
    @(0, common_1.Post)('login')
    async login(
    @(0, common_1.Body)()
    loginDto) {
        return this.authService.login(loginDto);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map