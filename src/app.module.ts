import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UsersController } from './modules/users/users.controller';
import { FilesModule } from './modules/files/files.module';
@Module({
  imports: [AuthModule, UsersModule, FilesModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
