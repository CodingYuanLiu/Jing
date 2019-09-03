import axios from "axios";
import {PRESENCE} from "../common/constant/Constant";
import DeviceInfo from "react-native-device-info";
import Util from "../common/util";


const {client, jid} = require("@xmpp/client");
const xml = require('@xmpp/xml');
const baseOpenFireUri = "ws://202.120.40.8:30256";


export default class XmppApi {
    static xmpp;

    static init(username, password, debug = true) {
        //this.getResource().catch();
        this.xmpp = client(
            {
                service: `${baseOpenFireUri}/ws`,
                resource: DeviceInfo.getDeviceName(),
                username: username,
                password: password,
            }
        );
        console.log(username, password);
        if (debug) {
            this.turnOnDebug();
            this.onError();
            this.onOffline();
            this.onOnline();

        }
    };

    static getResource = async () => {
        console.log(await DeviceInfo.getDeviceName());
        console.log(await DeviceInfo.getDevice());
        console.log(await DeviceInfo.getBrand());
        console.log(await DeviceInfo.getDeviceCountry());
        console.log(await DeviceInfo.getDeviceLocale());
        console.log(await DeviceInfo.getDeviceType());
        console.log(await DeviceInfo.getBaseOS());
        console.log(await DeviceInfo.getAvailableLocationProviders());
        console.log(await DeviceInfo.getBatteryLevel());
        console.log(await DeviceInfo.getCameraPresence());
        console.log(await DeviceInfo.getPhoneNumber());
        console.log(await DeviceInfo.getSystemName());
        console.log(await DeviceInfo.getApplicationName());
        console.log(await DeviceInfo.getDeviceId());
        console.log(await DeviceInfo.getCodename());
        console.log(await DeviceInfo.getCarrier());
        console.log(await DeviceInfo.getBuildNumber());
        console.log(await DeviceInfo.getBootloader());
        console.log(await DeviceInfo.getBundleId());
        console.log(await DeviceInfo.getFingerprint());
        console.log(await DeviceInfo.getFontScale());
        console.log(await DeviceInfo.getHardware());
        console.log(await DeviceInfo.getHost());
        console.log(await DeviceInfo.getIPAddress());
        console.log(await DeviceInfo.getIncremental());
        console.log(await DeviceInfo.getInstallReferrer());
        console.log(await DeviceInfo.getInstanceID());
        console.log(await DeviceInfo.getLastUpdateTime());
        console.log(await DeviceInfo.getMACAddress());
        console.log(await DeviceInfo.getManufacturer());
        console.log(await DeviceInfo.getModel());
        //console.log(await DeviceInfo.getPowerState());
        console.log(await DeviceInfo.getSystemVersion());
        console.log(await DeviceInfo.getType());
        console.log(await DeviceInfo.getUserAgent());
        console.log(await DeviceInfo.isLocationEnabled());
        console.log(await DeviceInfo.getSystemAvailableFeatures());
        console.log(await DeviceInfo.isAirPlaneMode());
        console.log(await DeviceInfo.getVersion());
    };

    static turnOnDebug() {
        // debug
        this.xmpp.on('status', status => {
            console.debug('🛈', 'status', status)
        });
        this.xmpp.on('input', input => {
            console.debug('⮈', input)
        });
        this.xmpp.on('output', output => {
            console.debug('⮊', output)
        });
    }
    static onError() {
        this.xmpp.on('error', err => {
            console.warn('❌', err.toString())
        });
    }
    static onOnline() {
        this.xmpp.on('online', async address => {
            console.log('online as', address);
            await this.sendPresence(PRESENCE.ONLINE);
        });
    }
    static onOffline() {
        this.xmpp.on('offline', () => {
            console.log('⏹', 'offline')
        });
    }
    static onStanza(store) {
        this.xmpp.on('stanza', async stanza => {
            console.log(stanza);
        });
    }
    onStanza = async standaz => {
        console.log(standaz);
        // message from group chat
        if (standaz.is("message")) {
            if (standaz.children && standaz.children.length > 0){
                let jid = standaz.attrs.from;
                let roomId=jid.substring(0, jid.indexOf("/"));
                let username = jid.substring(jid.indexOf("/") + 1);
                let nickname = standaz.attrs.nickname ?
                    standaz.attrs.nickname : username;
                let msg = {};
                msg.user = {
                    _id: username,
                    name: nickname,
                };
                msg.user.avatar = standaz.attrs.avatar ?
                    standaz.attrs.avatar : "http://m.imeitou.com/uploads/allimg/171123/3-1G123203S6-50.jpg";
                for (let child of standaz.children) {
                    if (child.name === "body") {
                        msg.text = child.children[0];
                    }
                    if (child.name === "delay"){
                        msg.createAt=child.attrs.stamp;
                    }
                    if (child.name === "stanza-id") {
                        msg._id = child.attrs.id;
                    }
                }
                if (!msg.createAt) {
                    msg.createAt = new Date();
                }
                if (msg.text) {
                    this.props.onSendMessage(roomId, msg);
                } else {
                    // message has no body
                    console.warn("is message, but no body");
                }
            }
            console.log(this.props.xmpp);
        }
    };
    static login(data){
        let password = Util.cryptoOnpenFire(data.username, data.password);
        let jid = `user${data.id}`;
        let username = data.username;
        this.init(username, password);
        return this.xmpp.start()
    }

    static logout = async () => {
        await this.xmpp.stop();
    };

    static sendPresence = async (status) => {
        let presence = xml('presence', {},
            xml('show', {}, 'chat'),
            xml('priority', {}, 1),
            xml('status', {}, status),
        );
        await this.xmpp.send(presence);
    };

    static sendChatStates = async (to, status) => {
        let chatStates = xml('message', {
            to: to,
            type: 'chat',
        }, xml(status, {
            xmlns: 'http://jabber.org/protocol/chatstates',
        }));

        await this.xmpp.send(chatStates);
    };

    static sendMessage = async (from, to, type, id, text, images = null) => {
        let listString = "";
        if (images) {
            for (let item of images) {
                listString = listString + " " + item;
            }
        }
        let message = xml('message', {
            from,
            to,
            type,
            id,
        }, xml('body', {}, text),
            xml('images', {}, listString) );

        await this.xmpp.send(message);
    };

    static getJid = (user) => {
        return `user${user.id}@202.120.40.8`
    };
}

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
            createDate: new Date(),
            canAnyoneDiscoverJID: false,
            canOccupantsChangeSubject: false,
            canChangeNickname: false,
            persistent: true,
            owners: {
                owner: owner,
            },
            admins: {
                admin: [owner,]
            }
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

const PRIVATE_MESSAGE_BASIC_URI = "http://39.105.54.161:8080";

export class PrivateMessageApi {
    static getChatList = async (jwt) => {
        let res = await axios.get(`${PRIVATE_MESSAGE_BASIC_URI}/chat/list`, {
            headers: {
                "Authorization": jwt,
            }
        });
        return res.data;
    };
    static getChatHistory = async (senderId, jwt) => {
        let res = await axios.get(`${PRIVATE_MESSAGE_BASIC_URI}/chat?sender_id=${senderId}`, {
            headers: {
                "Authorization": jwt,
            }
        });
        console.log(res);
        return res.data;

    };
    static addMessage = async (message, jwt) => {
        let res = await axios.post(`${PRIVATE_MESSAGE_BASIC_URI}/chat`, message, {
            headers: {
                "Authorization": jwt,
            }
        });
        console.log(res);
        return res.data;
    };
}
