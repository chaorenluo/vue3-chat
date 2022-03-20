import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { RCode } from '../../common/constant/rcode';
import { nameReg } from '../../common/tool/utils';

@WebSocketGateway()
export class ChatGateway {
    // 默认群
    defaultGroup = '阿童木聊天室';

    @WebSocketServer()
    server: Server;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(GroupMap)
        private readonly groupMapRepository: Repository<GroupMap>,
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>
    ) {}

    //socket连接钩子
    async handleConnection(client: Socket): Promise<string> {
        const userRoom = client.handshake.query.userId;
        // 连接默认加入"阿童木聊天室"房间
        client.join(this.defaultGroup);
        //统计在线人数并发送事件
        this.getActiveGroupUser();
        //用户独有的消息房间 根据userId
        if (userRoom) {
            client.join(userRoom);
        }
        return '连接成功';
    }

    //socket断开钩子
    async handleDisconnect(): Promise<any> {
        return this.getActiveGroupUser();
    }

    //创建群组
    @SubscribeMessage('addGroup')
    async addGroup(@ConnectedSocket() client: Socket, @MessageBody() data: Group): Promise<any> {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        const emit = this.server.to(data.userId).emit;
        if (isUser) {
            const isHaveGroup = await this.groupRepository.findOne({ groupName: data.groupName });
            if (isHaveGroup) {
                emit('addGroup', { code: RCode.FAIL, msg: '该群名字已存在', data: isHaveGroup });
                return;
            }
            if (!nameReg.test(data.groupName)) {
                emit('addGroup', { code: RCode.FAIL, msg: '群名不符合规则', data: isHaveGroup });
                return;
            }
            data = await this.groupRepository.save(data);
            client.join(data.groupId);
            this.getActiveGroupUser();
        } else {
            emit('addGroup', { code: RCode.FAIL, msg: '群名不符合规则', data: null });
        }
    }

    //加入群组
    @SubscribeMessage('joinGroup')
    async joinGroup(@ConnectedSocket() client: Socket, @MessageBody() data: GroupMap): Promise<any> {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        const emit = this.server.to(data.userId).emit;
        if (isUser) {
            const group = await this.groupRepository.findOne({ groupId: data.groupId });
            let userGroup = await this.groupMapRepository.findOne({ groupId: group.groupId, userId: data.userId });

            if (group && isUser) {
                if (!userGroup) {
                    userGroup = await this.groupMapRepository.save(data);
                }
                client.join(data.groupId);
                const res = { group, isUser };
                emit('joinGroup', { code: RCode.OK, msg: `${isUser.userName}加入群${group.groupName}` });
                this.getActiveGroupUser();
            } else {
                emit('joinGroup', { code: RCode.FAIL, msg: '进群失败', data: '' });
            }
        } else {
            emit('joinGroup', { code: RCode.FAIL, msg: '你没资格进群' });
        }
    }

    //加入群组socket连接
    @SubscribeMessage('joinGroupSocket')
    async joinGroupSocket(@ConnectedSocket() client: Socket, @MessageBody() data: GroupMap): Promise<any> {
        const group = await this.groupRepository.findOne({ groupId: data.groupId });
        const user = await this.userRepository.findOne({ userId: data.userId });
        const emit = this.server.to(data.userId).emit;
        if (group && user) {
            client.join(data.groupId);
            const res = { group: group, user: user };
            emit('joinGroupSocket', { code: RCode.OK, msg: `${user.userName}加入群${group.groupName}`, data: res });
        } else {
            emit('joinGroupSocket', { code: RCode.FAIL, msg: '进群失败', data: '' });
        }
    }

    //获取当前每个群在线人数以及在线人的用户信息
    async getActiveGroupUser() {
        //从socket找到连接人数
        let userIdArr = Object.values(this.server.engine.clients).map((item: any) => {
            return item.request._query.userId;
        });
        userIdArr = Array.from(new Set(userIdArr));
        const activeGroupUserGather = {};
        for (const userId of userIdArr) {
            const userGroupArr = await this.groupMapRepository.find({ userId });
            const user = await this.userRepository.findOne({ userId });
            if (user && userGroupArr.length) {
                userGroupArr.map((item) => {
                    let data = activeGroupUserGather[item.groupId];
                    if (data) {
                        data = {};
                    }
                    data[userId] = user;
                });
            }
        }
        //网当前房间里面发射一个事件
        this.server.to(this.defaultGroup).emit('activeGroupUser', {
            msg: 'activeGroupUser',
            data: activeGroupUserGather,
        });
    }
}
