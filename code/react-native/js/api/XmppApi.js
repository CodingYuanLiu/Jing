import {CHAT_TYPE, PRESENCE} from "../common/constant/Constant";
import DeviceInfo from "react-native-device-info";
import {addPrivateMessage} from "../actions/privateChat";

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
    static onStanza(store, currentUser) {
        this.xmpp.on('stanza', async stanza => {
            console.log(stanza);
            if (stanza.is("message")) {
                let attrs = stanza.attrs;
                if (attrs.type === CHAT_TYPE.GROUP_CHAT) {



                } else if (attrs.type === CHAT_TYPE.PRIVATE_CHAT) {
                    let kind = attrs.id;
                    let from = attrs.from;
                    let message = {};
                    message.createdAt = new Date(stanza.getChild("body").attrs.createdAt);
                    message._id = stanza.getChild("body").attrs._id;
                    if (kind === "comment") {

                    } else if (kind === "join") {

                    } else if (kind === "follow") {

                    } else if (kind === "normal") {
                        let userElement = stanza.getChild("user");
                        message.user = {
                            _id: userElement.attrs._id,
                            name: userElement.attrs.name,
                            avatar: userElement.attrs.avatar,
                        };

                        message.text = stanza.getChild("body").text();
                        let imageElement = stanza.getChild("image");
                        if (imageElement.text() !== "") {
                            message.image = imageElement.text().split(" ");
                        }
                        let stanzaIdElement = stanza.getChild("stanza-id");
                        if (stanzaIdElement !== null && stanzaIdElement !== undefined) {
                            message._id = stanzaIdElement.attrs.id;
                        }
                        console.log(message);

                        PrivateMessageApi.addMessage({
                            text: message.text,
                            image: !message.image?message.image.filter(item => item !== ""): null,
                            thatUserAvatar: message.user.avatar,
                            thatUserId: message.user._id,
                            thatUserName: message.user.name,
                            thisUserName: currentUser.nickname,
                            thisUserAvatar: currentUser.avatar,
                            thisUserId: currentUser.id,
                            isSelf: false,
                        }, currentUser.jwt)
                            .then(() => {
                                store.dispatch(addPrivateMessage(message.user._id, message));
                            });
                    } else {
                        // ...
                    }
                }
            }
        });
    }
    static login(data){
        let password = "lqynb0413";
        let jid = `user${data.id}`;
        this.init(jid, password);
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

    static sendMessage = async (from, to, type, kind, msg) => {
        try {
            let listString = "";
            if (msg.image !== null && msg.image !== undefined) {
                for (let item of msg.image) {
                    listString = listString + " " + item;
                }
            }
            let message = xml('message', {
                    from,
                    to,
                    type,
                    id: kind,
                },  xml('user', {
                    _id: msg.user._id,
                    name: msg.user.name,
                    avatar: msg.user.avatar,
                }),
                xml('body', {
                     _id: msg._id,
                     createdAt: msg.createdAt,
                }, msg.text),
                xml('image', {}, listString)
            );
            await this.xmpp.send(message);
        } catch (e) {
            console.log(e);
        }
    };

    static getJid = (receiver, type) => {
        if (type === CHAT_TYPE.PRIVATE_CHAT) {
            return `user${receiver.id}@202.120.40.8`
        } else {
            return `act${receiver.id}@conference.202.120.40.8`
        }
    };
}
