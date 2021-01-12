import { calculateUnreadMessages, sortMessages, getUpdatedDialog } from './dialogsDataActions'

const userDialogs = [
    {
        dialogId: "dialog_1",
        unreadMessages: 1,
        members: [
            {
                avatar: "https://cdn.iconscout.com/icon/free/png-256/avatar-375-456327.png",
                currentDialogs: { 'dialog_1': 'dialog_1', 'dialog_2': 'dialog_2' },
                id: "user_id_1",
                name: "Test_1",
                phoneNumber: "+380950000001"
            },
            {
                avatar: "https://cdn.iconscout.com/icon/free/png-256/avatar-375-456327.png",
                currentDialogs: { 'dialog_1': 'dialog_1' },
                id: "user_id_2",
                name: "Test_2",
                phoneNumber: "+380950000002"
            }
        ],
        messages: [
            {
                id: "1",
                isDelivered: true,
                isRead: true,
                message: "TEST1",
                time: "2020-12-18T21:05:27+02:00",
                userId: "user_id_1"
            },
            {
                id: "2",
                isDelivered: false,
                isRead: false,
                message: "TEST2",
                time: "2020-12-18T21:07:27+02:00",
                userId: "user_id_2"
            }
        ]
    },
    {
        dialogId: "dialog_2",
        unreadMessages: 0,
        members: [
            {
                avatar: "https://cdn.iconscout.com/icon/free/png-256/avatar-375-456327.png",
                currentDialogs: { 'dialog_1': 'dialog_1', 'dialog_2': 'dialog_2' },
                id: "user_id_1",
                name: "Test_1",
                phoneNumber: "+380950000001"
            },
            {
                avatar: "https://cdn.iconscout.com/icon/free/png-256/avatar-375-456327.png",
                currentDialogs: { 'dialog_2': 'dialog_2' },
                id: "user_id_3",
                name: "Test_3",
                phoneNumber: "+380950000003"
            }
        ],
        messages: [
            {
                id: "3",
                isDelivered: true,
                isRead: true,
                message: "TEST1",
                time: "2020-12-18T21:05:27+02:00",
                userId: "user_id_1"
            },
            {
                id: "4",
                isDelivered: true,
                isRead: true,
                message: "TEST2",
                time: "2020-12-18T21:07:27+02:00",
                userId: "user_id_3"
            }
        ]
    }
];

describe('Calculate unread messages function:', () => {
    test('should return correct value', () => {
        const dialog = [
            { isRead: true, userId: 'other_user_Id' },
            { isRead: true, userId: 'my_user_Id' },
            { isRead: true, userId: 'other_user_Id' },
            { isRead: false, userId: 'my_user_Id' },
            { isRead: false, userId: 'other_user_Id' },
            { isRead: false, userId: 'other_user_Id' }
        ];

        expect(calculateUnreadMessages(dialog, 'my_user_Id')).toEqual(2)
    });

    test('should return 0 if dialog doesn\'t have unread messages', () => {
        const dialog = [
            { isRead: true, userId: 'other_user_Id' },
            { isRead: true, userId: 'my_user_Id' },
            { isRead: true, userId: 'other_user_Id' }
        ];

        expect(calculateUnreadMessages(dialog, 'my_user_Id')).toEqual(0)
    });

    test('should return 0 if dialog is empty', () => {
        const dialog = [];
        expect(calculateUnreadMessages(dialog, 'my_user_Id')).toEqual(0)
    });
});


describe('Sort messages function', () => {
    test('should return correct array', () => {
        const dialog = [
            { time: '2020-12-18T21:08:03+02:00' },
            { time: '2020-12-18T20:08:02+02:00' },
            { time: '2020-12-18T19:08:01+02:00' }
        ];
        const resultSortedArray = [
            { time: '2020-12-18T19:08:01+02:00' },
            { time: '2020-12-18T20:08:02+02:00' },
            { time: '2020-12-18T21:08:03+02:00' }
        ];

        expect(sortMessages(dialog)).toEqual(resultSortedArray)
    });

    test('should return empty array if dialog is empty', () => {
        const dialog = [];
        expect(sortMessages(dialog)).toEqual([])
    })
});


describe('Set update dialog function', () => {
    test('should return object with correct sorted messages', () => {
        const data = {
            content: {
                0: {
                    id: "0",
                    isDelivered: false,
                    isRead: false,
                    message: "TEST0",
                    time: "2020-12-18T23:00:00+02:00",
                    userId: "user_id_2"
                },
                1: {
                    id: "1",
                    isDelivered: true,
                    isRead: true,
                    message: "TEST1",
                    time: "2020-12-18T21:05:27+02:00",
                    userId: "user_id_1"
                },
                2: {
                    id: "2",
                    isDelivered: false,
                    isRead: false,
                    message: "TEST2",
                    time: "2020-12-18T21:07:27+02:00",
                    userId: "user_id_2"
                }
            },
            id: 'dialog_1',
            members: { 'user_id_1': 'user_id_1', 'user_id_2': 'user_id_2' }
        };
        const userId = 'user_id_1';
        const expectedResult = {
            'sortedMessages': [
                {
                    'id': '1',
                    'isDelivered': true,
                    'isRead': true,
                    'message': 'TEST1',
                    'time': '2020-12-18T21:05:27+02:00',
                    'userId': 'user_id_1',
                },
                {
                    'id': '2',
                    'isDelivered': false,
                    'isRead': false,
                    'message': 'TEST2',
                    'time': '2020-12-18T21:07:27+02:00',
                    'userId': 'user_id_2',
                },
                {
                    'id': '0',
                    'isDelivered': false,
                    'isRead': false,
                    'message': 'TEST0',
                    'time': '2020-12-18T23:00:00+02:00',
                    'userId': 'user_id_2',
                },
            ],
            'sumUnreadMessages': 2
        };

        expect(getUpdatedDialog(data, userDialogs, userId)).toEqual(expectedResult)
    })
});











