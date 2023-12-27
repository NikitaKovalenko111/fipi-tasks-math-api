import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { MongooseModule } from '@nestjs/mongoose'
import { TasksModule } from './tasks/tasks.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'tasks'),
        }),
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.CONNECTION_URL),
        TasksModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
