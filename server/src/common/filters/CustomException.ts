export class errorResponse {}

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 自定义异常
 */
export class CustomException extends HttpException {
    private readonly errorMessage: string;
    private readonly errorCode: number;

    constructor(errorMessage: string, errorCode: number, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
        super(errorMessage, statusCode);

        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
    }

    getErrorCode(): number {
        return this.errorCode;
    }

    getErrorMessage(): string {
        return this.errorMessage;
    }
}
