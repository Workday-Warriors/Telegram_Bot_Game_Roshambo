const express = require("express");
const { allowAdmin } = require("../middleware/allow");
const { Room } = require('../database/sequelize');

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
