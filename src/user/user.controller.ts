import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException } from '@/common/exceptions/business.exception'


@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService
  ) {}

  @Get()
  test() {
    return `hello user = ${this.configService.get('TEST_VALUE').name}`
  }

  @Get('err')
  throwError() {
    throw new BusinessException('你这个参数错了')
  }
}