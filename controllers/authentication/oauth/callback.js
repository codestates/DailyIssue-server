// callback root는 google 소셜 로그인입니다.
require('dotenv').config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { default: axios } = require('axios');
const { user } = require('../../../models');

module.exports = async function(req, res) {
    if (!req.cookies.rfToken) {
        axios
        .post("https://www.googleapis.com/oauth2/v4/token", {
            code: req.query.code,
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: 'https://app.dailyissue.net/callback',
            grant_type: "authorization_code",
        })
        .then(async (rs) => {
            console.log(rs.data);
            if (rs.data.access_token) {
                // id_token을 decoded
                const googleUser = await axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${rs.data.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${rs.data.id_token}`
                    }
                })
                .then(rs => rs.data)
                console.log('🔓' + googleUser);
                // decoded 값을 기반으로 db에 회원정보 생성...
                const userData = await user.create({
                    username: googleUser.id,
                    nickname: googleUser.name,
                    hashedpw: 'socialLogin',
                    email: googleUser.email,
                    image: googleUser.picture,
                })
                res.cookie('rfToken', rs.data.refresh_token);
                res.status(200).json({accToken: rs.data.access_token, userData: userData.dataValues});
            }
        })
    }
    else {
        res.status(400).redirect('잘못된 접근입니다.');
    }
}