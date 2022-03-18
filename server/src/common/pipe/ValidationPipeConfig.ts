import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CustomException } from '../filters/CustomException';
import { RCode } from '../constant/rcode';

@Injectable()
export class ValidationPipeConfig implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype as any)) {
            return value;
        }
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const errorMessageList = [];
            errors.map((item) => {
                const errorsObj = item.constraints;
                for (const key in errorsObj) {
                    errorMessageList.push(errorsObj[key]);
                }
            });
            throw new CustomException(errorMessageList.join(','), RCode.FAIL, HttpStatus.OK);
        }
        return value;
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}
