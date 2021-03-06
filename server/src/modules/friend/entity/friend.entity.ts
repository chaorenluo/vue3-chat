import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserMap {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    friendId: string;

    @Column()
    userId: string;
}
