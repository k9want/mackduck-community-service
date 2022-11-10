const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const beerProvider = require("../../app/Beer/beerProvider");
const upload = require("../../../config/multer");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }


//


/**
 * API No. 3-2
 * API Name : 닉네임 중복 검사 조회
 * [GET] /sign-up/nickname
 */
exports.getNicknameCheckSignUp = async function (req, res) {

    // const userId = req.verifiedToken.userId
    const nickname = req.query.nickname

    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    if (nickname.length > 6 || nickname.length < 2)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

    const userNicknameCheckResult = await userProvider.userNicknameCheckResult(nickname);

    return res.send(userNicknameCheckResult);
};



/**
 * API No. 5
 * API Name : 개인정보 수정전 조회(성별,나이,취향)
 * [GET] /users/:userId/info
 */
exports.getUserInfo = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const userInfoByUserIdResult = await userProvider.userInfoByUserId(userId);

    return res.send(userInfoByUserIdResult);
};




/**
 * API No. 14
 * API Name : 유저 냉장고조회 API
 * [GET] /users/:userId/refrigerator
 */
exports.getUserRefrigerator = async function (req, res) {

    const userId  = req.params.userId
    const userIdFromJWT = req.verifiedToken.userId


    if(!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const userRefrigeratorResult = await userProvider.userRefrigerator(userId);

    return res.send(userRefrigeratorResult);
};




/**
 * API No. 15
 * API Name : 유저 냉장고 맥주 추가(맥주 채우기) API
 * [POST] /users/:userId/refrigerator
 */
exports.postUserRefrigeartor = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId
    const { beerId } = req.body;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY))
    }

    const postUserRefrigerator = await userService.createUserRefrigerator(userId, beerId);


    return res.send(postUserRefrigerator);
};





/**
 * API No. 24-1
 * API Name : 도움이 됐어요(리뷰 좋아요 기능) API
 * [POST] /users/:userId/reviews/:reviewId/like
 */
exports.postUserReviewLike = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId
    const reviewId = req.params.reviewId;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!reviewId) {
        return res.send(response(baseResponse.REVIEW_REVIEWID_EMPTY))
    }

    const postUserReviewLike = await userService.createUserReviewLike(userId, reviewId);


    return res.send(postUserReviewLike);
};








/**
 * API No. 18
 * API Name : 맥주 리뷰작성 API
 * [POST] /users/:userId/review
 */
exports.postUserWriteReview =  async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId

    const { beerId, score, description} = req.body;
    let imageList = req.files


    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }


    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY))
    }

    if (!score) {
        return res.send(response(baseResponse.REVIEW_SCORE_EMPTY));
    }

    if (!description) {
        return res.send(response(baseResponse.REVIEW_DESCRIPTION_EMTPY));
    }

    // console.log(imageList)
    //이미지 있다면?
    if(imageList != undefined) {

        // console.log(req.files.length);
        // console.log(req.files[0])
        const imgUrlList = []

        if (req.files.length > 5) {
            return res.send('사진은 최대 5개까지만')
        }
        for (const imageUrl of req.files) {
            imgUrlList.push(imageUrl.location)
        }
        imageList = imgUrlList;
    //이미지 없다면?
    }else {
        imageList = []
    }

    const postUserRefrigerator = await userService.createUserReview(userId, beerId, score, description, imageList);


    return res.send(postUserRefrigerator);
};





/**
 * API No. 23
 * API Name : 리뷰신고하기 API
 * [POST] /users/:userId/reviews/:reviewId/report        (userId, reviewId, reportIndex)
 */
exports.postUserReport =  async function (req, res) {

    const userId = req.params.userId;
    const reviewId = req.params.reviewId
    const userIdFromJWT = req.verifiedToken.userId

    const { reportIndex } = req.body;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!reviewId) {
        return res.send(response(baseResponse.REVIEW_REVIEWID_EMPTY));
    }

    if (!reportIndex) {
        return res.send(response(baseResponse.REPORT_INDEX_EMPTY));
    }

    const postUserReport = await userService.createUserReport(userId, reviewId, reportIndex);

    return res.send(postUserReport);
};





