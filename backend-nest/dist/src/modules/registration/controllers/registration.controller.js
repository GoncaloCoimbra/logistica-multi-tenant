"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RegistrationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationController = void 0;
const common_1 = require("@nestjs/common");
const registration_service_1 = require("../../../registration/registration.service");
let RegistrationController = RegistrationController_1 = class RegistrationController {
    registrationService;
    logger = new common_1.Logger(RegistrationController_1.name);
    constructor(registrationService) {
        this.registrationService = registrationService;
    }
    async register(dto) {
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log('📨 Requisição de registro recebida');
        this.logger.log(`🏢 Empresa: ${dto.companyName}`);
        this.logger.log(`📧 Email Empresa: ${dto.companyEmail}`);
        this.logger.log(`🆔 NIF: ${dto.companyNif}`);
        this.logger.log(`👤 Usuário: ${dto.userName}`);
        this.logger.log(`📧 Email Usuário: ${dto.userEmail}`);
        try {
            const result = await this.registrationService.registerCompanyAndUser(dto);
            this.logger.log(' Registro completado com sucesso!');
            this.logger.log(`👤 User ID: ${result.user.id}`);
            this.logger.log(`🏢 Company ID: ${result.user.companyId}`);
            this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            return result;
        }
        catch (error) {
            this.logger.error(' Erro no registro:', error.message);
            this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            throw error;
        }
    }
};
exports.RegistrationController = RegistrationController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegistrationController.prototype, "register", null);
exports.RegistrationController = RegistrationController = RegistrationController_1 = __decorate([
    (0, common_1.Controller)('registration'),
    __metadata("design:paramtypes", [registration_service_1.RegistrationService])
], RegistrationController);
//# sourceMappingURL=registration.controller.js.map