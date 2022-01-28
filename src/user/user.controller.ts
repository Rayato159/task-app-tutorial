import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    signUp(
        @Body() signUpDto: SignUpDto
    ): Promise<User> {
        return this.userService.signUp(signUpDto)
    }
}
