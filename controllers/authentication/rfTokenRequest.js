const jwt = require('jsonwebtoken');
const { user } = require('../../models');
// GET
// 검토완료
module.exports = async function (req, res) {
    // rfToken이 유효하면 accToken을 다시 보내줘야 함
    if (!req.cookies.rfToken) {
        res.status(400).send('rfToken이 주어지지 않았습니다.')
    }
    else {
        jwt.verify(req.cookies.rfToken, 'salt', async function(err, decoded) {
            if (err) {
                res.status(400).send('유효하지 않은 rkToken 입니다.');
            }
            else {
                // rfToken을 바탕으로 accToken을 줘야 하기 떄문에 정보를 다시 가져온다.
                    // 이 때, rfToken의 data를 사용한다.
                const userData = await user.findOne({
                    where: {
                        id: decoded.id
                    }
                })
                const accToken = await jwt.sign(
                    // payload
                    {
                        // 일단 다주자...
                        id: userData.dataValues.id,
                        username: userData.dataValues.username,
                        nickname: userData.dataValues.nickname,
                        email: userData.dataValues.email,
                        image: userData.dataValues.image,
                    }, 'salt',
                    // option
                    {
                        expiresIn: '10m'
                    }   
                );
                const rfToken = await jwt.sign(
                    //payload
                    {
                        id: userData.dataValues.id,
                    }, 'salt',
                    // option
                    {
                        expiresIn: '1h'
                    }
                );

                res.cookie('rfToken', rfToken);
                res.status(200).json({accToken: accToken});
            }
        })
    }
}