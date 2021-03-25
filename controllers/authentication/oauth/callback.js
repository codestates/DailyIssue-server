// callback root는 google 소셜 로그인입니다.
require('dotenv').config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { default: axios } = require('axios');
const { user } = require('../../../models');

module.exports = async function(req, res) {
    axios
    .post("https://www.googleapis.com/oauth2/v4/token", {
        code: req.query.code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: 'http://localhost:4000/callback',
        grant_type: "authorization_code",
    })
    .then(async (rs) => {
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
            const userData = await user.findOrCreate({
                where:{
                    username: googleUser.id,
                },
                defaults:{
                    nickname: googleUser.name,
                    hashedpw: 'socialLogin',
                    email: googleUser.email,
                    image: googleUser.picture,
                }
            });
            const accToken = await jwt.sign(
                {
                    id: userData.id,
                    username: userData.username,
                    nickname: userData.nickname,
                    email: userData.email,
                    image: userData.image,
                }, 'salt',
                // option
                {
                    expiresIn: '10m'
                }   
            );
            const rfToken = await jwt.sign(
                //payload
                {
                    id: userData.id,
                }, 'salt',
                // option
                {
                    expiresIn: '1h'
                }
            );
            res.cookie('rfToken', rfToken);
            res.redirect(`https://www.dailyissue.net/oauth/${accToken}`);
        }
    })
}