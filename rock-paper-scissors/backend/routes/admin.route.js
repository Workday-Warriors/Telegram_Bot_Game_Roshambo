const express = require("express");
const { allowAdmin } = require("../middleware/allow");
const { Room } = require('../database/sequelize');

const { Web3 } = require("web3");
const { ADMIN_ADDRESS, PRIVATE_KEY, CONTRACT_ADDRESS } = require("../utils/const");

const router = express.Router();

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
  console.log(req.params.id);
  const result = await Room.findAll(
    {
      where: {
        id: req.params.id
      }
    }
  );

  if(result != 0) {
    return res.status(200).json({result: result, successMessage: 0});
  } else {
    return res.status(200).json({result: result, successMessage: 1});
  }
});

//delete the room because the game is finished
router.post('/room/delete', async(req, res) => {
  console.log(req.body);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // { TRANSACTION
  const tokenABI = require('../contract/abi.json');

  const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/b5c3be73a3024cb8888be3142d0135d8'));
  const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
  const contract = new web3.eth.Contract(tokenABI, CONTRACT_ADDRESS);
  async function sendTransaction() {
  
      const allCount = req.body.rock + req.body.paper + req.body.scissors;
      const data = contract.methods.transfer(req.body.walletAddress, web3.utils.toWei( allCount, 'RSP' )).encodeABI();
      const gasPrice = web3.utils.toWei( allCount, 'gwei' ); 
      const nonce = await web3.eth.getTransactionCount(account.address);
      const rawTransaction = {
          'from': account.address,
          'to': CONTRACT_ADDRESS,
          'value': '0x0',
          'gasPrice': gasPrice,
          'gasLimit': '100000',
          'data': data,
          'nonce': nonce
      };
      
      const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, PRIVATE_KEY);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log('Transaction receipt: ', receipt);
  }
  sendTransaction();

  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const result = await Room.update(
      {
         finished: 1,
         winner: req.body.walletAddress
       },
      {
          where: {
              finished: 0,
              id: req.body.roomId
          }
      }
  );

  if(result != 0) {
      return res.status(200).json({successMessage: 0});
  } else {
      return res.status(200).json({successMessage: 1});
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
