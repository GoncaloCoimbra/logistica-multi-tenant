"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const companies_module_1 = require("./companies/companies.module");
const users_module_1 = require("./users/users.module");
const transports_module_1 = require("./transports/transports.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const settings_module_1 = require("./settings/settings.module");
const registration_module_1 = require("./registration/registration.module");
const auth_module_1 = require("./modules/auth/auth.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const products_module_1 = require("./modules/products/products.module");
const superadmin_module_1 = require("./modules/superadmin/superadmin.module");
const audit_log_module_1 = require("./modules/audit-log/audit-log.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const tutorials_module_1 = require("./modules/tutorials/tutorials.module");
const metrics_module_1 = require("./common/metrics/metrics.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const audit_log_interceptor_1 = require("./common/interceptors/audit-log.interceptor");
const tenant_context_service_1 = require("./common/tenant-context.service");
const tenant_interceptor_1 = require("./common/interceptors/tenant.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            registration_module_1.RegistrationModule,
            audit_log_module_1.AuditLogModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            dashboard_module_1.DashboardModule,
            products_module_1.ProductsModule,
            suppliers_module_1.SuppliersModule,
            transports_module_1.TransportsModule,
            vehicles_module_1.VehiclesModule,
            notifications_module_1.NotificationsModule,
            tasks_module_1.TasksModule,
            tutorials_module_1.TutorialsModule,
            superadmin_module_1.SuperadminModule,
            metrics_module_1.MetricsModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_log_interceptor_1.AuditLogInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: tenant_interceptor_1.TenantInterceptor,
            },
            tenant_context_service_1.TenantContextService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map