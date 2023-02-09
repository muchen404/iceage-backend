import { CacheModule, CacheStore, Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { getConfig } from './utils'
import { redisStore } from 'cache-manager-redis-store'

const redisConfig = getConfig('REDIS_CONFIG')
@Module({
  imports: [ 
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
    ConfigModule.forRoot({ 
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig]
    }), 
    UserModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
