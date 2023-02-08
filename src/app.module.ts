import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { getConfig } from './utils'

@Module({
  imports: [ 
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
