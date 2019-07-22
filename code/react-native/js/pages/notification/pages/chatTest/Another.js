import React from "react"
import { View, Text, NativeModules } from 'react-native';
import { Button, Input } from "react-native-elements";

const {client, jid} =  require("@xmpp/client");
const xml = require('@xmpp/xml');

const xmpp = client({
    service: "ws://202.120.40.8:30256/ws",
   // domain: "202.120.40.8",
    username: 'user2',
    password: 'user2',
});

const recipient = "user1@202.120.40.8";

export default class ChatTest extends React.PureComponent{
    constructor(props) {
        super(props);

        xmpp.on('error', err => {
            console.error('❌', err.toString())
        });

        xmpp.on('offline', () => {
            console.log('⏹', 'offline')
        });

        xmpp.on('stanza', async stanza => {
            /*
            if (stanza.is('message')) {
                await xmpp.send(xml('presence', {type: 'unavailable'}))
                await xmpp.stop()
            }*/
            console.log(stanza.toString());
            const message = xml('message', {
                    type: 'chat', to: recipient
                },
                xml('subject', {}, '测试'),
                xml('body', {}, '测试内容'),
            );
            await xmpp.send(message);
        });

        xmpp.on('online', async address => {
            console.log('🗸', 'online as', address)

            // Sends a chat message to itself
            // 这是新版的官方文档写法，但是我这样写的时候无法获取到别人给我发的消息。
            // const message = xml(
            // 'message',
            // {type: 'chat', to: address},
            // xml('body', 'hello world')
            // )

            // 旧版官方的写法：旨在告诉服务器我已经上线了。发送了这句话后，我就可以收到服务器传来的消息。
            const presence = xml('presence', {},
                xml('show', {}, 'chat'),
                xml('status', {}, 'presence!'),
            );
            xmpp.send(presence)
        });
        xmpp.on('status', status => {
            console.debug('🛈', 'status', status)
        });
        xmpp.on('input', input => {
            console.debug('⮈', input)
        });
        xmpp.on('output', output => {
            console.debug('⮊', output)
        });
    }

    componentDidMount() {
        console.log("Start to connect to server");
    }

    render() {
        return(
            <View>
                <Text>这是xmpp.js的测试</Text>
                <Button
                    title={"上线"}
                    onPress={() => {xmpp.start().catch(console.error);}}
                />

                <Button
                    title={"下线"}
                    onPress={() => {xmpp.stop()}}
                />

                <Button
                    title={"发送消息"}
                    onPress={() => {
                        const message = xml('message', {
                            type: 'chat', to: recipient
                            },
                            xml('subject', {}, '测试'),
                            xml('body', {}, '测试内容'),
                        );
                        xmpp.send(message);
                    }}
                />
            </View>
        )
    };

}

