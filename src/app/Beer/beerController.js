const jwtMiddleware = require("../../../config/jwtMiddleware");
const beerProvider = require("../../app/Beer/beerProvider");
const beerService = require("../../app/Beer/beerService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const userService = require("../../app/User/userService");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email, password, nickname} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname
    );

    return res.send(signUpResponse);
};


/**
 * API No. 7
 * API Name : 홈/검색창 터치 시 화면
 * [GET] /search/recent
 */
exports.getSearchRecent = async function (req, res) {

    const userId = req.verifiedToken.userId
    // const keyword = req.query.keyword

    // if(!keyword)
    //     return res.send(response(baseResponse.SEARCH_KEYWORD_INPUT));

    const beerSearchRecentInput = await beerProvider.beerSearchRecentInput(userId);

    return res.send(beerSearchRecentInput);
};


/**
 * API No. 8
 * API Name : 홈/검색창 입력시 화면 맥주이름 리스트
 * [GET] /search/q
 */
exports.getSearchInput = async function (req, res) {

    // const userId = req.verifiedToken.userId
    const keyword = req.query.keyword

    if(!keyword)
        return res.send(response(baseResponse.SEARCH_KEYWORD_INPUT));

    const beerSearchInput = await beerProvider.beerSearchInput(keyword);

    return res.send(beerSearchInput);
};



/**
 * API No. 9
 * API Name : 홈/검색창('단어'검색<완료>시 리스트화면)
 * [GET] /search/beer/q
 */
exports.getSearchResult = async function (req, res) {

    const userId = req.verifiedToken.userId
    const keyword = req.query.keyword

    if(!keyword)
        return res.send(response(baseResponse.SEARCH_KEYWORD_INPUT));

    // const beerSearchResult = await beerProvider.beerSearchResult(keyword);
    const editUserNicknameResponse = await beerService.postUserSearchKeyword(userId, keyword);

    return res.send(editUserNicknameResponse);
};


/**
 * API No. 10
 * API Name : 맥주디테일화면(리뷰포함) 조회
 * [GET] '/beers/:beerId'
 */

exports.getBeerDetail = async function (req, res) {

    const userId = req.verifiedToken.userId
    const beerId  = req.params.beerId

    if(!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    const beerDetailReviewResult = await beerProvider.beerDetail(userId, beerId)

    return res.send(beerDetailReviewResult);
};

/**
 * API No. 11-1(1)
 * API Name : 전체 리뷰보기 조회
 * [GET] '/beers/:beerId/reviews'
 */
exports.getBeerReview = async function (req, res) {

    const userId = req.verifiedToken.userId
    let rowNumber =req.query.rowNumber
    const beerId  = req.params.beerId


    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if(!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    if(rowNumber == 0) {
        rowNumber = 99999999999999999999
    }
    const beerReviewResult = await beerProvider.beerReview(userId, beerId, rowNumber);
    return res.send(beerReviewResult);

    // const beerOnlyReviewResult = await beerProvider.beerOnlyReview(userId, beerId, rowNumber);
    // return res.send(beerOnlyReviewResult);

};

/**
 * API No. 11-1(2)
 * API Name : 리뷰 전체보기-스크롤할 때
 * [GET] '/beers/:beerId/reviews/scroll'
 */
//리뷰전체보기
exports.getBeerReviewScroll = async function (req, res) {

    const userId = req.verifiedToken.userId
    let rowNumber =req.query.rowNumber
    const beerId  = req.params.beerId


    if (!userId) {
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    }

    if(!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    if (rowNumber == 0){
        rowNumber = 99999999999999999999
    }
    // const beerReviewResult = await beerProvider.beerReview(userId, beerId, rowNumber);
    // return res.send(beerReviewResult);

    const beerOnlyReviewResult = await beerProvider.beerOnlyReview(userId, beerId, rowNumber);
    return res.send(beerOnlyReviewResult);

};



/**
 * API No. 11-2
 * API Name : 리뷰 사진 더보기
 * [GET] /beers/:beerId/reviews/images
 */
exports.getBeerReviewImageList = async function (req, res) {

    // const userId = req.verifiedToken.userId
    const beerId  = req.params.beerId
    let rowNumber =req.query.rowNumber

    if(!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    if (rowNumber == 0){
        rowNumber = 99999999999999999999
    }

    // console.log(rowNumber)

    const beerReviewImageListResult = await beerProvider.beerReviewImageListMore(beerId, rowNumber);

    return res.send(beerReviewImageListResult);
};




/**
 * API No. 11-3
 * API Name : 리뷰 사진 더보기-리뷰 보러가기
 * [GET] /beers/:beerId/reviews/:reviewId
 */
exports.getBeerShowReviewByReviewId = async function (req, res) {

    const userId = req.verifiedToken.userId
    const {reviewId }  = req.params

    // if(!beerId) {
    //     return res.send(response(baseResponse.BEER_ID_EMPTY));
    // }

    if(!reviewId) {
        return res.send(response(baseResponse.REVIEW_REVIEWID_EMPTY));
    }

    const beerShowReviewByReviewIdResult = await beerProvider.beerShowReviewByReviewId(reviewId, userId);

    return res.send(beerShowReviewByReviewIdResult);
};





/**
 * API No. 12
 * API Name : 맥주 디테일 맛과 향 조회
 * [GET] /beers/:beerId/favor-smell
 */
exports.getBeerFavorSmell = async function (req, res) {

    // const userId = req.verifiedToken.userId
    const beerId  = req.params.beerId

    if(!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    const beerFavorSmellResult = await beerProvider.beerFavorSmell(beerId);

    return res.send(beerFavorSmellResult);
};




/**
 * API No. 13
 * API Name : 맥주 디테일 유사맥주, 안주 조회
 * [GET] /beers/:beerId/related-dish/beerKindId
 */
exports.getBeerRelatedDish = async function (req, res) {

    // const userId = req.verifiedToken.userId
    const {beerId, beerKindId}  = req.params

    if(!beerId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    if(!beerKindId) {
        return res.send(response(baseResponse.BEER_ID_EMPTY));
    }

    const beerRelatedDishResult = await beerProvider.beerRelatedDish(beerKindId,beerId);

    return res.send(beerRelatedDishResult);
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











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
