require('dotenv').config();
process.env.NTBA_FIX_319 = 1
const TelegramBot = require('node-telegram-bot-api');
var mysql = require('mysql');
const { Web3 } = require('web3');
const bot = new TelegramBot(process.env.BOT_API, { polling: true });

const game_rock_paper_options = ["rock", "paper", "scissors", "stop_rock"];
var recentSel = 'rock'
var intervalId = 0
var intervalId_min = 0
var IsGameContinue = true
var lastMessage = {}
var stickerCount = 0
var minCount = 0
var m_leftMin = 15
var m_lastUser = "";

var cntInput_users = []
var walletInput_users = []
const tokenAddress = process.env.TOKEN_ADDRESS;
const channelID = process.env.CHANNEL_IDENTIFY

var chatList = [];
var oldUser = "";

var format_optional_text = (optional_text) => {
    if (optional_text && optional_text.reply_markup && optional_text.reply_markup.inline_keyboard && optional_text.reply_markup.inline_keyboard.length > 0) {
        // Get the first button text up to 29 characters
        let buttonText = optional_text.reply_markup.inline_keyboard[0][0].text.substring(0, 29);

        // Pad the text with spaces to ensure it fits within 31 characters
        while (buttonText.length < 31) {
            buttonText += " ";
        }

        return "|" + buttonText + "|\n";
    } else {
        return "";
    }
}



var create_board = (msg, optional_text) => {

    var symbol = ''
    if (recentSel === 'rock') {
        symbol = '✊'
    } else if (recentSel === 'scissors') {
        symbol = '👉'
    } else if (recentSel === 'paper') {
        symbol = '🫱'
    }

    return "<pre>\n" +
        "+-------------------------------+\n" +
        "|        Last Choice            |\n" +
        "+-------------------------------+\n" +
        "|              " + symbol + "               |\n" +

        format_optional_text(optional_text) +
        "+-------------------------------+\n" +
        "</pre>";
}

var commonMessage = (msg) => {
    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '✊', callback_data: 'rock' }, { text: '🫱', callback_data: 'paper' }, { text: '👉', callback_data: 'scissors' }]
            ]
        }),
        parse_mode: "HTML",
        disable_web_page_preview: true
    };

    let output = create_board(msg, options);

    console.log(msg);
    bot.sendMessage(msg.chat.id, output, options).then(msg_return => {
        msg.text = msg_return.message_id;
    });
}

var start_game = (msg) => {
    commonMessage(msg);
}


var stop_rock_game = (msg) => {

    clearInterval(intervalId)
    clearInterval(intervalId_min)
    IsGameContinue = false
    let output =
        "+-------------------------------+\n" +
        "|      " + msg.from.username + "        |\n" +
        "|    won the  Game!   |\n" +
        "+-------------------------------+\n"

    const chatId = msg.message.chat.id;
    bot.sendMessage(chatId, output)
        .then(() => {
            console.log(`Message sent to channel ${chatId}: ${output}`);
        })
        .catch((error) => {
            console.error(`Error sending message to channel ${chatId}: ${error}`);
        });

    bot.sendMessage(channelID, output)
        .then(() => {
            console.log(`Message sent to channel ${channelID}: ${output}`);
        })
        .catch((error) => {
            console.error(`Error sending message to channel ${channelID}: ${error}`);
        });

    const privateKey = process.env.SENDER_PRIVATEKEY;
   

    const selQuery = `select * from mydb.tb_players_wallet where username='${msg.from.username}'`
    con.query(selQuery, function (err, result) {
        if (err) throw err

        const toAddress = result[0]['wallet']
        const tokenABI = [
            {
                "constant": false,
                "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
                "name": "transfer",
                "outputs": [{ "name": "", "type": "bool" }],
                "type": "function"
            }
        ];
        
        const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/b5c3be73a3024cb8888be3142d0135d8'));
        const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        const contract = new web3.eth.Contract(tokenABI, tokenAddress);
        async function sendTransaction() {
        
            const data = contract.methods.transfer(toAddress, web3.utils.toWei('10', 'ether')).encodeABI();
            const gasPrice = web3.utils.toWei('10', 'gwei'); 
            const nonce = await web3.eth.getTransactionCount(account.address);
            const rawTransaction = {
                'from': account.address,
                'to': contractAddress,
                'value': '0x0',
                'gasPrice': gasPrice,
                'gasLimit': '100000',
                'data': data,
                'nonce': nonce
            };
            
            const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Transaction receipt: ', receipt);
        }
        sendTransaction();

    })

    init()

    return true
}

