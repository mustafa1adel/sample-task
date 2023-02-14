import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUSerDto } from './dtos/update-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guards';
import { Serialize } from '../interceptors/serialize.interceptor';
import { LoginUserDto } from './dtos/login-user.dto';
import { UserDto } from './dtos/user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Serialize(UserDto)
@ApiTags('account')
@ApiBearerAuth()
@Controller('account')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Get('/get-profile-data')
  @ApiOkResponse({ type: User })
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @ApiOkResponse({ type: User })
  @ApiBody({ type: CreateUserDto })
  @Post('/update-profile-info')
  updateUser(@Session() session: any, @Body() body: UpdateUSerDto) {
    return this.authService.update(session.userId, body);
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @ApiOkResponse({ description: 'login with an existing user', type: User })
  @Post('/signin')
  async singin(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/singout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
}
