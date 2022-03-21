import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupMap } from './entity/group.entity';
import { Repository, getRepository, Like } from 'typeorm';
import { GroupMessage } from './entity/groupMessage.entity';
import { CustomException } from '../../common/filters/CustomException';
import { RCode } from '../../common/constant';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(GroupMap)
        private readonly groupMapRepository: Repository<GroupMap>,
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>
    ) {}

    async postGroups(groupId: string) {
        try {
            if (!groupId) {
                throw new CustomException('缺少群id', RCode.FAIL);
            }
            const groupIdArr = groupId.split(',');
            const groupArr = [];
            for (const groupId of groupIdArr) {
                const data = await this.groupRepository.findOne({ groupId });
                groupArr.push(data);
            }
            return { msg: '获取群信息成功', data: groupArr };
        } catch (e) {
            throw new CustomException('获取群失败:' + e, RCode.FAIL);
        }
    }

    async getUserGroups(userId: string) {
        try {
            if (!userId) {
                throw new CustomException('缺少用户id', RCode.FAIL);
            }
            const data = await this.groupMapRepository.find({ userId });
            return { msg: '获取用户所有群成功', data };
        } catch (e) {
            throw new CustomException('获取用户的群失败:' + e, RCode.FAIL);
        }
    }

    async getGroupUsers(groupId: string) {
        try {
            if (!groupId) {
                throw new CustomException('缺少群id', RCode.FAIL);
            }
            let data = [];
            data = await this.groupMapRepository.find({ groupId });
            return { msg: '获取群的所有用户成功', data };
        } catch (e) {
            throw new CustomException('获取群的用户失败:' + e, RCode.FAIL);
        }
    }

    async getGroupMessages(groupId: string, current: number, pageSize: number) {
        let groupMessage = await getRepository(GroupMessage)
            .createQueryBuilder('groupMessage')
            .orderBy('groupMessage.time', 'DESC')
            .where('groupMessage.groupId = :id', { id: groupId })
            .skip(current)
            .take(pageSize)
            .getMany();
        groupMessage = groupMessage.reverse();
    }

    async getGroupsByName(groupName: string) {
        if (!groupName) {
            throw new CustomException('缺少群名称', RCode.FAIL);
        }
        try {
            const groups = await this.groupRepository.find({ groupName: Like(`%${groupName}%`) });
            return { msg: '查询成功', ata: groups };
        } catch (e) {
            throw new CustomException('查找群错误:' + e, RCode.FAIL);
        }
    }
}
