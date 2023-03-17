const router = require('express').Router();
const User = require('../Models/User');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

//Register
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),

    });

    try {
        const user = await newUser.save();
        res.status(200).json({ success: true, 'data': user });
    }
    catch (err) {
        res.status(500).json({ success: false, 'data': err })
    }

})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('wrong credentials');

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password &&
            res.status(404).json('wrong credentials');

        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY, { expiresIn: '1d' })

        const { password, ...info } = user._doc
        res.status(200).json({ success: true, 'data': info, accessToken })
    }
    catch (err) {
        res.status(500).json({ success: false, 'data': err })

    }
})


module.exports = router