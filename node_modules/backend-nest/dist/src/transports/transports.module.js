"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportsModule = void 0;
const common_1 = require("@nestjs/common");
const transports_service_1 = require("../modules/transports/transports.service");
const transports_controller_1 = require("../modules/transports/controllers/transports.controller");
const transport_repository_1 = require("../database/repositories/transport.repository");
const prisma_service_1 = require("../database/prisma.service");
const notifications_module_1 = require("../modules/notifications/notifications.module");
let TransportsModule = class TransportsModule {
};
exports.TransportsModule = TransportsModule;
exports.TransportsModule = TransportsModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [transports_controller_1.TransportsController],
        providers: [transports_service_1.TransportsService, transport_repository_1.TransportRepository, prisma_service_1.PrismaService],
        exports: [transports_service_1.TransportsService],
    })
], TransportsModule);
//# sourceMappingURL=transports.module.js.map