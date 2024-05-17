require("dotenv").config;
const express = require("express");
const { allowAdmin } = require("../middleware/allow");
const { Room, TGUser } = require('../database/sequelize');

const { Web3 } = require("web3");
const { ADMIN_ADDRESS, PRIVATE_KEY, CONTRACT_ADDRESS, DEPLOYED_NETWORK } = require("../utils/const");
const TelegramBot = require('node-telegram-bot-api');
const router = express.Router();

const bot = new TelegramBot(process.env.BOT_API, { polling: true});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  const resultTelegramUser = await TGUser.findAll({
    where: {}
  });

  var bNewUser = 1;
  for(let i = 0; i < resultTelegramUser.length; i ++) {
    if(resultTelegramUser[i].chatId == chatId) {
      bNewUser = 0;
      break;
    }
  }

  var result;
  if(bNewUser == 1) {
    result = await TGUser.create({chatId: chatId});
  }
  if( result != 0 ) {
    bot.sendMessage(chatId, 'Welcome! This is DJEN GameBot. Click https://bbbe-42-84-224-79.ngrok-free.app');
  } else {
    bot.sendMessage(chatId, 'Sorry, Server has some error.');
  }
});

router.post('/createRoom', allowAdmin, async (req, res) => {
  const result = await Room.create({name: 'Room'});
  console.log("created room successfully");
  if(result != 0) {
    return res.status(200).json({successMessage: 0});
  } else {
    return res.status(200).json({successMessage: 1});
  }
});

router.get('/check/room/:id', async (req, res) => {
  //console.log(req.params.id);
  const result = await Room.findAll(
    {
      where: {
        id: req.params.id
      }
    }
  );

//  console.log(result);
  if(result != 0) {
    return res.status(200).json({result: result, successMessage: 0});
  } else {
    return res.status(200).json({result: result, successMessage: 1});
  }
});

//delete the room because the game is finished
router.post('/room/delete', async(req, res) => {
  console.log("winner set");

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // { TRANSACTION
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
    const contract = new web3.eth.Contract(tokenABI, CONTRACT_ADDRESS);

    const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
    const walletAddress = account.address;
    const balance = await contract.methods.balanceOf(walletAddress).call();
    console.log("balance");
    const trimmedBalance = (parseInt(balance) / 10 ** 18).toString();
    console.log(trimmedBalance);

    const tokenABI1 = [
        {
            "constant": false,
            "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
            "name": "transfer",
            "outputs": [{ "name": "", "type": "bool" }],
            "type": "function"
        }
    ];

    toAddress = req.body.walletAddress;
    const contract1 = new web3.eth.Contract(tokenABI1, CONTRACT_ADDRESS);
        const data = contract1.methods.transfer(toAddress, web3.utils.toWei(trimmedBalance/7, 'ether')).encodeABI();
        const gasPrice = web3.utils.toWei('200', 'gwei');
        const nonce = await web3.eth.getTransactionCount(walletAddress);
        
        const gasMax = web3.utils.toWei('100', 'gwei');
        const rawTransaction = {
            'from': walletAddress,
            'to': CONTRACT_ADDRESS,
            'value': '0x0',
            'gasMax': gasMax,
            'gasPrice': gasPrice,
            'gasLimit': web3.utils.toHex(2100000),
            'data': data,
            'nonce': nonce
        };

        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction receipt: ', receipt);

        const valueRize = trimmedBalance/7;

        const result = await Room.update(
          {
             finished: 1,
             winner: req.body.walletAddress 
           },
          {
              where: {
                  finished: 0,
                  id: req.body.roomId,
                  prize: parseInt(valueRize)
              }
          }
      );
    
      console.log(result);
      const resultTelegramUser = await TGUser.findAll({
        where: {}
      });

      for(let i = 0; i < resultTelegramUser.length; i ++) {
        console.log(resultTelegramUser[i].chatId);
        bot.sendMessage(resultTelegramUser[i].chatId, req.body.roomId + " ROOM->" + "WINNER:" + req.body.walletAddress + ", Reward:" + valueRize);
      }

      if(result != 0) {
          return res.status(200).json({successMessage: 1});
      } else {
          return res.status(200).json({successMessage: 0});
      }
});

router.post('/rooms', async (req, res) => {
  const rooms = await Room.findAll({
    where: {
      finished: 0
    }
  });
  
  if(rooms != 0) {
    return res.status(200).json({result: rooms, successMessage: 0});
  } else {
    return res.status(200).json({result: rooms, successMessage: 1});
  }

});

module.exports = router;
