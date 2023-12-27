import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
    Query,
} from '@nestjs/common'
import { IResponseGetTasks, TasksService } from './tasks.service'
import { Task } from '../schemas/task.schema'
import { Types } from 'mongoose'
import { postTaskDtoType } from './dto/postTaskDto.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as uniqid from 'uniqid'
import { Query as QueryType } from 'express-serve-static-core'

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() query: QueryType): Promise<IResponseGetTasks> {
        return this.tasksService.getTasksService(query)
    }

    @Get('/:id')
    getTaskById(@Param('id') id: Types.ObjectId): Promise<Task> {
        return this.tasksService.getTaskByIdService(id)
    }

    @Post('/')
    @UseInterceptors(
        FileInterceptor('taskImage', {
            storage: diskStorage({
                destination: './tasks',
                filename: (req, file, callback) => {
                    const fileName: string = uniqid(
                        `${req.body.taskNumber}_`,
                        '.png',
                    )

                    callback(null, fileName)
                },
            }),
        }),
    )
    postTask(
        @Body() postTaskDto: postTaskDtoType,
        @UploadedFile() taskImage: Express.Multer.File,
    ): Promise<Task> {
        return this.tasksService.postTaskService(postTaskDto, taskImage)
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: Types.ObjectId): Promise<Task> {
        return this.tasksService.deleteTaskService(id)
    }
}