/**
 * API No. 25
 * API Name : 피드백 보내기 API
 * [POST] /users/:userId/feedback
 */
exports.postUserWriteFeedback =  async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId

    const { description } = req.body;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!description) {
        return res.send(response(baseResponse.FEEDBACK_DESCRIPTION_EMTPY));
    }

    if (description.length > 500 || description.length < 20) {
        return res.send(response(baseResponse.FEEDBACK_DESCRIPTION_LENGTH));
    }

    const postUserFeedback = await userService.createUserFeedback(userId, description);

    return res.send(postUserFeedback);
};






/**
 * API No. 29
 * API Name : 맥덕이에게 전달되었습니다. API
 * [POST] /users/:userId/beer-feedback
 */
exports.postUserWriteBeerFeedback =  async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId

    const { keyword } = req.body;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!keyword) {
        return res.send(response(baseResponse.BEER_FEEDBACK_KEYWORD_EMTPY));
    }

    const postUserBeerFeedback = await userService.createUserBeerFeedback(userId, keyword);

    return res.send(postUserBeerFeedback);
};



/**
 * API No. 30
 * API Name : 관심목록추가(버튼용)- API 10, 28
 * [POST] /users/:userId/beer-like
 */
exports.postUserBeerLikeButton =  async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId

    const { beerId } = req.body;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    const postUserBeerLikeButton = await userService.createUserBeerLikeButton(userId, beerId);

    return res.send(postUserBeerLikeButton);
};


/**
 * API No.4
 * API Name : 유저 닉네임 수정 API
 * [PATCH] /users/:userId/nickname
 */
exports.patchUserNickname = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId
    const { nickname } = req.body;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    if (nickname.length > 6 || nickname.length < 2)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));


    const editUserNicknameResponse = await userService.editUserNickname(userIdFromJWT, nickname);


    return res.send(editUserNicknameResponse);
};



/**
 * API No.6
 * API Name : 개인정보 수정(성별,나이,취향) API
 * [PATCH] /users/:userId/info/edit
 */
exports.patchUserInfo = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId
    const {gender, age, beerKindId} = req.body

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!gender)
        return res.send(response(baseResponse.SIGNUP_GENDER_EMPTY));

    if (!age)
        return res.send(response(baseResponse.SIGNUP_AGE_EMPTY));

    if (!beerKindId)
        return res.send(response(baseResponse.SIGNUP_BEERKINDID_EMPTY));


    const editUserInfoResponse = await userService.editUserInfo(userIdFromJWT, gender, age, beerKindId);


    return res.send(editUserInfoResponse);
};





/**
 * API No. 16
 * API Name : 유저 냉장고 맥주 수정(맥주수정) API
 * [PATCH] /users/:userId/refrigerator/status
 */
exports.patchUserRefrigeartor = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId
    const { beerId } = req.body;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY))
    }

    const editUserRefrigeratorResponse = await userService.editUserRefrigerator(userId, beerId);


    return res.send(editUserRefrigeratorResponse);
};



/**
 * API No. 21
 * API Name : 내 리뷰 수정(완료버튼 눌렀을 때!) API
 * [PATCH] /users/:userId/reviews/:reviewId/edit
 */
