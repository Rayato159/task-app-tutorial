import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async createTask (createTaskDto: CreateTaskDto): Promise<Task> {
        const {
            title,
            description,
        } = createTaskDto

        const task = this.taskRepository.create({
            title,
            description,
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

    async getTasks(): Promise<Task[]> {
        try {
            const tasks = await this.taskRepository.find()
            return tasks
        } catch(e) {
            throw new NotFoundException({
                message: ['Task not found.']
            })
        }
    }

    async getTaskById(id: string): Promise<Task> {
        try {
            const task = await this.taskRepository.findOne(id)
            return task
        } catch(e) {
            throw new NotFoundException({
                message: ['Task not found.']
            })
        }
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
        try {
            const task = await this.getTaskById(id)

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

    async deleteTask(id: string) {
        try {
            const task = await this.getTaskById(id)
            await this.taskRepository.delete(id)
            return task
        } catch(e) {
            throw new NotFoundException({
                message: ['Never gonna give you up.']
            })
        }
    }
}