const init = () => {

    cntInput_users = []
    walletInput_users = []
    IsGameContinue = true
    stickerCount = 0
    minCount = 0
    lastMessage = {}

    var player_result_sql = "TRUNCATE TABLE mydb.tb_players_message";
    con.query(player_result_sql, function (err, result) {
        if (err) throw err;
        console.log("Result Table truncated");
    });

    var player_wallet_address = "TRUNCATE mydb.tb_players_wallet";
    con.query(player_wallet_address, function (err, result) {
        if (err) throw err;
        console.log("Wallet Table truncated");
    });
    
}

var calculate_number = () => {
    
    if((m_leftMin * 60-minCount*30) < 0 ) return;
    bot.sendMessage(lastMessage.message.chat.id, m_leftMin * 60-minCount*30)
    bot.sendMessage(channelID, m_leftMin * 60 - minCount*30)
    
    minCount++
}

var play_game = (msg) => {

    if (!IsGameContinue) return
    
    const chatId = msg.message.chat.id;
    if(chatId == oldUser) {
        bot.sendMessage(chatId, "It's not your turn");
        return;
    }
    const message = msg.data;
    if (recentSel === 'rock' && (msg.data === 'scissors' || msg.data === 'rock')) {
        bot.sendMessage(chatId, 'Please choose paper!')
        return;

    } else if (recentSel === 'paper' && (msg.data === 'paper' || msg.data === 'rock')) {
        bot.sendMessage(chatId, 'Please choose scissors!')
        return;

    } else if (recentSel === 'scissors' && (msg.data === 'scissors' || msg.data === 'paper')) {
        bot.sendMessage(chatId, 'Please choose rock!')
        return;
    }

    var special_charac = ''
    var rockCnt = 0
    var scissorsCnt = 0
    var paperCnt = 0

    con.query("SELECT * FROM mydb.tb_players_wallet WHERE username = ?", [msg.from.username], async function (err, result) {
        if (err) {
            console.error('Error executing SQL query:', err);
            return;
        }

        if (result.length == 0) return;


        rockCnt = result[0]['rock'];
        scissorsCnt = result[0]['scissor'];
        paperCnt = result[0]['paper'];

        if (message === 'rock') {
            if (rockCnt == 0) return
            const symbol = '✊'
            special_charac = `${symbol}`
            rockCnt--

        } else if (message === 'paper') {
            if (scissorsCnt == 0) return
            const symbol = '🫱'
            special_charac = `${symbol}`
            paperCnt--

        } else if (message === 'scissors') {
            if (paperCnt == 0) return
            const symbol = '👉'
            special_charac = `${symbol}`
            scissorsCnt--
        }

        for(var i = 0; i < chatList.length; i ++) {
            if(chatList[i].id != chatId) {
                commonMessage(msg);
                bot.sendMessage(chatList[i].id, special_charac + " from " + msg.from.username);
            }
        }

        oldUser = chatId;

        bot.sendMessage(chatId, special_charac)
            .then(() => {
                console.log(`Message sent to channel ${chatId}: ${message}`);
            })
            .catch((error) => {
                console.error(`Error sending message to channel ${chatId}: ${error}`);
            });
            
        bot.sendMessage(channelID, special_charac)
            .then(() => {
                console.log(`Message sent to channel ${channelID}: ${message}`);
            })
            .catch((error) => {
                console.error(`Error sending message to channel ${channelID}: ${error}`);
            });

        const alertMessage = `Current You have ✊:${rockCnt} 👉:${scissorsCnt} 🫱:${paperCnt}`
        const updateQuery = `update mydb.tb_players_wallet set rock='${rockCnt}' , scissor='${scissorsCnt}', paper='${paperCnt}' where username='${msg.from.username}'`
        con.query(updateQuery, function (err, result) {
            if (err) throw err
        })

        bot.sendMessage(chatId, alertMessage)
            .then(() => {
                console.log(`Message sent to channel ${chatId}: ${message}`);
            })
            .catch((error) => {
                console.error(`Error sending message to channel ${chatId}: ${error}`);
            });

        clearInterval(intervalId)
        minCount = 0
        //const min = 15
        if (stickerCount >= 500) {
            if (stickerCount === 500) {
                bot.sendMessage(chatId, "Waiting time is set 10 minutes")
            }
            m_leftMin = 10
        }
        if (stickerCount >= 1000) {
            if (stickerCount === 1000) {
                bot.sendMessage(chatId, "Waiting time is set 5 minutes")
            }
            m_leftMin = 5
        }
        intervalId = setInterval(() => { stop_rock_game(msg) }, m_leftMin * 60 * 1000);
        //intervalId = setInterval(() => { stop_rock_game(msg) }, 6 * 1000);
        intervalId_min = setInterval(() => { calculate_number() }, 30 * 1000)

        const query = "insert into mydb.tb_players_message (name, message, date) values ('" + msg.from.username + "','" + msg.data + "', '" + msg.message.date + "')";
        con.query(query, function (err, result) {
            if (err) throw err;
        });

        stickerCount++
        recentSel = msg.data
        lastMessage = msg
    });
}

