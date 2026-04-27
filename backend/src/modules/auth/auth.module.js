"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./jwt.strategy");
@(0, common_1.Module)({
    imports: [
        passport_1.PassportModule,
        jwt_1.JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN // ← LA SOLUCIÓN: as any
            },
        }),
    ],
    controllers: [auth_controller_1.AuthController],
    providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
})
class AuthModule {
}
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map