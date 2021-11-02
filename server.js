const qrcode = require('qrcode-terminal');
const phone = require('./numList.js');
const numList = phone.list;
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    session: sessionData
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Connected to Whatsapp Client...');
    for(let i=0;i<numList.length;i++){
        const chatId = numList[i].num.substring(1) + "@c.us";
        // Sending message.
        console.log('Sending message to ' + numList[i].num + '...'); 
        client.sendMessage(chatId, numList[i].message);
    }
    console.log('All messages has been successfully sent...\n\n')
    console.log('Exiting program...');
    process.exit(1)

});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});


client.initialize();