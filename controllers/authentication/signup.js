const { user } = require('../../models');
const passwordHash = require('password-hash');
// POST
// 검토완료
module.exports = async function(req, res) {
    const checkLength = Object.keys(req.body).length;
    // username 중복되면 안됨!
    // email 중복되면 안됨!
    if (checkLength !== 4) {
        res.status(400).send('데이터 개수가 모자랍니다.');
    } 
    else {
        const checkEmail = await user.findOne({
            where: {
                email: req.body.email,
            }
        })
        const checkUserName = await user.findOne({
            where: {
                username: req.body.username,
            }
        })
        const checkNickName = await user.findOne({
            where: {
                nickname: req.body.nickname,
            }
        })
        // 중복 존재할 때,
        if (checkEmail || checkUserName || checkNickName) {
            res.status(409).send('이미 가입한 아이디/닉네임 회원입니다.');
        }
        else {
            let hashedPassword = await passwordHash.generate(req.body.password);
            console.log(hashedPassword);
            const userData = await user.create({
                username: req.body.username,
                nickname: req.body.nickname,
                // null??
                hashedpw: hashedPassword,
                email: req.body.email,
                image: '기본이미지 url',
            })
            delete userData.dataValues.hashedpw;
            // 회원가입 성공시 생성된 유저 정보 객체를 전달합니다.
            res.status(201).json(userData.dataValues);
        }
    }
}

// 회원가입 성공 또는 실패 시 토큰을 제공하지 않습니다.