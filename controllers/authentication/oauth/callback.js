// callback root는 google 소셜 로그인입니다.
require('dotenv').config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { default: axios } = require('axios');
const { user } = require('../../../models');

module.exports = async function(req, res) {
    // 백엔드에서는 Query_url 정보로 access token을 가져오는 것만 하면된다.
    // authorizationcode = code
    // 양식의 문제??
    await axios
    .post("https://www.googleapis.com/oauth2/v4/token", {
        code: req.query.code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: 'http://localhost:4000/callback',
        grant_type: "authorization_code",
    })
    .then(rs => {
        if (rs.data.access_token) {
            // git social login 으로 생성된 accToken을 보내준다.
            console.log(rs.data);
            // res.status(200).json({accToken:rs.data.access_token});
        }
    })

    // 유저 데이터 기반으로 새로운 유저 생성
    // username: (refresh_token), nickname: google00001, password: (none), email: (none)
    const social = 'google';
    const number = 'exampleNumber';
    const userData = await user.create({
        username:  rs.data.refresh_token,
        nickname: `${social}.${number}`,
        hashedpw: `none`,
        email: 'none',
        image: '기본이미지 url',
    })

    delete userData.dataValues.username;
    
    res.status(200).json({accToken:rs.data.access_token, userData: userData.dataValues});

    // refToken은 사용자가 첫번째 인증을 했을 때만 발급된다!
    // 1//0e4BPD4tiCWgMCgYIARAAGA4SNwF-L9IrDcoAg_FCaeN4RJQ_jMOq-QChMN8SOuGRC85zScHBpliVrEBDf8MKBo5PUnor24zHCFE
}