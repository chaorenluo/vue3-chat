import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { CustomException } from './CustomException';
import { RCode } from '../constant';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let errorResponse: any;
        const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
        if (exception instanceof CustomException) {
            // 自定义异常
            errorResponse = {
                code: exception.getErrorCode(), // 错误code
                msg: exception.getErrorMessage(),
                message: 'error',
                url: request.originalUrl, // 错误的url地址
                date: date,
            };
        } else {
            // 非自定义异常
            errorResponse = {
                code: exception.getStatus(), // 错误code
                msg: exception.message,
                url: request.originalUrl, // 错误的url地址
                date: date,
            };
        }
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status);
        if (errorResponse.code === 401) {
            errorResponse.msg = '身份过期，请重新登录';
            response.status(200);
            errorResponse.code = 401;
        }
        response.header('Content-Type', 'application/json; charset=utf-8');
        response.send(errorResponse);
        console.log(`=-=-=-=-=-=-=-=-=-=-=[error:${errorResponse.url}]=-=-=-=-=-=-=-=-=-=-=`);
        console.log(errorResponse);
    }
}
