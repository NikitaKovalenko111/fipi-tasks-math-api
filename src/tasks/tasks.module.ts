import { TaskSchema } from './../schemas/task.schema'
import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Task } from '../schemas/task.schema'
import { MulterModule } from '@nestjs/platform-express'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        MulterModule.register({ dest: './tasks' }),
    ],
    providers: [TasksService],
    controllers: [TasksController],
})
export class TasksModule {}
