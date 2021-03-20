require('dotenv').config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { default: axios } = require('axios');

module.exports = async function(req, res) {
    axios
    .post("https://www.googleapis.com/oauth2/v4/token", {
        client_id: clientID,
        client_secret: clientSecret,
        refresh_token: '1//0e4BPD4tiCWgMCgYIARAAGA4SNwF-L9IrDcoAg_FCaeN4RJQ_jMOq-QChMN8SOuGRC85zScHBpliVrEBDf8MKBo5PUnor24zHCFE',
        grant_type: "refresh_token",
    })
    .then(rs => {
        if (rs.data.access_token) {
            // git social login 으로 생성된 accToken을 보내준다.
            console.log(rs.data);
            res.status(200).json({accToken:rs.data.access_token});
        }
    })

    // refToken은 사용자가 첫번째 인증을 했을 때만 발급된다!
}