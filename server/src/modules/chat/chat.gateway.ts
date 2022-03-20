import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';

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
        private readonly groupMapRepository: Repository<Group>,
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>
    ) {}

    //socket连接钩子
    async handleConnection(client: Socket): Promise<string> {
        const userRoom = client.handshake.query.userId;
        // 连接默认加入"阿童木聊天室"房间
        client.join(this.defaultGroup);
    }

    //获取在线人数
    async getActiveGroupUser() {}
}
