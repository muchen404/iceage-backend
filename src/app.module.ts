import { CacheModule, CacheStore, Global, Logger, Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { getConfig } from './utils'
import { redisStore } from 'cache-manager-redis-store'
import { LogsModule } from '@/common/logs/logs.module'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from '@/common/filters/http.exception.filter'
import AllExceptionFilter from './common/filters/all.exception.filter'
import { UnifyResponseInterceptor } from './common/interceptors/unity-interceptor'
import LoggerMiddleware from '@/common/logs/logs.middleware'


const redisConfig = getConfig('REDIS_CONFIG')

@Global()
@Module({
  imports: [ 
    ConfigModule.forRoot({ 
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig]
    }),
    CacheModule.registerAsync({ 
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: redisConfig.host,
            port: redisConfig.port
          },
          password: redisConfig.auth
        })
        return {
          store: store as unknown as CacheStore,
          ttl: 60 * 60 * 24 * 7
        }
      }
    }),
    UserModule, 
    LogsModule 
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    // 应用拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifyResponseInterceptor,
    },
  ],
  exports: [Logger]
})
export class AppModule {
  // 应用全局中间件
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
