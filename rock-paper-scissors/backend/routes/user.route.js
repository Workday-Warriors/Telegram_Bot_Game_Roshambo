require("dotenv").config();
const express = require("express");
const { History, User, Game } = require('../database/sequelize');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('GET request to the homepage');
});

////////////////////////////////////////////////////////////////////////
//get the all messages
router.get('/history/:id', async (req, res) => {
    console.log(req.params.id);
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

//body params: roomId, walletAddress, stickerType
router.post('/history/sendMessage', async (req, res) => {
    console.log(req.body);
    const result = await History.create(
        {
            roomId: req.body.roomId, 
            walletAddress: req.body.walletAddress, 
            stickerType: req.body.stickerType
        }
    );

    if(result == 0) {
        return res.status(200).json({successMessage: 1});
    }

    var is_rock = 0;
    var is_scissors = 0;
    var is_paper = 0;
    
    if(req.body.stickerType == "Rock") {
        is_rock = 1;
    } else if (req.body.stickerType == "Scissors") {
        is_scissors = 1;
    } else if (req.body.stickerType == "Paper") {
        is_paper = 1;
    }

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
            rock: remainCountByType[0].rock - is_rock,
            scissors: remainCountByType[0].scissors - is_scissors,
            paper: remainCountByType[0].paper - is_paper,
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
    console.log(req.body);
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
    console.log(req.body.walletAddress);
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
    console.log(req.body);

    const result = await Game.create( 
        {
            walletAddress: req.body.walletAddress,
            rock: req.body.rock,
            scissors: req.body.scissors,
            paper: req.body.paper,
            roomId: req.body.roomId
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
    console.log(req.body);
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
