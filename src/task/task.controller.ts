import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request, UseInterceptors, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guards';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskInterceptor } from './interceptors/task.interceptor';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TaskInterceptor)
    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @Request() { user }: any,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getTasks(
        @Request() { user }: any,
        @Query() searchTasksDto: SearchTasksDto,
    ): Promise<Task[]> {
        return this.taskService.getTasks(user, searchTasksDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getTaskById(
        @Param('id') id: string,
        @Request() { user }: any,
    ): Promise<Task> {
        return this.taskService.getTaskById(id, user)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/update')
    updateTask(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() { user }: any,
    ): Promise<Task> {
        return this.taskService.updateTask(id, updateTaskDto, user)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/delete')
    deleteTask(
        @Param('id') id: string,
        @Request() { user }: any,
    ): Promise<Task> {
        return this.taskService.deleteTask(id, user)
    }
}