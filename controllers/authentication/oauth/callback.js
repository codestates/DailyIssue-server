// callback root는 google 소셜 로그인입니다.
require('dotenv').config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { default: axios } = require('axios');
const { user } = require('../../../models');
const passwordHash = require('password-hash');

module.exports = async function(req, res) {
    if (!req.cookies.rfToken) {
        axios
        .post("https://www.googleapis.com/oauth2/v4/token", {
            code: req.query.code,
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: 'http://localhost:4000/callback',
            grant_type: "authorization_code",
        })
        .then(async (rs) => {
            console.log(rs.data);
            if (rs.data.access_token) {
                res.cookie('rfToken', rs.data.refresh_token);
                res.status(200).json({accToken: rs.data.access_token});
            }
        })
    }
    else {
        console.log('REDIRECT!!');
        res.status(400).redirect('잘못된 접근입니다.');
    }
}