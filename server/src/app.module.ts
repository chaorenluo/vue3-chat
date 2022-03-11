import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'chat',
            charset: 'utf8mb4', // 设置chatset编码为utf8mb4
            autoLoadEntities: true,
            synchronize: true,
        }),
        UserModule,
    ],
})
export class AppModule {}
