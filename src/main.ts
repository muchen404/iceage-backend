import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { VersioningType, ValidationPipe, VERSION_NEUTRAL } from '@nestjs/common'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/filters/base.exceptions.filter'
import { HttpExceptionFilter } from './common/filters/http.exception.filter'
import { generateDocument } from './doc'
import { getConfig } from './utils'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

const PORT: number = getConfig('RUN_PORT')
const GLOBAL_PREFIX: string = getConfig('GLOBAL_PREFIX')

async function bootstrap() {

  const app = await NestFactory.create(AppModule)

  // 添加url前缀
  app.setGlobalPrefix(GLOBAL_PREFIX)

  // 开启版本控制
  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL],
    type: VersioningType.URI
  })

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  // 启动全局字段校验，保证请求接口字段校验正确。
  app.useGlobalPipes(new ValidationPipe())

  // 生成文档
  generateDocument(app)

  // 添加全局过滤器
  // app.useGlobalFilters(
  //   new AllExceptionsFilter(),
  //   new HttpExceptionFilter()
  // )
  
  // 添加全局拦截器
  // app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(PORT)
}
bootstrap()
