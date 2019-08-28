import axios from "axios";

const {client, jid} = require("@xmpp/client");
const xml = require('@xmpp/xml');
const basicUri = "202.120.40.8:30256";
const basicToken = "YWRtaW46MTIzNDU=";

export default class XmppApi {
    static xmpp;

    static init(username, password, debug = true) {
        this.xmpp = client(
            {
                service: "ws://202.120.40.8:30256/ws",
                username: username,
                password: password,
            }
        );
        if (debug) {
            this.turnOnDebug();
            this.onError();
            this.onOffline();
            this.onOnline();

        }
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
            console.log('🗸', 'online as', address);

            const presence = xml('presence', {},
                xml('show', {}, 'chat'),
                xml('status', {}, 'presence!'),
            );
            this.xmpp.send(presence)
        });
    }
    static onOffline() {
        this.xmpp.on('offline', () => {
            console.log('⏹', 'offline')
        });
    }
    static onStanza(
        callback = async stanza => {
        console.log(stanza.toString());
    }, props) {
        this.xmpp.on('stanza', callback);
    }

    static login(username, password){
        this.init(username, password);
        return this.xmpp.start()
    }

    static logout() {
        this.xmpp.stop();
    }

    static sendMessage(message) {
        return new Promise((resolve, reject) => {
            this.xmpp.send(message)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
    static getChatList() {
        return new Promise((resolve, reject) => {
            this.xmpp.send(
                xml('iq', {
                    type: 'get',
                    id: 'chatlist',
                    to: 'conference.202.120.40.8'
                }, xml('query', {
                    xmlns: 'http://jabber.org/protocol/disco#items'
                }))
            ).then(() => {
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }

    static register(username, password) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const xmpp = client({
            service: 'ws://202.120.40.8:30256/ws',
            username: '__reg__',
            password: '__reg__',
        });
        xmpp.on('stanza', async stanza => {
            if (stanza.is('iq') && stanza.attrs.id === 'reg2') {
                const type = stanza.attrs.type;
                if (type === 'error') {
                    console.log("Register error");
                } else {
                    console.log("Register successfully");
                }
                xmpp.stop();
            }
        });
        xmpp.on('online', async address => {
            xmpp.send(
                xml('iq', {type: 'set', id: 'reg2'},
                    xml('query', {xmlns: 'jabber:iq:register'},
                        xml('username', {}, username),
                        xml('email', {}, 'dfyshisb@163.com'),
                        xml('name', {}, '测试用户'),
                        xml('password', {}, password),
                    )
                )
            )
        });
        return xmpp.start();
    }
}


export class OpenFireApi{
    register = async (username, password, nickname = null, email = null) => {
        let data = {
            username: username,
            password: password,
        };
        if (nickname) data.name = nickname;
        if (email) data.email = email;

        let res = await axios.post(`${basicUri}/plugins/restapi/v1/users`, data, {
            headers: {
                "Authorization": `Basic ${basicToken}`,
            }
        });
        return res.data;
    };

    updateUser = async (username, nickname = null, email = null) => {
        let data = {
            username,
        };
        if (nickname) data.name = nickname;
        if (email) data.email = email;

        let res = await axios.put(`${basicUri}/plugins/restapi/v1/users/oldUsername`, data, {
            headers: {
                "Authorization": `Basic ${basicToken}`,
            }
        });
        return res.data;
    };

    createChatRoom = async (roomName, naturalName, description, maxUsers, owner) => {
        let data =　{
            roomName,
            naturalName,
            description,
            maxUsers,
            createDate: new Date(),
            canAnyoneDiscoverJID: false,
            canOccupantsChangeSubject: false,
            canChangeNickname: false,
            owners: {
                owner: owner,
            },
            admins: {
                admin: [owner,]
            }
        };

        let res = await axios.post(`${basicUri}/plugins/restapi/v1/chatrooms`, data, {
            headers: {
                "Authorization": `Basic ${basicToken}`,
            }
        });

    };
}
