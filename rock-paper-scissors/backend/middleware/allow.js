const { ADMIN_ADDRESS } = require("../utils/const");

const allowAdmin = async (req, res, next) => {
    console.log("start");
    console.log(req.body);
    if (req.body?.walletAddress == ADMIN_ADDRESS) {
        return next();
    }

    return res.status(401).json({ error: "allowAdmin: You haven't got admin permission" });
}

module.exports = {
    allowAdmin,
};