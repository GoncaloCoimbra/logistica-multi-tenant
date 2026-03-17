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
var AuditLogInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_log_service_1 = require("../../modules/audit-log/audit-log.service");
let AuditLogInterceptor = AuditLogInterceptor_1 = class AuditLogInterceptor {
    auditLogService;
    logger = new common_1.Logger(AuditLogInterceptor_1.name);
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const user = request.user;
        const body = request.body;
        console.log('[INTERCEPTOR] Executed!');
        console.log('[INTERCEPTOR] Method:', method);
        console.log('[INTERCEPTOR] URL:', url);
        console.log('[INTERCEPTOR] User:', user ? user.email : 'NO USER');
        console.log('[INTERCEPTOR] Body:', JSON.stringify(body));
        const shouldLog = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        console.log('[INTERCEPTOR] Should log?', shouldLog);
        console.log('[INTERCEPTOR] Has user?', !!user);
        if (!shouldLog || !user) {
            console.log('⚠️ [INTERCEPTOR] Skipping log - shouldLog:', shouldLog, 'user:', !!user);
            return next.handle();
        }
        console.log(' [INTERCEPTOR] Will process the log!');
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            console.log('[INTERCEPTOR TAP] Response received:', JSON.stringify(response));
            try {
                const { entity, action } = this.extractEntityAndAction(method, url);
                console.log('[INTERCEPTOR] Entity:', entity, 'Action:', action);
                if (!entity) {
                    console.log('⚠️ [INTERCEPTOR] Nenhuma entity encontrada, saindo...');
                    return;
                }
                const entityId = this.extractEntityId(response, body, url);
                console.log('[INTERCEPTOR] Entity ID extracted:', entityId);
                const ipAddress = request.ip || request.connection?.remoteAddress;
                console.log('[INTERCEPTOR] Calling auditLogService.createLog...');
                await this.auditLogService.createLog({
                    action,
                    entity,
                    entityId: entityId || undefined,
                    userId: user.id,
                    companyId: user.companyId,
                    ipAddress: ipAddress ? String(ipAddress) : undefined,
                    metadata: {
                        method,
                        url,
                        body: this.sanitizeBody(body),
                    },
                });
                this.logger.log(` [AUDIT] ${action} ${entity}${entityId ? ` (${entityId})` : ''} by ${user.email}`);
            }
            catch (error) {
                this.logger.error(` [AUDIT ERROR] Could not register audit: ${error.message}`, error.stack);
            }
        }), (0, operators_1.catchError)((error) => {
            const errorDetail = error?.response ||
                (typeof error?.getResponse === 'function'
                    ? error.getResponse()
                    : undefined) ||
                error?.message ||
                'Unknown error';
            try {
                console.log(' [INTERCEPTOR] Error na requisição (detalhes):', JSON.stringify(errorDetail));
            }
            catch (e) {
                console.log(' [INTERCEPTOR] Error na requisição (detalhes):', errorDetail);
            }
            try {
                if (user) {
                    const { entity, action } = this.extractEntityAndAction(method, url);
                    if (entity) {
                        const errMsg = typeof errorDetail === 'string'
                            ? errorDetail
                            : errorDetail?.message || JSON.stringify(errorDetail);
                        this.logger.warn(`⚠️ [AUDIT] ${action} ${entity} falhou - ${errMsg}`);
                    }
                }
            }
            catch (auditError) {
            }
            if (error && error.stack) {
                this.logger.debug(` [INTERCEPTOR] Stack: ${error.stack}`);
            }
            throw error;
        }));
    }
    extractEntityId(response, body, url) {
        if (response && typeof response === 'object') {
            if (response.id) {
                return String(response.id);
            }
            if (response.data &&
                typeof response.data === 'object' &&
                response.data.id) {
                return String(response.data.id);
            }
            const possibleKeys = [
                'product',
                'user',
                'vehicle',
                'transport',
                'supplier',
                'company',
                'setting',
            ];
            for (const key of possibleKeys) {
                if (response[key] &&
                    typeof response[key] === 'object' &&
                    response[key].id) {
                    return String(response[key].id);
                }
            }
        }
        if (body && body.id) {
            return String(body.id);
        }
        const idFromUrl = this.extractIdFromUrl(url);
        if (idFromUrl) {
            return idFromUrl;
        }
        return null;
    }
    extractEntityAndAction(method, url) {
        const cleanUrl = url.split('?')[0];
        if (cleanUrl.match(/\/(stats|available|export|report|search|count)$/)) {
            return { entity: null, action: 'UNKNOWN' };
        }
        const entities = [
            'products',
            'users',
            'companies',
            'vehicles',
            'transports',
            'suppliers',
            'settings',
            'notifications',
        ];
        let entity = null;
        for (const e of entities) {
            if (cleanUrl.includes(`/${e}`)) {
                entity = e.slice(0, -1);
                break;
            }
        }
        const actionMap = {
            POST: 'CREATE',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE',
        };
        return {
            entity,
            action: actionMap[method] || 'UNKNOWN',
        };
    }
    extractIdFromUrl(url) {
        const cleanUrl = url.split('?')[0];
        const patterns = [
            /\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})(?:\/|$)/i,
            /\/(\d+)(?:\/|$)/,
        ];
        for (const pattern of patterns) {
            const match = cleanUrl.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    }
    sanitizeBody(body) {
        if (!body)
            return null;
        const sanitized = { ...body };
        const sensitiveFields = ['password', 'token', 'refreshToken', 'secret'];
        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = '***HIDDEN***';
            }
        });
        return sanitized;
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = AuditLogInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map