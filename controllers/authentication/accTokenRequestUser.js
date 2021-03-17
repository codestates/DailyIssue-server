const jwt = require('jsonwebtoken');
const { Users } = require('../../models');
// GET
// 정상적인 accToken 이면 userData를 보내줘야함?
module.exports = async function(req, res) {
    // accToken이 올바르면 userData.dataValues를 response
    if (!req.headers.authorization) {
        res.status(400).send('accToken이 필요합니다.');
    }
    else {
        const token = await req.headers.authorization.split('Bearer ')[1];
        await jwt.verify(token, 'salt', async function(err, decoded) {
            if (err) {
                res.status(400).send('유효하지 않은 accToken 입니다.')
                // 자동으로 rfTokenRequest???
            }
            else {
                // 유효할 경우 userData를 보내줌..
                const userData = await Users.findOne({
                    where: {
                        id: decoded.id,
                        username: decoded.username,
                    }
                })
                
                delete userData.dataValues.hashedPw;
                res.status(200).json({userData: userData.dataValues});
            }
        })
    }
}