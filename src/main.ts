import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { VersioningType, ValidationPipe, VERSION_NEUTRAL } from '@nestjs/common'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/exceptions/base.exceptions.filter'
import { HttpExceptionFilter } from './common/exceptions/http.exceptions.filter'
import { generateDocument } from './doc'

const PORT = 14000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
    type: VersioningType.URI
  })

  // 启动全局字段校验，保证请求接口字段校验正确。
  app.useGlobalPipes(new ValidationPipe())

  generateDocument(app)

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter()
  )

  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(PORT)
}
bootstrap()
