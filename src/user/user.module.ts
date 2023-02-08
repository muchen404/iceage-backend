import { Module, forwardRef } from '@nestjs/common'
import { UserController } from './user.controller'
import { FeishuService } from './feishu/feishu.service'
import { FeishuController } from './feishu/feishu.controller'

@Module({
  controllers: [ UserController, FeishuController ],
  providers: [FeishuService]
})
export class UserModule {}