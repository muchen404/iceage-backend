import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ServiceUnavailableException,
  LoggerService,
  HttpAdapterHost,
  HttpException,
} from '@nestjs/common'
import * as requestIp from 'request-ip'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const httpStatus = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR

    const msg: unknown = exception['response'] || 'Internal Server Error'

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: msg
    }

    this.logger.error('[ICEAGE]', responseBody)

    // 非 HTTP 标准异常的处理。
    // response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
    //   statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   message: new ServiceUnavailableException().getResponse(),
    // })
    httpAdapter.reply(response, responseBody, httpStatus)
  }
  
}