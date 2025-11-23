import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    console.error('Error:', exception);

    // HTTP Exception (API Gateway local)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res?.message ?? res ?? message;
    }

    // RPC Exception wrapper
    else if (exception instanceof RpcException) {
      const err: any = exception.getError();

      if (err instanceof HttpException) {
        status = err.getStatus();
        const res = err.getResponse() as any;
        message = res?.message ?? res ?? message;
      } else if (typeof err === 'object' && err !== null) {
        status =
          err.statusCode ?? err.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        message = err.message ?? message;
      } else if (typeof err === 'string') {
        message = err;
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    // Deserialized HttpException coming from microservice
    else if (
      exception &&
      typeof exception === 'object' &&
      (exception as any).response &&
      (exception as any).status
    ) {
      const err = exception as any;

      status =
        err.response?.statusCode ??
        err.status ??
        HttpStatus.INTERNAL_SERVER_ERROR;

      message = err.response?.message ?? err.message ?? message;
    }

    // Normal JS Error
    else if (exception instanceof Error) {
      message = exception.message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // Deserialized Rpc
    else if (exception.statusCode && exception.message) {
      status = exception.statusCode;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
