import { Controller, Get } from '@nestjs/common'
import { BusinessException } from 'src/common/exceptions/business.exceptions'


@Controller('user')
export class UserController {

  @Get()
  test() {
    return 'hello user'
  }

  @Get('err')
  throwError() {
    throw new BusinessException('你这个参数错了')
  }
}