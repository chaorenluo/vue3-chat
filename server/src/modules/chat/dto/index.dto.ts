export interface MessageDto {
    userId: string;
    content: string;
    width?: number;
    height?: number;
    messageType: string;
    time: number;
}

export interface FriendMessageDto extends MessageDto {
    friendId: string;
}

export interface GroupMessageDto extends MessageDto {
    groupId: string;
}

// 群组
export interface GroupDto {
    groupId: string;
    userId: string; // 群主id
    groupName: string;
    notice: string;
    messages?: Array<GroupMessageDto>;
    createTime: number;
}

// 好友
export interface FriendDto {
    userId: string;
    userName: string;
    avatar: string;
    role?: string;
    tag?: string;
    messages?: FriendMessageDto[];
    createTime: number;
}
