// 服务端返回值格式
interface ServerRes {
  code: number;
  msg: string;
  data: any;
}

// 所有群的群信息
interface GroupGather {
  [groupId: string]: Group;
}

// 所有好友的好友信息
interface FriendGather {
  [userId: string]: Friend;
}

// 未读消息对象
interface UnReadGather {
  [key: string]: number;
}

//所有的群在线用户
interface activeGroupUser {
  [key: string]: {
    [key: string]: User;
  };
}

// 群组
interface Group {
  groupId: string;
  userId: string; // 群主id
  groupName: string;
  notice: string;
  messages?: GroupMessage[];
  createTime: number;
}

// 群消息
interface GroupMessage {
  userId: string;
  groupId: string;
  content: string;
  messageType: MessageType;
  time: number;
}

// 消息类型
declare enum MessageType {
  text = 'text',
  image = 'image',
}

// 好友
interface Friend {
  userId: string;
  username: string;
  avatar: string;
  role?: string;
  tag?: string;
  messages?: FriendMessage[];
  createTime: number;
}

// 好友消息
interface FriendMessage {
  userId: string;
  friendId: string;
  content: string;
  messageType: MessageType;
  time: number;
  type?: string;
}