exports.patchUserReviewEdit = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId
    const reviewId  = req.params.reviewId;
    const { score, description } = req.body;
    let imageList = req.files


    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!reviewId) {
        return res.send(response(baseResponse.REVIEW_REVIEWID_EMPTY))
    }

    if (!score) {
        return res.send(response(baseResponse.REVIEW_SCORE_EMPTY));
    }

    if (!description) {
        return res.send(response(baseResponse.REVIEW_DESCRIPTION_EMTPY));
    }

    // console.log(imageList)

    //이미지 있다면?
    if(imageList != undefined) {

        // console.log(req.files.length);
        // console.log(req.files[0])
        const imgUrlList = []

        if (req.files.length > 5) {
            return res.send('사진은 최대 5개까지만')
        }
        for (const imageUrl of req.files) {
            imgUrlList.push(imageUrl.location)
        }
        imageList = imgUrlList;
        //이미지 없다면?
    } else {
        imageList = []
    }

    const editUserReviewDeleteResponse = await userService.editUserReviewEdit(reviewId, score, description, imageList);


    return res.send(editUserReviewDeleteResponse);
};



/**
 * API No. 22
 * API Name : 내 리뷰 보기 - 삭제하기 API
 * [PATCH] /users/:userId/reviews/:reviewId/status
 */
exports.patchUserReviewDelete = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId
    const reviewId  = req.params.reviewId;

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!reviewId) {
        return res.send(response(baseResponse.REVIEW_REVIEWID_EMPTY))
    }

    const editUserReviewDeleteResponse = await userService.editUserReviewDelete(reviewId);


    return res.send(editUserReviewDeleteResponse);
};




/**
 * API No. 26
 * API Name : 최근검색어 전체삭제 API
 * [PATCH] /users/:userId/recent/status
 */
exports.patchUserRecentDelete = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const editUserRecentDeleteResponse = await userService.editUserRecentDelete(userId);


    return res.send(editUserRecentDeleteResponse);
};



/**
 * API No. *
 * API Name : 회원탈퇴 API
 * [PATCH] /sign-out
 */
exports.postUserSignOut = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId
    const {userId, description} = req.body

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!description) {
        return res.send(errResponse(baseResponse.USER_SINGOUT_EMTPY));
    }


    const editUserSignOutResponse = await userService.editUserSignOut(userId,description);


    return res.send(editUserSignOutResponse);
};





/**
 * API No. 17
 * API Name : 유저 스티커조회 API
 * [GET] /users/:userId/sticker
 */
exports.getUserSticker = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId
    const userId  = req.params.userId

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const userStickerResult = await userProvider.userSticker(userId);

    return res.send(userStickerResult);
};



/**
 * API No. 19
 * API Name : 내 리뷰보기 API
 * [GET] /users/:userId/reviews
 */
exports.getUserReviewList = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId
    const userId  = req.params.userId
    let rowNumber =req.query.rowNumber

    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }


    if (rowNumber == 0){
        rowNumber = 99999999999999999999
    }

    const userReviewListResult = await userProvider.userReviewList(userId, rowNumber);
    return res.send(userReviewListResult);
};



/**
 * API No. 20
 * API Name : 내 리뷰보기 - 수정하기(리뷰 수정전 해당 리뷰조회) API
 * [GET] /users/:userId/reviews/:reviewId
 */
exports.getUserReviewByReviewId = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId
    const userId  = req.params.userId
    const reviewId = req.params.reviewId

    if(!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if(!reviewId) {
        return res.send(response(baseResponse.REVIEW_REVIEWID_EMPTY));
    }

    const userReviewByReviewIdResult = await userProvider.userReviewByReviewId(userId, reviewId);

    return res.send(userReviewByReviewIdResult);
};



/**
 * API No. 27
 * API Name : 카카오톡공유 전 맥주정보조회 API
 * [GET] /beers/:beerId/info-url
 */
