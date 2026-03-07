import {  
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException, 
  Logger 
} from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;

    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(` TenantGuard - ${method} ${url}`);

    // Verificar se usuário existe
    if (!user) {
      this.logger.error(' Utilizador não autenticado');
      throw new ForbiddenException('Utilizador não autenticado');
    }

    this.logger.log(`👤 User: ${user.email} | Role: ${user.role}`);

    // SUPER_ADMIN tem acesso total SEM validação de companyId
    if (user.role === Role.SUPER_ADMIN) {
      this.logger.log('⭐ SUPER_ADMIN detectado - acesso total permitido');
      this.logger.log(`   🌍 Pode aceder a TODAS as empresas`);
      
      //  Para SUPER_ADMIN, disponibiliza no request mas NÃO injeta no body
      request.companyId = user.companyId || null;
      request.userId = user.id;
      
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return true;
    }

    // Para ADMIN e OPERATOR: validar companyId obrigatório
    if (!user.companyId) {
      this.logger.error(` User ${user.email} (${user.role}) sem empresa associada`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new ForbiddenException('Utilizador sem empresa associada');
    }

    this.logger.log(`🏢 User companyId: ${user.companyId}`);

    //  CORRIGIDO: NÃO injeta no body, apenas valida se vier
    if (['POST', 'PATCH', 'PUT'].includes(method) && request.body) {
      // Validar se está a tentar manipular dados de outra empresa
      if (request.body.companyId && request.body.companyId !== user.companyId) {
        this.logger.error(
          ` User ${user.email} tentou manipular empresa ${request.body.companyId}`
        );
        this.logger.error(`   🏢 Empresa do user: ${user.companyId}`);
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        throw new ForbiddenException('Não pode manipular dados de outra empresa');
      }
      
      //  REMOVIDO: NÃO injeta mais no body (causa erro de validação)
      // request.body.companyId = user.companyId;
      // request.body.userId = user.id;
      
      this.logger.debug(` Validação de tenant OK`);
    }

    // Valida companyId nos params (ex: /products/:companyId/...)
    if (request.params?.companyId && request.params.companyId !== user.companyId) {
      this.logger.error(
        ` User ${user.email} tentou aceder empresa ${request.params.companyId}`
      );
      this.logger.error(`   🏢 Empresa do user: ${user.companyId}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new ForbiddenException('Não pode aceder dados de outra empresa');
    }

    //  Disponibiliza companyId e userId diretamente no request (não no body)
    request.companyId = user.companyId;
    request.userId = user.id;
    
    this.logger.log(` Tenant OK - ${user.email} | Empresa: ${user.companyId}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    return true;
  }
}