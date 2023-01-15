/* eslint-disable prettier/prettier */
import * as common from '@nestjs/common';
import { Observable } from 'rxjs';

@common.Injectable()
export class RolesGuard implements common.CanActivate {
  canActivate( context: common.ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {

    return true;
  }
}