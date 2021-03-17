module.exports = {
    // authentication
    signUp: require('./authentication/signup'),
    login: require('./authentication/login'),
    accTokenRequestUser: require('./authentication/accTokenRequestUser'),
    rfTokenRequest: require('./authentication/rfTokenRequest'),
    // mypage
    changePwRequest: require('./mypage/changePwRequest'),
    mypageRequest: require('./mypage/mypageRequest'),
};