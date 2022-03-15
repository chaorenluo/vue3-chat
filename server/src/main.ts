import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { logger } from './common/middleware/logger.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { ValidationPipeConfig } from './common/pipe/ValidationPipeConfig';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    //全局中间件
    app.use(logger);

    // 全局异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter());

    // 配置全局拦截器 拦截返回值
    app.useGlobalInterceptors(new ResponseInterceptor());

    // 全局使用管道验证参数
    app.useGlobalPipes(new ValidationPipeConfig());

    // 配置静态资源
    app.useStaticAssets(join(__dirname, '../public', '/'), {
        prefix: '/',
        setHeaders: (res) => {
            res.set('Cache-Control', 'max-age=2592000');
        },
    });

    await app.listen(3001);
}
bootstrap()
    .then(() => {
        console.log('启动成功');
    })
    .catch((err) => {
        console.log('启动失败---', err);
    });
