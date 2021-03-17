const { user } = require('../../models');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');

// POST
// 검토완료
module.exports = async function(req, res) {
    // input 정보와 일치하는 데이터가 db에 존재하면 로그인을 통과 시킵니다.
        // need verify method??
    const checkData = await user.findOne({
        where: {
            username: req.body.username,
            // hashedpw: hashedPassword,
        }
    })

    console.log(`🚀hashedpw: ${checkData.dataValues.hashedpw}`);
    console.log(`🚀password: ${req.body.password}`)
    const isVerify = await passwordHash.verify(req.body.password, checkData.dataValues.hashedpw)
    if (checkData && isVerify) {
        // asign token
            // payload에는 민감한 정보 X
            // client에서 사용할 정보 O
        const accToken = await jwt.sign(
            // payload
            {
                // 일단 다주자...
                id: checkData.dataValues.id,
                username: checkData.dataValues.username,
                nickname: checkData.dataValues.nickname,
                email: checkData.dataValues.email,
                image: checkData.dataValues.image,
            }, 'salt',
            // option
            {
                expiresIn: '10m'
            }   
        );
        const rfToken = await jwt.sign(
            //payload
            {
                id: checkData.dataValues.id,
            }, 'salt',
            // option
            {
                expiresIn: '1h'
            }
        );
        // rftk은 cookie로 전달
        res.cookie('rfToken', rfToken);
        // acctk는 json으로 전달
        res.status(200).json({accToken: accToken});
    }
    else {
        res.status(400).send('로그인 정보가 잘못됐습니다.');
    }
}