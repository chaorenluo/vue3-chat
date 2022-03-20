import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { GroupModule } from './modules/group/group.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            port: 3306,
            username: 'root',
            password: '231195@Luo',
            database: 'chat',
            charset: 'utf8mb4', // 设置chatset编码为utf8mb4
            autoLoadEntities: true,
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        GroupModule,
    ],
})
export class AppModule {}
