import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { VersioningType } from '@nestjs/common'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/exceptions/base.exceptions.filter'
import { HttpExceptionFilter } from './common/exceptions/http.exceptions.filter'
import { generateDocument } from './doc'

const PORT = 14000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  })

  generateDocument(app)

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter()
  )

  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(PORT)
}
bootstrap()
