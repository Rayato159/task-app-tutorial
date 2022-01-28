import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/signup.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt'
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    async signUp(signupUpDto: SignUpDto): Promise<User> {
        try {
            const {
                username,
                password,
            } = signupUpDto
    
            const hashedPassword = await bcrypt.hashSync(password, 10)
    
            const user = this.userRepository.create({
                username,
                password: hashedPassword,
            })
    
            return await this.userRepository.save(user)
        } catch(e) {
            throw new ConflictException({
                message: ['Username has been already using.']
            })
        }
    }

    async findOneUser(username: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ username })
        return user
    }
}
