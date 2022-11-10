const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (kakaoId, nickname, gender, age, beerKindId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();


        const kakaoIdCheckResult = await userProvider.kakaoIdCheck(kakaoId);

        if (kakaoIdCheckResult.length > 0) {
            connection.release();
            return response(baseResponse.USER_USERID_ALREADY_EXIST);
        }

        const insertUserParams = [kakaoId, nickname, gender, age, beerKindId];

        const userIdResult = await userDao.insertUser(connection, insertUserParams);
        // console.log(`추가된 회원 : ${userIdResult[0].insertId}`)

        let token = await jwt.sign ( {
                userId : userIdResult[0].insertId
            },
            secret_config.jwtsecret,
            {
                expiresIn : "365d",
                subject : "userInfo",
            }
        );

        await connection.commit();
        connection.release();
        return response(baseResponse.SIGNUP_SUCCESS, {'userId' : userIdResult[0].insertId, 'nickname':nickname, 'jwt' : token});

    } catch (err) {
        logger.error(`App - createUserSignUp Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};




// // TODO: After 로그인 인증 방법 (JWT)
// exports.postSignIn = async function (email, password) {
//     try {
//         // 이메일 여부 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
//
//         const selectEmail = emailRows[0].email
//
//         // 비밀번호 확인
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");
//
//         const selectUserPasswordParams = [selectEmail, hashedPassword];
//         const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
//
//         if (passwordRows[0].password !== hashedPassword) {
//             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         }
//
//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(email);
//
//         if (userInfoRows[0].status === "INACTIVE") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "DELETED") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }
//
//         console.log(userInfoRows[0].id) // DB의 userId
//
//         //토큰 생성 Service
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].id,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 expiresIn: "365d",
//                 subject: "userInfo",
//             } // 유효 기간 365일
//         );
//
//         return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});
//
//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}




//유저 닉네임 수정 API 4
exports.editUserNickname = async function (userId, nickname) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();

        //닉네임 중복 검사
        const userNicknameCheckResult = await userDao.selectUserNicknameCheck(connection, nickname);
        if (userNicknameCheckResult.length > 0) {
            connection.release();
            return response(baseResponse.SIGNUP_REDUNDANT_NICKNAME)
        }


        //닉네임 수정
        const patchUserNicknameParams = [nickname, userId]
        const editUserNicknameResult = await userDao.updateUserNickname(connection, patchUserNicknameParams)

        await connection.commit();
        connection.release();
        return response(baseResponse.USER_NICKNAME_UPDATE_SUCCESS, {'nickname': nickname});

    }catch(err) {
        logger.error(`App - editUserNicknameEdit Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



//6. 개인정보 수정(성별,나이,취향)
exports.editUserInfo = async function (userId, gender, age, beerKindId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();

        //닉네임 수정
        const patchUserInfoParams = [gender, age, beerKindId, userId]
        const editUserNicknameResult = await userDao.updateUserInfo(connection, patchUserInfoParams)

        await connection.commit();
        connection.release();
        return response(baseResponse.USER_INFO_UPDATE_SUCCESS);

    }catch(err) {
        logger.error(`App - editUserInfoEdit Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};











//냉장고 수정 API16
exports.editUserRefrigerator = async function (userId, beerId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //유저 냉장고 조회
        const selectUserRefrigeratorCheckRows = await userProvider.userRefrigeratorCheck(userId, beerId);
        
        //상태확인을 위해서
        // console.log(selectUserRefrigeratorCheckRows[0].status)

        //아예 없는 경우
        if (selectUserRefrigeratorCheckRows.length < 1) {

            connection.release();
            return response(baseResponse.REFRIGERATOR_BEERID_UPDATE_NOT_EXIST)
        }

        //비활성화인 경우는 해당 beerId가 없는 경우
        if (selectUserRefrigeratorCheckRows[0].status == 'INACTIVE') {
            // console.log('띠용?')
            connection.release();
            return response(baseResponse.REFRIGERATOR_BEERID_UPDATE_NOT_EXIST);
        }

        //냉장고에 해당 beerId의 status가 활성화인경우 삭제한다.
        // console.log('이거지!!')
        const editUserRefrigeratorResult = await userDao.updateUserRefrigeratorAtUpdate(connection, selectUserRefrigeratorCheckRows[0].id)

        await connection.commit();
        connection.release();
        return response(baseResponse.REFRIGERATOR_BEERID_DELETE_SUCCESS, {'DeleteBeerId': beerId});

    }catch(err) {
        logger.error(`App - editUserRefrigerator Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



//내 리뷰 수정(완료버튼 눌렀을 때!) - API 21
exports.editUserReviewEdit = async function (reviewId, score, description, imageList) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //삭제할 리뷰있는지 확인
        const userReviewListCheckRows = await userProvider.userReviewListCheck(reviewId);

        if (userReviewListCheckRows.length < 1 ) {
            connection.release();
            return response(baseResponse.USER_REVIEWBYREVIEWID_NOT_EXIST)
        }

        //리뷰 수정
        const insertUserReviewEdit = [ score, description, reviewId ]
        const updateUserReviewEditResult = await userDao.updateUserReviewEdit(connection, insertUserReviewEdit)

        //기존 리뷰이미지 INACTIVE로
        const updateUserReviewImageDeleteResult = await userDao.updateUserReviewImageDelete(connection, reviewId)

        //새로운 이미지 리스트 업데이트
        if (imageList.length > 0) {
            for (const imageUrl of imageList){
                const insertReviewImageResult = await userDao.insertUserReviewImage(connection, reviewId, imageUrl)
                // console.log(insertReviewImageResult);
            }
        }

        await connection.commit();
        connection.release();
        return response(baseResponse.USER_REVIEW_UPDATE_SUCCESS, {'UpdateReviewId': reviewId});

    }catch(err) {
        logger.error(`App - editUserReviewEdit Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



//내 리뷰 보기-삭제하기 - API 22
exports.editUserReviewDelete = async function (reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //삭제할 리뷰있는지 확인
        const userReviewListCheckRows = await userProvider.userReviewListCheck(reviewId);

        if (userReviewListCheckRows.length < 1 ) {
            connection.release();
            return response(baseResponse.USER_REVIEWBYDELETE_NOT_EXIST)
        }

        //리뷰 삭제
        const updateUserReviewDeleteResult = await userDao.updateUserReviewDelete(connection, reviewId)

        //리뷰 이미지가 있는지 판단후 우선 없어도 되는듯 일단은 보류

        //리뷰 이미지도 삭제
        const updateUserReviewImageDeleteResult = await userDao.updateUserReviewImageDelete(connection, reviewId)

        // //해당 리뷰를 좋아요하는 테이블도 삭제 (추후 고려할것)
        const updateUserReviewLikeDeleteResult = await userDao.updateUserReviewLikeAllDelete(connection, reviewId)


        //스티커테이블에서 찐으로 DELETE처리
        const deleteStickerResult = await userDao.deleteUserSticker(connection, reviewId)


        await connection.commit();
        connection.release();
        return response(baseResponse.USER_REVIEWID_DELETE_SUCCESS, {'DeleteReviewId': reviewId});

    }catch(err) {
        logger.error(`App - editUserReviewDelete Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};


//최근검색어 전체삭제 API
exports.editUserRecentDelete = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //삭제할 최근어 검색어 확인
        const userRecentListCheckRows = await userProvider.userRecentListCheck(userId);

        //있으면 삭제
        if (userRecentListCheckRows.length < 1 ) {
            connection.release();
            return response(baseResponse.USER_RECENT_NOT_EXIST)
        }

        //최근 검색어 전부 삭제
        const updateUserReviewDeleteResult = await userDao.updateUserRecentListDelete(connection, userId)

        await connection.commit();
        connection.release();
        return response(baseResponse.USER_RECENTLIST_DELETE_SUCCESS);

    }catch(err) {
        logger.error(`App - editUserRecentListDelete Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};




//회원탈퇴 API *
exports.editUserSignOut = async function (userId, description) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const userCheckForSingOutReuslt =await userDao.selectUserCheck(connection, userId)

        if(userCheckForSingOutReuslt.length < 1){
            connection.release();
            return response(baseResponse.USER_SIGNOUT_NOT_EXIST);
        }

        const insertUserSignOutFeedbackResult = await userDao.insertUserSignOutFeedback(connection, userId, description)

        // console.log(userCheckForSingOutReuslt)

        //유저
        const updateUserSignOutResult = await userDao.updateUserSignOut(connection, userId)

        //리뷰
        const updateReviewSignOutResult =await userDao.updateReviewSignOut(connection, userId)

        //사진
        const updateReviewImageSignOutResult =await userDao.updateReviewImageSignOut(connection, userId)

        //냉장고
        const updateRefrigeratorSignOutResult =await userDao.updateRefrigeratorSignOut(connection, userId)

        //스티커
        const updateStickerSignOutResult =await userDao.updateStickerSignOut(connection, userId)

        //최근 검색어 전부 삭제
        const updateUserReviewDeleteResult = await userDao.updateUserRecentListDelete(connection, userId)

        await connection.commit();
        connection.release();
        return response(baseResponse.USER_SIGNOUT_SUCCESS);

    }catch(err) {
        logger.error(`App - editUserSignOut Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};





//맥주 추가 API15
exports.createUserRefrigerator = async function (userId, beerId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //유저 냉장고 조회
        const selectUserRefrigeratorCheckRows = await userProvider.userRefrigeratorCheck(userId, beerId);

        //상태확인을 위해
        // console.log(selectUserRefrigeratorCheckRows[0].status)
        // console.log(selectUserRefrigeratorCheckRows.length)

        if (selectUserRefrigeratorCheckRows.length > 0) {
            if (selectUserRefrigeratorCheckRows[0].status == 'ACTIVE') {
                // console.log('띠용?')
                connection.release();
                return response(baseResponse.REFRIGERATOR_BEERID_EXIST);
            }

            if (selectUserRefrigeratorCheckRows[0].status == 'INACTIVE') {
                // console.log('HI')
                //냉장고 관심맥주가 만약에 INACTIVE라면 ACTIVE되게끔한다.(추가하지않고 수정)
                // console.log(selectUserRefrigeratorCheckRows[0].id)

                const patchUserRefrigeratorRows = await userDao.updateUserRefrigeratorAtInsert(connection, selectUserRefrigeratorCheckRows[0].id);
                await connection.commit();
                connection.release();
                return response(baseResponse.REFRIGERATOR_BEERID_ACTIVE_SUCCESS,{'AddBeerId': beerId});

            }
        }
        const insertUserRefrigeratorParams = [userId, beerId];

        const userRefrigeratorResult = await userDao.insertUserRefrigerator(connection, insertUserRefrigeratorParams);
        await connection.commit();
        connection.release();
        return response(baseResponse.REFRIGERATOR_BEERID_ADD_SUCCESS, {'AddBeerId': beerId});

    }catch(err) {
        logger.error(`App - createUserRefrigerator Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



//api 24 리뷰 좋아요 추가
exports.createUserReviewLike = async function (userId, reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //좋아요할 리뷰가 존재하는지
        const selectReviewCheckRows = await userDao.selectReviewCheck(connection, reviewId);

        //리뷰없다면?
        if(selectReviewCheckRows.length < 1){
            connection.release();
            return response(baseResponse.REVIEW_LIKE_NOT_EXIST);
        }

        //유저 좋아요조회 (where에 status 안 거르고 가져온다.)
        const selectUserReviewLikeCheckRows = await userProvider.userReviewLikeCheck(userId, reviewId);

        // active => inactive
        if (selectUserReviewLikeCheckRows.length > 0) {

            if (selectUserReviewLikeCheckRows[0].status == 'ACTIVE') {
                const patchUserReviewLikeCheckDeleteRows = await userDao.updateUserReviewLikeDelete(connection, selectUserReviewLikeCheckRows[0].id);

                await connection.commit();
                connection.release();
                return response(baseResponse.REVIEWLIKEID_INACTIVE_SUCCESS,{'DeleteLikeReviewId': reviewId});
            }

            // inactive => active
            if (selectUserReviewLikeCheckRows[0].status == 'INACTIVE') {

                const patchUserReviewLikeCheckRows = await userDao.updateUserReviewLikeAdd(connection, selectUserReviewLikeCheckRows[0].id);
                await connection.commit();
                connection.release();
                return response(baseResponse.REVIEWLIKEID_ACTIVE_SUCCESS,{'AddLikeReviewId': reviewId});

            }
        }


        const insertUserReviewLikeParams = [userId, reviewId];
        const userReviewLikeResult = await userDao.insertUserReviewLike(connection, insertUserReviewLikeParams);
        await connection.commit();
        connection.release();
        return response(baseResponse.REVIEW_LIKE_SUCCESS, {'AddReviewLikeId': reviewId});

    }catch(err) {
        logger.error(`App - createUserReviewLike Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};





// API 18 리뷰 작성
exports.createUserReview = async function (userId, beerId, score, description, imageList) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //리뷰 params
        const insertUserReviewParams = [userId, beerId, score, description];

        //리뷰 생성
        const insertReviewResult = await userDao.insertUserReview(connection, insertUserReviewParams)
        // console.log(insertReviewResult[0].insertId)
        const reviewId = insertReviewResult[0].insertId
        if(imageList.length > 0) {
            for (const imageUrl of imageList){
                 const insertReviewImageResult = await userDao.insertUserReviewImage(connection, reviewId, imageUrl)
                // console.log(insertReviewImageResult);
            }
        }

        //스티커 로직 시작(1)
        //1. 스티커 조회 있는지 없는지
        //있다면? popUp Y
        //없다면? popUp N
        //해당 스티커 테이블에 추가 (

        const selectBeerKindIdByBeerId = await userDao.selectUserBeerKindIdByBeerId(connection, beerId);
        const beerKindId = selectBeerKindIdByBeerId[0].beerKindId
        // console.log(selectBeerKindIdByBeerId)
        // console.log(beerKindId)

        let ShowPopUp = 'N'

        const selectUserStickerPopUpCheck = await userDao.selectUserStickerPopUpCheck(connection, userId, beerKindId)

        // console.log(selectUserStickerPopUpCheck.length)
        if (selectUserStickerPopUpCheck.length < 1){
            ShowPopUp = 'Y'
        }

        const insertUserStickerParams = [userId, beerKindId, reviewId]
        const insertUserStickerResult = await userDao.insertUserSticker(connection, insertUserStickerParams)


        await connection.commit();
        connection.release();
        return response(baseResponse.USER_REVIEW_SUCCESS,{'AddReviewId': reviewId ,'stickerIndex':beerKindId, 'popUpCheck': ShowPopUp});


    }catch(err) {
        logger.error(`App - createUserReview Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



//23. 리뷰 신고하기
exports.createUserReport = async function (userId, reviewId, reportIndex) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //reviewId로 리뷰 있는지 없는지 확인하기
        const selectReviewCheckRows = await userDao.selectReviewCheck(connection, reviewId);

        //리뷰없다면?
        if(selectReviewCheckRows.length < 1){
            connection.release();
            return response(baseResponse.REVIEW_REPORT_NOT_EXIST);
        }

        //report params
        const insertUserReportParams = [userId, reviewId, reportIndex];

        //report 신고하기
        const insertUserReportResult = await userDao.insertUserReport(connection, insertUserReportParams)

        await connection.commit();
        connection.release();
        return response(baseResponse.REVIEW_REPORT_SUCCESS);

    }catch(err) {
        logger.error(`App - createUserReport Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};




//25. 피드백보내기 생성
exports.createUserFeedback = async function (userId, description) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //피드백 params
        const insertUserFeedbackParams = [userId, description];

        //피드백 생성
        const insertUserFeedbackResult = await userDao.insertUserFeedback(connection, insertUserFeedbackParams)

        await connection.commit();
        connection.release();
        return response(baseResponse.USER_FEEDBACK_SUCCESS);

    }catch(err) {
        logger.error(`App - createUserFeedback Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};





//29 맥덕이에게 전달되었습니다.
exports.createUserBeerFeedback = async function (userId, keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //맥주피드백 params
        const insertUserBeerFeedbackParams = [userId, keyword];

        //맥주피드백 생성
        const insertUserBeerFeedbackResult = await userDao.insertUserBeerFeedback(connection, insertUserBeerFeedbackParams)

        await connection.commit();
        connection.release();
        return response(baseResponse.BEER_FEEDBACK_SUCCESS);

    }catch(err) {
        logger.error(`App - createUserBeerFeedback Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



//api 30 관심 목록 저장 버튼 (냉장고에 추가하는거)냉장고 버튼
exports.createUserBeerLikeButton = async function (userId, beerId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //냉장고 아이디가 있는지 없는지
        const selectUserRefrigeratorCheckRows = await userDao.selectUserRefrigeratorCheck(connection, userId, beerId);

        // active => inactive
        if (selectUserRefrigeratorCheckRows.length > 0) {

            const refrigeratorId = selectUserRefrigeratorCheckRows[0].id

            if (selectUserRefrigeratorCheckRows[0].status == 'ACTIVE') {
                const patchUserRefrigeratorCheckDeleteRows = await userDao.updateUserRefrigeratorAtUpdate(connection, refrigeratorId );

                await connection.commit();
                connection.release();
                return response(baseResponse.REFRIGERATOR_BEERID_DELETE_SUCCESS,{'DeleteLikeBeerId': beerId});
            }

            // inactive => active
            if (selectUserRefrigeratorCheckRows[0].status == 'INACTIVE') {
                const patchUserRefrigeratorCheckRows = await userDao.updateUserRefrigeratorAtInsert(connection, refrigeratorId);

                await connection.commit();
                connection.release();
                return response(baseResponse.REFRIGERATOR_BEERID_ACTIVE_SUCCESS,{'AddLikeBeerId': beerId});

            }
        }

        const insertUserBeerLikeButtonParams = [userId, beerId];
        const userBeerLikeButtonResult = await userDao.insertUserRefrigerator(connection, insertUserBeerLikeButtonParams);
        await connection.commit();
        connection.release();
        return response(baseResponse.REFRIGERATOR_BEERID_ADD_SUCCESS, {'AddBeerLikeId': beerId});

    }catch(err) {
        logger.error(`App - createUserRefrigeratorLikeButton Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};