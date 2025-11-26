import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.error(err);
        if (err instanceof RpcException) {
          return throwError(() => err);
        }

        // Look like HttpException
        if (err?.response && err?.status) {
          return throwError(
            () =>
              new RpcException({
                statusCode: err.response.statusCode ?? err.status,
                message: err.response.message ?? err.message,
              }),
          );
        }

        // Rest
        return throwError(
          () =>
            new RpcException({
              statusCode: 500,
              message: err?.message ?? 'Internal error in CombatService',
            }),
        );
      }),
    );
  }
}
