// PubNub function metadata:
// Event type: After Presence
// Channel: chat-channel

export default (request) => {
    const db = require('kvstore');
    const DESTINATION_KEY = 'smsDestinations';

    const action = request.message.action;
    const uuid = request.message.uuid;

    db.get(DESTINATION_KEY).then((found) => {
        const dest = found ? found : [];
        let index;
        switch(action) {
            case 'join':
                index = dest.indexOf(uuid);
                if (index > -1) {
                    dest.splice(index, 1);
                }
                break;
            case 'timeout':
                dest.push(uuid);
                break;
            case 'leave':
                index = dest.indexOf(uuid);
                if (index > -1) {
                    dest.splice(index, 1);
                }
                break;
        }
        console.log(`After Presence update, smsDestinations: ${dest}`);
        db.set(DESTINATION_KEY, dest);
    });

    return request.ok();
};