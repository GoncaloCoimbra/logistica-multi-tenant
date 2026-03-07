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

    this.logger.log(` TenantGuard - ${method} ${url}`);

    if (!user) {
      this.logger.error(' Usuário não autenticado');
      throw new ForbiddenException('Usuário não autenticado');
    }

    // SUPER_ADMIN tem acesso total
    if (user.role === Role.SUPER_ADMIN) {
      this.logger.log('SUPER_ADMIN - acesso total');
      return true;
    }

    // Valida se usuário tem companyId
    if (!user.companyId) {
      this.logger.error(` User ${user.email} sem empresa associada`);
      throw new ForbiddenException('Utilizador sem empresa associada');
    }

    // Injeta companyId no body (POST/PATCH/PUT)
    if (['POST', 'PATCH', 'PUT'].includes(method) && request.body) {
      // Valida se está a tentar manipular dados de outra empresa
      if (request.body.companyId && request.body.companyId !== user.companyId) {
        this.logger.error(
          ` User ${user.email} tentou manipular empresa ${request.body.companyId}`
        );
        throw new ForbiddenException('Não pode manipular dados de outra empresa');
      }
      
      // Força companyId do utilizador
      request.body.companyId = user.companyId;
      this.logger.debug(`CompanyId injetado: ${user.companyId}`);
    }

    // Valida companyId nos params (GET/DELETE com :companyId na rota)
    if (request.params?.companyId && request.params.companyId !== user.companyId) {
      this.logger.error(
        ` User ${user.email} tentou aceder empresa ${request.params.companyId}`
      );
      throw new ForbiddenException('Não pode aceder dados de outra empresa');
    }

    // Disponibiliza companyId directamente no request
    request.companyId = user.companyId;
    
    this.logger.log(`Tenant OK - ${user.email} | Empresa: ${user.companyId}`);
    return true;
  }
}