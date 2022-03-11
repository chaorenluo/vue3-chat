import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ default: '鸡哥' })
    userName: string;

    @Column({ default: '123456', select: false })
    password: string;

    @Column({ default: 'chenguanxi.png' })
    avatar: string;

    @Column({ default: 'on' })
    role: string;

    @Column({ default: '' })
    tag: string;

    @Column({ type: 'double', default: new Date().valueOf() })
    createTime: number;
}
