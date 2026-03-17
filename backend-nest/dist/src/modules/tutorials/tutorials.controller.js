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
var TutorialsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorialsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const tutorials_service_1 = require("./tutorials.service");
let TutorialsController = TutorialsController_1 = class TutorialsController {
    tutorialsService;
    logger = new common_1.Logger(TutorialsController_1.name);
    constructor(tutorialsService) {
        this.tutorialsService = tutorialsService;
    }
    async findAll(page = '1', limit = '10') {
        return this.tutorialsService.findAll(parseInt(page), parseInt(limit));
    }
    async findByCategory(category, page = '1', limit = '10') {
        return this.tutorialsService.findByCategory(category, parseInt(page), parseInt(limit));
    }
    async findOne(id) {
        const tutorial = await this.tutorialsService.findOne(parseInt(id));
        if (!tutorial) {
            return { error: 'Tutorial não encontrado' };
        }
        return { data: tutorial };
    }
};
exports.TutorialsController = TutorialsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os tutoriais com paginação' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TutorialsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tutoriais por categoria' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TutorialsController.prototype, "findByCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detalhes de um tutorial específico' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TutorialsController.prototype, "findOne", null);
exports.TutorialsController = TutorialsController = TutorialsController_1 = __decorate([
    (0, swagger_1.ApiTags)('Tutorials'),
    (0, common_1.Controller)('tutorials'),
    __metadata("design:paramtypes", [tutorials_service_1.TutorialsService])
], TutorialsController);
//# sourceMappingURL=tutorials.controller.js.map