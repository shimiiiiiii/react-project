const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const findOrCreateUser = require('../utils/findOrCreateUser');

// Initialize Firebase Admin SDK if not done elsewhere
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

router.post('/login', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const firebaseToken = authHeader.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const { email, uid } = decodedToken;

        // Find or create the user in your database
        const user = await findOrCreateUser(email, uid);

        // Return Firebase token and user info
        res.status(200).send({
            token: firebaseToken, // Return Firebase token as the app token
            user,
        });
    } catch (error) {
        console.error("Error validating Firebase token:", error);
        res.status(400).send({ message: 'Invalid token' });
    }
});

module.exports = router;