exports.getBeerInfoUrl = async function (req, res) {

    const beerId = req.params.beerId

    if(!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    const userBeerInfoUrlResult = await userProvider.userBeerInfoUrl(beerId);

    return res.send(userBeerInfoUrlResult);
};





/**
 * API No. 28
 * API Name : 맥주 추천 받기 API
 * [GET] /users/:userId/beer-kind/:beerKindId
 */
exports.getUserBeersByBeerKind = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId
    const userId  = req.params.userId
    const beerKindId = req.params.beerKindId

    if(!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if(!beerKindId) {
        return res.send(response(baseResponse.BEERKIND_ID_EMPTY));
    }

    const userBeersByBeerKindResult = await userProvider.userBeersByBeerKind(beerKindId);

    return res.send(userBeersByBeerKindResult);
};






/**
 * API No. 3
 * API Name : 회원가입 o
 * [POST] /sign-up
 */
exports.postsignUp = async function (req, res) {

    /**
     * Body: kakaoId, nickname, gender, age, beerKindId
     */
    const {kakaoId, nickname, gender, age, beerKindId} = req.body;

    // 빈 값 체크
    if (!kakaoId)
        return res.send(response(baseResponse.SIGNUP_KAKAOID_EMPTY));

    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    if (nickname.length > 6 || nickname.length < 2)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

    if (!gender)
        return res.send(response(baseResponse.SIGNUP_GENDER_EMPTY));

    if (!age)
        return res.send(response(baseResponse.SIGNUP_AGE_EMPTY));

    if (!beerKindId)
        return res.send(response(baseResponse.SIGNUP_BEERKINDID_EMPTY));


    // 형식 체크 (by 정규표현식)
    // 형식체크 한글만 가능하게끔
    // if (!regexEmail.test(email))
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        kakaoId, nickname, gender, age, beerKindId
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};



//카카오로그인 테스트
const passport = require('passport')
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");
const {logger} = require("../../../config/winston");
const axios = require("axios");
const KakaoStrategy = require('passport-kakao').Strategy

passport.use('kakao-login', new KakaoStrategy({
    clientID: '74f6d93ec4c069318f2e17cd075b2d37',
    callbackURL: '/auth/kakao/callback',
}, async (accessToken, refreshToken, profile, done) =>
{
    console.log(accessToken);
    console.log(profile);
}));

exports.kakaoLogin = async function(req, res) {

    const {accessToken} = req.body;

    if (!accessToken) {
        return res.send(errResponse(baseResponse.ACCESS_TOKEN_EMPTY)) // 2024 : accessToken을 입력해주세요.
    }

    try {
        let kakao_profile;

        try {
            kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            })
        } catch (err) {
            logger.info(`App - 유효하지 않는 액세스토큰 관련 에러-회원가입\n: ${err.message} \n${JSON.stringify(err)}`);
            return res.send(errResponse(baseResponse.ACCESS_TOKEN)); // 2025 : 유효하지 않는 엑세스 토큰입니다.
        }

        const kakaoId = kakao_profile.data.id
        const data = kakao_profile.data.kakao_account;

        // const email = data.email;

        // const emailCheckResult = await userProvider.emailCheck(email);
        //이때 != INACTIVE로 검색 회원탈퇴했다면 다시 회원가입하도록 설정
        const kakaoIdCheckResult = await userProvider.kakaoIdCheck(kakaoId);

        if (kakaoIdCheckResult.length > 0) {
            // const userInfoRow = await userProvider.getUserId(email);
            const userInfoRow = await userProvider.getUserIdByKakaoId(kakaoId);

            // console.log(userInfoRow.userId)

            let token = await jwt.sign ( {
                    userId : userInfoRow.userId
                },
                secret_config.jwtsecret,
                {
                    expiresIn : "365d",
                    subject : "userInfo",
                }
            );
            return res.send(response(baseResponse.SIGNIN_SUCCESS, {'userId' : userInfoRow.userId,'nickname':userInfoRow.nickname, 'jwt' : token }));
        }
        else {
            const result = {
                kakaoId : kakaoId
            }
            logger.info(`App - postSignIn Service kakaoId-Success \n`);
            return res.send(response(baseResponse.SIGNUP_POSSIBLE_SUCCESS, {'kakaoId': kakaoId}));
        }} catch(err) {
        logger.info(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}








/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
