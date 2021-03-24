const jwt = require('jsonwebtoken');
const { user } = require('../../models');
// POST

module.exports = async function(req, res) {
    // input
    // req.body.password, req.body.nicknameFix
    // accToken 검사
    if (!req.headers.authorization) {
        res.status(400).send('accToken이 필요합니다.');
    }
    else {
        const token = await req.headers.authorization.split('Bearer ')[1];
        jwt.verify(token, 'salt', async function(err, decoded) {
            if (err) {
                res.status(400).send('유효하지 않은 accToken입니다.');
            }
            else {
                const userData = await user.findOne({
                    where: {
                        id: decoded.id,
                        username: decoded.username,
                    }
                })
                if (isVerify) {
                    // 현재 비밀번호가 일치한다면,
                    await user.update({nickname: req.body.nicknameFix || userData.dataValues.nickname}, {where: {hashedpw: userData.dataValues.hashedpw}});
    
                    res.status(200).send('닉네임 변경이 완료되었습니다.');
                }
                else {
                    res.status(400).send('현재 비밀번호가 일치하지 않습니다.');
                }
            }
        })
    }
}
