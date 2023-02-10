import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { getReqMainInfo } from '@/utils'

@Injectable()
export class UnifyResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    return next.handle().pipe(
      map((data) => {
        const responseBody = {
          data,
          status: 0,
          extra: {},
          message: '请求成功',
          success: true,
        }
        
        this.logger.info('[ RESPONSE ]', { req: getReqMainInfo(req), responseData: responseBody})
        return responseBody
      }),
    )
  }
}