var process_message = (msg) => {

    start_game(msg);
    return true;
}


bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    if (game_rock_paper_options.includes(action)) {
        play_game(callbackQuery);
    }
});


bot.onText(/\/play/, async (msg) => {
    if (msg.text) {
        process_message(msg);
    }
});

bot.onText(/\/stop/, async (msg) => {
    stop_rock_game(msg);
});

bot.onText(/\/walletregister (.+)/, (msg, match) => {

    if (walletInput_users.includes(msg.from.username)) {
        bot.sendMessage(msg.from.id, `Already Input!`)
        return
    }

    const rockCnt = 0
    const scissorCnt = 0
    const paperCnt = 0

    const add_wallet_query = `INSERT INTO mydb.tb_players_wallet (username, wallet, rock, scissor, paper) VALUES (?, ?, ?, ?, ?)`;
    console.log(match);
    con.query(add_wallet_query, [msg.from.username, match[1], rockCnt, scissorCnt, paperCnt], function (err, result) {
        if (err) throw err;
        console.log("Wallet updated successfully");
    });

    getTokenBalance(msg.from.username, match[1])
        .then(result => {
            bot.sendMessage(msg.chat.id, `You have ${result} tokens. Please choose how many tokens are you going to use ? \n
    please Input /count rockCount scissorCount paperCount`)
        });

    walletInput_users.push(msg.from.username)

});

bot.onText(/\/walletinfo/, (msg) => {
    const get_wallet_address_query = 'SELECT wallet FROM mydb.tb_players_wallet WHERE username=?';
    con.query(get_wallet_address_query, [msg.from.username], function (err, result) {
        if(err) throw err;
        console.log("wallet");
        
        if(!result) {
            bot.sendMessage(msg.chat.id, `Firstly, Register wallet address using /\/walletregister/`);
            return;
        }

        getTokenBalance(msg.from.username, result)
            .then(result => {
                bot.sendMessage(msg.chat.id, `You have ${result} tokens. Please choose how many tokens are you going to use ? \n
                    please Input /count rockCount scissorCount paperCount`)
                });
    })
})

