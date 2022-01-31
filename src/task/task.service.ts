import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async createTask (createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {
            title,
            description,
        } = createTaskDto

        const task = this.taskRepository.create({
            title,
            description,
            user,
        })

        try {
            await this.taskRepository.save(task)
            return task
        } catch(e) {
            throw new ConflictException({
                message: ['Something\s wrong I can feel it.']
            })
        }
    }

    async getTasks(user: User, searchTasksDto: SearchTasksDto): Promise<Task[]> {
        try {
            const {
                search
            } = searchTasksDto

            const query = this.taskRepository.createQueryBuilder('task')
            query.where({ user })

            if(search) {
                query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', 
                { search: `%${search}%` })
            }

            const tasks = await query.getMany()
            return tasks
        } catch(e) {
            throw new NotFoundException({
                message: ['Task not found.']
            })
        }
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        try {
            const task = await this.taskRepository.findOne({ where: { user, id } })
            return task
        } catch(e) {
            throw new NotFoundException({
                message: ['Task not found.']
            })
        }
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User) {
        try {
            const task = await this.getTaskById(id, user)

            const {
                title,
                description,
            } = updateTaskDto

            if(title) {
                task.title = title
            }

            if(description) {
                task.description = description
            }

            await this.taskRepository.save(task)
            return task

        } catch(e) {
            throw new NotFoundException({
                message: ['Task not found.']
            })
        }
    }

    async deleteTask(id: string, user: User) {
        try {
            const task = await this.getTaskById(id, user)
            await this.taskRepository.delete(id)
            return task
        } catch(e) {
            throw new NotFoundException({
                message: ['Never gonna give you up.']
            })
        }
    }
}
