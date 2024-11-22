const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user')

const router = express.Router();

// Register user 
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({
            name,
            email,
            password
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// Login user

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            id: user._id
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({error: error.message});
        }    
})

module.exports = router;