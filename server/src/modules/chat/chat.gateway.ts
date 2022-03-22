import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { User } from '../user/entity/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { RCode, SocketEventName } from '../../common/constant';
import { nameReg } from '../../common/tool/utils';
import { GroupMessageDto, FriendMessageDto, GroupDto, FriendDto, MessageDto } from './dto/index.dto';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { UserMap } from '../friend/entity/friend.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
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
        private readonly groupMessageRepository: Repository<GroupMessage>,
        @InjectRepository(UserMap)
        private readonly userMapRepository: Repository<UserMap>,
        @InjectRepository(FriendMessage)
        private readonly friendMessageRepository: Repository<FriendMessage>
    ) {}

    //socket连接钩子
    async handleConnection(client: Socket): Promise<string> {
        console.log('连接成功');
        const userRoom = client.handshake.query.userId;
        // 连接加入默认房间
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

    getRoomId(data: { userId: string; friendId: string }) {
        return data.userId > data.friendId ? data.userId + data.friendId : data.friendId + data.userId;
    }

    handleMessageType<T extends MessageDto>(data: T, id?: string): T {
        if (data.messageType === 'image') {
            const randomName = `${Date.now()}$${id}$${data.width}$${data.height}`;
            const stream = createWriteStream(join('public/static', randomName));
            stream.write(data.content);
            data.content = randomName;
        }
        return data;
    }

    //创建群组
    @SubscribeMessage(SocketEventName.ADDGROUP)
    async addGroup(@ConnectedSocket() client: Socket, @MessageBody() data: Group): Promise<any> {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        const emit = this.server.to(data.userId).emit;
        if (isUser) {
            const isHaveGroup = await this.groupRepository.findOne({ groupName: data.groupName });
            if (isHaveGroup) {
                emit(SocketEventName.ADDGROUP, { code: RCode.FAIL, msg: '该群名字已存在', data: isHaveGroup });
                return;
            }
            if (!nameReg.test(data.groupName)) {
                emit(SocketEventName.ADDFRIEND, { code: RCode.FAIL, msg: '群名不符合规则', data: isHaveGroup });
                return;
            }
            data = await this.groupRepository.save(data);
            client.join(data.groupId);
            return this.getActiveGroupUser();
        } else {
            emit(SocketEventName.ADDGROUP, { code: RCode.FAIL, msg: '你没资格创建群', data: '' });
        }
    }

    //加入群组
    @SubscribeMessage(SocketEventName.JOINGROUP)
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
                emit(SocketEventName.JOINGROUP, {
                    code: RCode.OK,
                    msg: `${isUser.userName}加入群${group.groupName}`,
                    data: res,
                });
                return this.getActiveGroupUser();
            } else {
                emit(SocketEventName.JOINGROUP, { code: RCode.FAIL, msg: '进群失败', data: '' });
            }
        } else {
            emit(SocketEventName.JOINGROUP, { code: RCode.FAIL, msg: '你没资格进群' });
        }
    }

    //加入群组socket连接
    @SubscribeMessage(SocketEventName.JOINGROUPSOCKET)
    async joinGroupSocket(@ConnectedSocket() client: Socket, @MessageBody() data: GroupMap): Promise<any> {
        const group = await this.groupRepository.findOne({ groupId: data.groupId });
        const user = await this.userRepository.findOne({ userId: data.userId });
        const emit = this.server.to(data.userId).emit;
        if (group && user) {
            client.join(data.groupId);
            const res = { group: group, user: user };
            emit(SocketEventName.JOINGROUPSOCKET, {
                code: RCode.OK,
                msg: `${user.userName}加入群${group.groupName}`,
                data: res,
            });
        } else {
            emit(SocketEventName.JOINGROUPSOCKET, { code: RCode.FAIL, msg: '进群失败', data: '' });
        }
    }

    //发送群消息
    @SubscribeMessage(SocketEventName.GROUPMESSAGE)
    async sendGroupMessage(@MessageBody() data: GroupMessageDto): Promise<any> {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        if (isUser) {
            const userGroupMap = await this.groupMapRepository.findOne({ userId: data.userId, groupId: data.groupId });
            if (!userGroupMap || !data.groupId) {
                this.server.to(data.userId).emit('groupMessage', { code: RCode.FAIL, msg: '群消息发送错误', data: '' });
                return;
            }
            data = this.handleMessageType(data, data.userId);
            data.time = new Date().valueOf();
            await this.groupMessageRepository.save(data);
            this.server.to(data.groupId).emit(SocketEventName.GROUPMESSAGE, { code: RCode.OK, msg: '', data: data });
        } else {
            this.server.to(data.userId).emit(SocketEventName.GROUPMESSAGE, { code: RCode.FAIL, msg: '你没资格发消息' });
        }
    }

    //添加好友
    @SubscribeMessage(SocketEventName.ADDFRIEND)
    async addFriend(@ConnectedSocket() client: Socket, @MessageBody() data: UserMap): Promise<any> {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        const userEmit = this.server.to(data.userId).emit;
        if (isUser && data.friendId) {
            const friendEmit = this.server.to(data.friendId).emit;
            if (data.userId === data.friendId) {
                userEmit(SocketEventName.ADDFRIEND, { code: RCode.FAIL, msg: '不能添加自己为好友', data: '' });
                return;
            }
            const relation = await this.userMapRepository.findOne({ userId: data.userId, friendId: data.friendId });
            if (relation) {
                userEmit(SocketEventName.ADDFRIEND, { code: RCode.FAIL, msg: '已经有该好友', data: '' });
                return;
            }
            const friend = await this.userRepository.findOne({ userId: data.friendId });
            if (!friend) {
                userEmit(SocketEventName.ADDFRIEND, { code: RCode.FAIL, msg: '该好友不存在', data: '' });
                return;
            }
            const user = await this.userRepository.findOne({ userId: data.userId });
            //双方都添加好友并存入数据库
            const roomId = this.getRoomId(data);
            data = await this.userMapRepository.save(data);
            const friendData = JSON.parse(JSON.stringify(data)) as UserMap;
            friendData.friendId = data.userId;
            friendData.userId = data.friendId;
            delete friendData._id;
            await this.userMapRepository.save(friendData);
            client.join(roomId);

            //如果是删除的好友重新加，重新获取一遍私聊消息
            let messages = await getRepository(FriendMessage)
                .createQueryBuilder('friendMessage')
                .orderBy('friendMessage.time', 'DESC')
                .where('friendMessage.userId=:userId AND friendMessage.friendId=:friendId', {
                    userId: data.userId,
                    friendId: data.friendId,
                })
                .orWhere('friendMessage.userId=:friendId AND friendMessage.friendId=:userId', {
                    userId: data.userId,
                    friendId: data.friendId,
                })
                .take(30)
                .getMany();
            messages = messages.reverse();

            userEmit(SocketEventName.ADDFRIEND, {
                code: RCode.OK,
                msg: `添加好友${friend.userName}成功`,
                data: messages,
            });
            friendEmit(SocketEventName.ADDFRIEND, {
                code: RCode.OK,
                msg: `${user.userName}添加你为好友`,
                data: messages,
            });
        } else {
            userEmit(SocketEventName.ADDFRIEND, { code: RCode.FAIL, msg: '你没资格加好友' });
        }
    }

    //加入私聊的socket连接
    @SubscribeMessage(SocketEventName.JOINFRIENDSOCKET)
    async joinFriendSocket(@ConnectedSocket() client: Socket, @MessageBody() data: UserMap): Promise<any> {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        if (isUser && data.friendId) {
            const roomId = this.getRoomId(data);
            const relation = this.userMapRepository.findOne({ userId: data.userId, friendId: data.friendId });
            if (relation) {
                client.join(roomId);
                this.server.to(data.userId).emit(SocketEventName.JOINFRIENDSOCKET, {
                    code: RCode.OK,
                    msg: '进入私聊socket成功',
                    data: relation,
                });
            }
        }
    }

    //发送私聊消息
    @SubscribeMessage(SocketEventName.FRIENDMESSAGE)
    async friendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: FriendMessageDto): Promise<any> {
        if (data.userId && data.friendId) {
            const roomId = this.getRoomId(data);
            data = this.handleMessageType(data, roomId);
            data.time = new Date().valueOf();
            data = await this.friendMessageRepository.save(data);
            this.server.to(roomId).emit(SocketEventName.FRIENDMESSAGE, { code: RCode.OK, msg: '', data });
        } else {
            this.server
                .to(data.userId)
                .emit(SocketEventName.FRIENDMESSAGE, { code: RCode.FAIL, msg: '你没资格发消息', data });
        }
    }

    //获取所有群和好友数据
    @SubscribeMessage(SocketEventName.CHATDATA)
    async getAllData(@ConnectedSocket() client: Socket, @MessageBody() user: User): Promise<any> {
        const isUser = await this.userRepository.findOne({ userId: user.userId });
        if (isUser) {
            const userGather: { [key: string]: User } = {};
            let userArr: Array<FriendDto> = [];

            const groupMap: Array<GroupMap> = await this.groupMapRepository.find({ userId: user.userId });
            const friendMap: Array<UserMap> = await this.userMapRepository.find({ userId: user.userId });

            const groupPromise = groupMap.map(async (item) => {
                return await this.groupRepository.findOne({ groupId: item.groupId });
            });
            const groupMessagePromise = groupMap.map(async (item) => {
                let groupMessage = await getRepository(GroupMessage)
                    .createQueryBuilder('groupMessage')
                    .orderBy('groupMessage.time', 'DESC')
                    .where('groupMessage.groupId=:id', { id: item.groupId })
                    .take(30)
                    .getMany();
                groupMessage = groupMessage.reverse();
                //这里获取发送消息的用户信息
                for (const message of groupMessage) {
                    if (!userGather[message.userId]) {
                        userGather[message.userId] = await this.userRepository.findOne({ userId: message.userId });
                    }
                }
                return groupMessage;
            });

            const friendPromise = friendMap.map(async (item) => {
                return await this.userRepository.findOne({ userId: item.userId });
            });

            const friendMessagePromise = friendMap.map(async (item) => {
                const message = await getRepository(FriendMessage)
                    .createQueryBuilder('friendMessage')
                    .orderBy('friendMessage.time', 'DESC')
                    .where('friendMessage.userId=:userId AND friendMessage.friendId=:friendId', {
                        userId: item.userId,
                        friendId: item.friendId,
                    })
                    .orWhere('friendMessage.userId=:friendId friendMessage.friendId=:userId', {
                        userId: item.userId,
                        friendId: item.friendId,
                    })
                    .take(30)
                    .getMany();
                return message.reverse();
            });

            const groups: Array<GroupDto> = await Promise.all(groupPromise);
            const groupsMessage: Array<Array<GroupMessageDto>> = await Promise.all(groupMessagePromise);

            groups.map((item, RCode) => {
                if (groupsMessage[RCode] && groupsMessage[RCode].length) {
                    item.messages = groupsMessage[RCode];
                }
            });

            const friends: Array<FriendDto> = await Promise.all(friendPromise);
            const friendsMessage: Array<Array<FriendMessageDto>> = await Promise.all(friendMessagePromise);

            friends.map((item, RCode) => {
                if (friendsMessage[RCode] && friendsMessage[RCode].length) {
                    item.messages = friendsMessage[RCode];
                }
            });
            userArr = [...Object.values(userGather), ...friends];
            this.server.to(user.userId).emit(SocketEventName.CHATDATA, {
                code: RCode.OK,
                msg: '获取聊天数据成功',
                data: {
                    groupData: groups,
                    friendData: friends,
                    userData: userArr,
                },
            });
        }
    }

    //删除群
    @SubscribeMessage(SocketEventName.EXITGROUP)
    async exitGroup(@ConnectedSocket() client: Socket, @MessageBody() groupMap: GroupMap): Promise<any> {
        const userEmit = this.server.to(groupMap.userId).emit;
        if (groupMap.groupId === this.defaultGroup) {
            return userEmit('exitGroup', { code: RCode.FAIL, msg: '默认群不可退' });
        }
        const user = await this.userRepository.findOne({ userId: groupMap.userId });
        const map = await this.groupRepository.findOne({ groupId: groupMap.groupId });
        const group = await this.groupMapRepository.findOne({ userId: groupMap.userId, groupId: groupMap.groupId });
        if (user && map && group) {
            await this.groupMapRepository.remove(groupMap);
            userEmit(SocketEventName.EXITGROUP, { code: RCode.OK, msg: '退群成功', data: groupMap });
            return this.getActiveGroupUser();
        }
        userEmit('exit', { code: RCode.FAIL, msg: '退群失败', data: '' });
    }

    //删除好友
    @SubscribeMessage(SocketEventName.EXITFRIEND)
    async exitFriend(@ConnectedSocket() client: Socket, @MessageBody() userMap: UserMap): Promise<any> {
        const user = await this.userRepository.findOne({ userId: userMap.userId });
        const friend = await this.userRepository.findOne({ userId: userMap.friendId });
        const map1 = await this.userMapRepository.findOne({ userId: userMap.userId, friendId: userMap.friendId });
        const map2 = await this.userMapRepository.findOne({ userId: userMap.friendId, friendId: userMap.userId });
        const userEmit = this.server.to(userMap.userId).emit;

        if (user && friend && map1 && map2) {
            await this.userMapRepository.remove(map1);
            await this.userMapRepository.remove(map2);
            return userEmit(SocketEventName.EXITFRIEND, { code: RCode.OK, msg: '删好友成功', data: userMap });
        }
        return userEmit(SocketEventName.EXITFRIEND, { code: RCode.FAIL, msg: '删好友失败' });
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
