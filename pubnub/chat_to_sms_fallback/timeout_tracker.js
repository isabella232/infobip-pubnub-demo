// PubNub function metadata:
// Event type: After Presence
// Channel: chat-channel

export default (request) => {
    const db = require('kvstore');
    const DESTINATION_KEY = 'smsDestinations';

    const action = request.message.action;
    const uuid = request.message.uuid;

    db.get(DESTINATION_KEY).then((found) => {
        const destinations = found ? found : [];
        switch(action) {
            case 'join':
            case 'leave':
                const index = destinations.indexOf(uuid);
                if (index > -1) {
                    destinations.splice(index, 1);
                }
                break;
            case 'timeout':
                destinations.push(uuid);
                break;
        }
        console.log(`After Presence update, smsDestinations: ${destinations}`);
        db.set(DESTINATION_KEY, destinations);
    });

    return request.ok();
};