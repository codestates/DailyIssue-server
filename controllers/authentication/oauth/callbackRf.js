require('dotenv').config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { default: axios } = require('axios');
const { user } = require('../../../models');
const passwordHash = require('password-hash');

module.exports = async function(req, res) {
    if (req.cookies.rfToken) {
        axios
        .post("https://www.googleapis.com/oauth2/v4/token", {
            client_id: clientID,
            client_secret: clientSecret,
            refresh_token: req.cookies.rfToken,
            grant_type: "refresh_token",
        })
        .then(rs => {
            if (rs.data.access_token) {
                res.cookie('rfToken', rs.data.refresh_token);
                res.status(200).json({accToken:rs.data.access_token});
            }
        })
    }
    else {
        res.status(400).send('refresh token이 없습니다.');
    }
}