bot.onText(/\/count (.+)/, (msg, match) => {

    if (cntInput_users.includes(msg.from.username)) {
        bot.sendMessage(msg.from.id, `Already Input!`)
        return
    }

    if (match.length < 2) return

    const values = match[1].split(" ")
    if (values.length != 3) {
        bot.sendMessage(msg.chat.id, `Please Input Correctly!`)
        return
    }
    const rockCnt = values[0]
    const scissorCnt = values[1]
    const paperCnt = values[2]

    if (isNaN(rockCnt) || isNaN(scissorCnt) || isNaN(paperCnt)) {
        bot.sendMessage(msg.chat.id, `Please Input Correctly!`)
        return
    }
    const sum = parseInt(rockCnt) + parseInt(scissorCnt) + parseInt(paperCnt) 
    
    if ( sum >= 11) {
        bot.sendMessage(msg.chat.id, `All Sum can't over 10 \n Pleast retry!`)
        return
    }

    //add user in the user list
    console.log(msg.chat);
    commonUserList(msg.chat);
    
    const updateQuery = `update mydb.tb_players_wallet set rock='${rockCnt}' , scissor='${scissorCnt}', paper='${paperCnt}' where username='${msg.from.username}'`
    con.query(updateQuery, function (err, result) {
        if (err) throw err

        bot.sendMessage(msg.chat.id, `Current You have ✊:${rockCnt} 👉:${scissorCnt} 🫱:${paperCnt}`)
    })

    cntInput_users.push(msg.from.username)
});

bot.on('polling_error', (error) => {
    if (error.code) {
        if (error.code !== 'EFATAL') {
            console.log("error code: ", error);
        }
    } else {
        console.log("error code: ", error);
    }
});

bot.on('new_chat_members', (msg) => {
    const chatId = msg.chat.id;
    const newMembers = msg.new_chat_members;

    console.log(`New user(s) joined channel ${chatId}: ${newMembers.map(member => member.id).join(', ')}`);

    if (!channelMembers[chatId]) {
        channelMembers[chatId] = [];
    }
    newMembers.forEach(member => {
        if (!channelMembers[chatId].includes(member.id)) {
            channelMembers[chatId].push(member.id);
            console.log(`New member ${member.id} joined channel ${chatId}`);
        }
    });
});

/////////////////////////////////////////////////////////////////////////
// DB
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

con.connect(function (err) {
    if (err) throw err;

    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });

    var player_result_sql = "CREATE TABLE IF NOT EXISTS mydb.tb_players_message (id INT AUTO_INCREMENT PRIMARY KEY , name VARCHAR(255), message VARCHAR(255), date VARCHAR(255))";
    con.query(player_result_sql, function (err, result) {
        if (err) throw err;
        console.log("Result Table created");
    });

    var player_wallet_address = "CREATE TABLE IF NOT EXISTS mydb.tb_players_wallet (id INT AUTO_INCREMENT PRIMARY KEY , username VARCHAR(255), wallet VARCHAR(255), rock Int, scissor Int, paper Int)";
    con.query(player_wallet_address, function (err, result) {
        if (err) throw err;
        console.log("Wallet Table created");
    });
});

//DB
//////////////////////////////////////////////////////////////////////////
async function getTokenBalance(owner, walletAddress) {

    const web3 = new Web3('https://sepolia.infura.io/v3/b5c3be73a3024cb8888be3142d0135d8');
    const tokenABI = [
        {
            "constant": true,
            "inputs": [{ "name": "_owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "type": "function"
        }
    ];
    const contract = new web3.eth.Contract(tokenABI, tokenAddress);
//    const uintValue = web3.utils.toBigInt(walletAddress); 
    const balance = await contract.methods.balanceOf(walletAddress).call();
    const trimmedBalance = (parseInt(balance) / 10 ** 18).toString();
    return trimmedBalance
}

