const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const { user } = require('../../models');
// POST

module.exports = async function(req, res) {
    // input
    // req.body.password, req.body.fixPassword
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
                const isVerify = await passwordHash.verify(req.body.password, userData.dataValues.hashedpw);
                if (isVerify) {
                    // 현재 비밀번호가 일치한다면,
                    let hashedFixPassword = await passwordHash.generate(req.body.fixPassword);
                    await user.update({hashedpw: hashedFixPassword}, {where: {id: userData.dataValues.id}});
    
                    res.status(200).json({message: '비밀번호 수정이 완료되었습니다.'});
                }
                else {
                    res.status(400).send('현재 비밀번호가 일치하지 않습니다.');
                }
            }
        })
    }
    // decoded 정보의 db 정보의 hashedpw와 req.body.password가 일치하는 검사
    // req.body.fixPassword를 fixhashedpw로 만든 뒤 db의 hasedPw와 교체
    
    // 만약 이후 로그인을 다시 해야 한다면..
    // ac,rf 토큰 파괴

    // 로그인을 유지 시키려면
    // acc,rf 토큰 재부여
}