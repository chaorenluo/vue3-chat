export enum RCode {
    OK,
    FAIL,
    ERROR,
}

export enum SocketEventName {
    ADDGROUP = 'addGroup',
    JOINGROUP = 'joinGroup',
    JOINGROUPSOCKET = 'joinGroupSocket',
    GROUPMESSAGE = 'groupMessage',
    ADDFRIEND = 'addFriend',
    JOINFRIENDSOCKET = 'joinFriendSocket',
    FRIENDMESSAGE = 'friendMessage',
    CHATDATA = 'chatData',
    EXITGROUP = 'exitGroup',
    EXITFRIEND = 'exitFriend',
}
