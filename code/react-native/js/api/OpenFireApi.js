import axios from "axios";

const basicUri = "http://202.120.40.8:30257/plugins/restapi/v1";
const basicToken = "lqynb";

export class OpenFireApi{
    static searchUsers = async(para) => {

    };

    static register = async (data) => {
        let res = await axios.post(`${basicUri}/users`, data, {
            headers: {
                "Authorization": `${basicToken}`,
            }
        });
        return res.data;
    };

    static updateUser = async (username, nickname = null, email = null) => {
        let data = {
            username,
        };
        if (nickname) data.name = nickname;
        if (email) data.email = email;

        let res = await axios.put(`${basicUri}/users/oldUsername`, data, {
            headers: {
                "Authorization": `${basicToken}`,
            }
        });
        return res.data;
    };

    static createChatRoom = async (roomName, naturalName, description, maxUsers, owner) => {
        let data =　{
            roomName,
            naturalName,
            description,
            maxUsers,
            canAnyoneDiscoverJID: false,
            canOccupantsChangeSubject: false,
            canChangeNickname: false,
            persistent: true,
            owners: [
                owner,
            ],
        };

        let res = await axios.post(`${basicUri}/chatrooms`, data, {
            headers: {
                "Authorization": `${basicToken}`,
            }
        });
        return res.data;
    };

    static getChatRoomInfo = async (roomName) => {
        let res = await axios.get(`${basicUri}/chatrooms/${roomName}`, null, {
            headers: {
                "Authorization": `${basicToken}`
            }
        });
        return res.data;
    };

    static getChatRoomParticipants = async (roomName) => {
        let res = await axios.get(`${basicUri}/chatrooms/${roomName}/participants`, null, {
            headers: {
                "Authorization": `${basicToken}`,
            }
        });
        return res.data;
    };

    static getChatRoomHistory = async (roomName) => {
        let res = await axios.get(`${basicUri}/chatrooms/${roomName}/chathistory`, null, {
            headers: {
                "Authorization": `${basicToken}`,
            }
        });
        return res.data;
    };

    static addUserToChatRoom = async (roomName, roles, name) => {
        let res = await axios.post(`${basicUri}/chatrooms/${roomName}/${roles}/${name}`, null, {
            headers: {
                "Authorization": `${basicToken}`,
            }
        });

        return res.data;
    };

    // broadcast message to every user;
    static broadcastMessage = async () => {
        let data = {
            message:'',
        };
        let res = await axios.post(`${basicUri}/messages/users`, data, {
            headers: {
                "Authorization": `${basicToken}`,
            }
        });
    };
}
