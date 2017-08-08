// PubNub function metadata:
// Event type: After Publish or Fire
// Channel: chat-channel

export default (request) => {
    const db = require('kvstore');
    const pubNub = require('pubnub');
    const DESTINATION_KEY = 'smsDestinations';

    const message = request.message;
    const roomUrl = message.chatRoom;
    const sender = message.sender.substring(0, message.sender.lastIndexOf('@'));

    db.get(DESTINATION_KEY).then((found) => {
        const destinations = found ? found : [];
        console.log(`Sending fallback sms to destinations: ${destinations}`);
        destinations.forEach((uuid) => {
            const phoneNumber = uuid.substring(uuid.lastIndexOf('@') + 1);
            const queryParam = `uuid=${uuid.replace(/ /g, '+')}`;
            const chatRoom = roomUrl + ((roomUrl.indexOf('?') === -1) ? '?' : '&') + queryParam;
            const smsText = `${sender} sent you a message: "${message.text}". You can leave this chat at: ${chatRoom}`;
            const smsMessage = {
                to: phoneNumber,
                text: smsText
            };
            console.log(`Sending text message ${smsMessage}`);
            pubNub.publish({ channel: 'infobip_sms', message: smsMessage});
        });
    });

    return request.ok();
};