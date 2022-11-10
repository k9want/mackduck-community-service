const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");
const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

// Provider: Read 비즈니스 로직 처리


//3-2 닉네임 검사 API
exports.userNicknameCheckResult = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userNicknameCheckResult = await userDao.selectUserNicknameCheck(connection, nickname);

  if (userNicknameCheckResult.length > 0) {
    connection.release();
    return response(baseResponse.SIGNUP_REDUNDANT_NICKNAME)
  }
  connection.release();

  return response(baseResponse.USER_NICKNAME_SUCCESS, {'nickname': nickname});
};



//5-1  유저 정보 성별,나이,취향
exports.userInfoByUserId = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userInfoByUserIdResult = await userDao.selectUserInfoByUserId(connection, userId);

  if (userInfoByUserIdResult.length < 1) {
    connection.release();
    return response(baseResponse.USER_INFO_NOT_EXIST)
  }

  connection.release();

  return response(baseResponse.USER_INFO_SUCCESS, userInfoByUserIdResult);
};



// 14. 유저 냉장고 조회
exports.userRefrigerator = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userRefrigeratorResult = await userDao.selectUserRefrigerator(connection, userId);

  if (userRefrigeratorResult < 1) {
    connection.release();
    return response(baseResponse.REFRIGERATOR_RESULT_NOT_EXIST)
  }

  connection.release();
  return response(baseResponse.USER_REFRIGERATOR_SUCCESS, userRefrigeratorResult);
};





// 17. 유저 userSticker 조회
exports.userSticker = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userStickerResult = await userDao.selectUserSticker(connection, userId);

  if (userStickerResult < 1) {
    connection.release();
    return response(baseResponse.STICKER_RESULT_NOT_EXIST)
  }

  connection.release();
  return response(baseResponse.USER_STICKER_SUCCESS, userStickerResult);
};



// 19. 유저 userReviewList 조회
exports.userReviewList = async function (userId, rowNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userReviewListResult = await userDao.selectUserReviewList(connection, userId, rowNumber);

  connection.release();

  if (userReviewListResult < 1) {
    return response(baseResponse.USER_REVIEWLIST_NOT_EXIST)
  }

  return response(baseResponse.USER_REVIEW_USERID_SUCCESS, userReviewListResult);
};



// 20. 내 리뷰보기 - 수정하기(리뷰 수정전 해당 리뷰조회) 조회
exports.userReviewByReviewId = async function (userId, reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);

  //리뷰가 해당 유저의 리뷰인지 확인하기 (그냥 넣으면 좋을것 같아서 추가했음)
  const userReviewByUserIdResult = await userDao.selectUserReviewByUserIdCheck(connection, reviewId)

  if (userReviewByUserIdResult.length < 1) {
    connection.release();
    return response(baseResponse.USER_REVIEWBYREVIEWID_NOT_EXIST)
  }

  if(userReviewByUserIdResult[0].userId != userId) {
    connection.release();
    return response(baseResponse.USERID_REVIEWUSERID_NOT_MATCH)
  }
  const reviewImageList = []

  const userReviewByReviewIdResult = await userDao.selectUserReviewByReviewId(connection, reviewId);
  const userReviewImageByReviewIdResult = await userDao.selectUserReviewImageByReviewId(connection, reviewId);

  for (const reviewImg of userReviewImageByReviewIdResult) {
    reviewImageList.push(reviewImg)
  }

  userReviewByReviewIdResult[0].reviewImgUrlList = reviewImageList

  connection.release();

  return response(baseResponse.REVIEW_REVIEWID_SUCCESS, userReviewByReviewIdResult);
};





//27. 카카오톡공유전 맥주정보조회
exports.userBeerInfoUrl = async function (beerId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userBeerInfoUrlResult = await userDao.selectUserBeerInfoUrl(connection, beerId);

  connection.release();

  if (userBeerInfoUrlResult < 1) {
    return response(baseResponse.BEER_INFO_NOT_EXIST)
  }

  return response(baseResponse.BEER_INFO_SUCCESS, userBeerInfoUrlResult[0]);
};






// /28. 맥주 추천 받기
exports.userBeersByBeerKind = async function (beerKindId) {
  const connection = await pool.getConnection(async (conn) => conn);

  // //(1) user의 beerKindId 받아오기
  // const userBeerKindIdByUserIdResult = await userDao.selectUserBeerKindIdByUserId(connection, userId)
  // const beerKindId = userBeerKindIdByUserIdResult[0].beerKindId

  //(2) 그걸로 조회하기
  const selectUserBeersByBeerKindIdResult = await userDao.selectUserBeersByBeerKindId(connection, beerKindId);

  // console.log(selectUserBeersByBeerKindIdResult)
  connection.release();

  if (selectUserBeersByBeerKindIdResult.length < 1){
    return response(baseResponse.BEER_BY_BEERKINDID_NOT_EXIST);
  }

  return response(baseResponse.BEER_BY_BEERKINDID_SUCCESS, selectUserBeersByBeerKindIdResult);
};














exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};






exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};


exports.userRefrigeratorCheck = async function (userId,beerId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userRefrigeratorCheckResult = await userDao.selectUserRefrigeratorCheck(connection, userId, beerId);
  connection.release();

  return userRefrigeratorCheckResult;
};


//reviewLike에 있는지 없는지 조회
exports.userReviewLikeCheck = async function (userId, reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userReviewLikeCheckResult = await userDao.userReviewLikeCheck(connection, userId, reviewId);
  connection.release();

  return userReviewLikeCheckResult;
};


// api 22 삭제 전 리뷰체크
exports.userReviewListCheck = async function (reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userReviewListCheckResult = await userDao.selectUserReviewListCheck(connection, reviewId);
  connection.release();

  return userReviewListCheckResult;
};


// api 26 최근 검색어 전체삭제 전 리뷰체크
exports.userRecentListCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserRecentListCheckResult = await userDao.selectUserRecentListCheck(connection, userId);
  connection.release();

  return selectUserRecentListCheckResult;
};



exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};


exports.kakaoIdCheck = async function (kakaoId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const kakaoIdCheckResult = await userDao.selectUserKakaoId(connection, kakaoId);

  connection.release();

  return kakaoIdCheckResult;
};


//이메일로
exports.getUserId = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserIdResult = await userDao.selectUserId(connection, email);
  connection.release();

  return selectUserIdResult;
};

//카카오아이디로
exports.getUserIdByKakaoId = async function (kakaoId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserIdByKakaoIdResult = await userDao.selectUserIdByKakaoId(connection, kakaoId);
  connection.release();

  return selectUserIdByKakaoIdResult[0];
};


exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};