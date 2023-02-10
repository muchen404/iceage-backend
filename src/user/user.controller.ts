import { Body, Controller, Get, Inject, Logger, LoggerService, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException } from '@/common/exceptions/business.exception'
import { UserService } from './user.service'
import { ApiOperation } from '@nestjs/swagger'
import { AddUserDto } from './user.dto'


@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject(Logger) private readonly logger: LoggerService
  ) {}

  @Get()
  test() {
    return `hello user = ${this.configService.get('TEST_VALUE').name}`
  }

  @Get('err')
  throwError() {
    throw new BusinessException('你这个参数错了')
  }

  @ApiOperation({
    summary: '新增用户',
  })
  @Post('/add')
  create(@Body() user: AddUserDto) {
    console.log('....', user)
    return this.userService.createOrSave(user)
  }
}