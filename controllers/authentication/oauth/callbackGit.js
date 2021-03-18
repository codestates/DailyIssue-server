const axios = require('axios');
require('dotenv').config();
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

module.exports = async function (req, res) {
  // req.body: { authorizationCode: 'fake_auth_code' }
    await axios({
        method: 'POST',
        url: `https://github.com/login/oauth/access_token`,
        headers: {
            accept: 'application/json',
        },
        data: {
            client_id: clientID,
            client_secret: clientSecret,
            code: req.body.authorizationCode
        }
    })
    .then(rs => {
        if (rs.data.access_token) {
            // git social login 으로 생성된 accToken을 보내준다.
            res.status(200).json({accToken:rs.data.access_token});
        }
    })
    .catch(err => {
        res.status(404).send(err);
    });
    // front 쪽에서 사용자의 git resource 중 필요한게 있는가??
    // social 로그인을 하게 되면, 사용자 정보를 db에 추가하는 과정은 어떻게 처리할 것인가??
    // git으로 가장 처음 로그인 할 때, 회원가입 창이 뜨고 회원가입을 시켜줘야 한다.
    // rfToken 구현 여부는 어떻게 할 것인가??
}