import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto)
    }

    @Get()
    getTasks(): Promise<Task[]> {
        return this.taskService.getTasks()
    }

    @Get(':id')
    getTaskById(
        @Param('id') id: string,
    ): Promise<Task> {
        return this.taskService.getTaskById(id)
    }

    @Patch(':id/update')
    updateTask(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
        return this.taskService.updateTask(id, updateTaskDto)
    }

    @Delete(':id/delete')
    deleteTask(
        @Param('id') id: string,
    ): Promise<Task> {
        return this.taskService.deleteTask(id)
    }
}