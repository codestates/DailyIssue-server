// accToken이 유효하다면, mypage에서 필요한 정보를 보내준다.
const jwt = require('jsonwebtoken');
const { user, like } = require('../../models');
// GET
module.exports = async function(req, res) {
    if (!req.headers.authorization) {
        res.status(400).send('accToken이 필요합니다.');
    }
    else {
        const token = await req.headers.authorization.split('Bearer ')[1];
        jwt.verify(token, 'salt', async function(err, decoded) {
            if (err) {
                res.status(400).send('유효하지 않은 accToken입니다.')
            }
            else {
                // pw 수정 버튼을 누르지 않았을 때,
                const userData = await user.findOne({
                where: {
                    id: decoded.id,
                    username: decoded.username,
                    }
                })
                delete userData.dataValues.hashedpw;

                like.count({
                    where: {
                        userId: decoded.id,
                    }
                })
                .then(result => {
                    res.status(200).json({userData: userData.dataValues, like: result});
                })
            }
        })
    }
}

// 비밀번호 수정 관련...
// 비밀번호 수정 버튼 클릭 시, 현재 비밀번호 입력 * 2 + 변경 비밀번호 입력 창이 뜨고
// 그 데이터가 서버에 도달한 뒤, 현재 비밀번호 유효성 검사 후 옳다면 비밀번호 변경 시킴..