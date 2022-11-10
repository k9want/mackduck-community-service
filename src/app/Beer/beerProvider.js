const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const beerDao = require("./beerDao");
const {response} = require("../../../config/response");

// Provider: Read 비즈니스 로직 처리


// 최근검색어
exports.beerSearchRecentInput = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const beerSearchRecentKeywordInputResult = await beerDao.beerSearchRecentKeywordInput(connection, userId);

  //우선 예외처리 취소
  // if (!beerSearchRecentKeywordInput) {
  //   return response(baseResponse.SEARCH_INPUT_NOT_EXIST)
  // }

  const beerSearchReview = await beerDao.beerSearchPopular(connection)

  connection.release();

  return response(baseResponse.BEER_RECENT_SUCCESS,
      {"RecentKeyword": beerSearchRecentKeywordInputResult, "PopularBeer": beerSearchReview});
};





// 8. 검색 입력시
exports.beerSearchInput = async function (keyword) {
  const connection = await pool.getConnection(async (conn) => conn);
  const beerSearchInput = await beerDao.beerSearchInput(connection, keyword);

  if (beerSearchInput.length < 1) {
    connection.release()
    return response(baseResponse.SEARCH_INPUT_NOT_EXIST)
  }

  connection.release();

  return response(baseResponse.BEER_SEARCH_SUCCESS, beerSearchInput);
};


//9. 검색 결과
exports.beerSearchResult = async function (keyword) {
  const connection = await pool.getConnection(async (conn) => conn);
  const beerSearchResult = await beerDao.beerSearchResult(connection, keyword);

  if (beerSearchResult < 1) {
    connection.release();
    return response(baseResponse.SEARCH_RESULT_NOT_EXIST)
  }

  connection.release();
  return response(baseResponse.SEARCH_RESULT_EXIST, beerSearchResult);
};


//10. 맥주 디테일(+리뷰포함 x)
exports.beerDetail = async function (userId, beerId) {
  const connection = await pool.getConnection(async (conn) => conn);

  //상품 디테일
  const beerDetailResult = await beerDao.beerDetailResult(connection, userId, beerId);
  const beerDetailReviewResult = await beerDao.beerDetailReviewResult(connection, beerId);

  let userReviewWrite = 'N'
  const userReviewWriteCheckResult = await beerDao.userReviewWriteCheck(connection, userId);
  // console.log(userReviewWriteCheckResult.length)
  if (userReviewWriteCheckResult.length > 0) {
    userReviewWrite = 'Y'
  }



  // // 리뷰 통계
  // const beerReviewStaticsResult = await beerDao.beerReviewStatics(connection, beerId);
  //
  // // 리뷰 이미지
  // const beerReviewImageListResult = await beerDao.beerReviewImageList(connection, beerId);
  //
  // //리뷰 리스트
  // const beerReviewListResult = await beerDao.beerReviewList(connection, beerId);
  //
  // const beerDetailReviewResult = {"beerDetail": beerDetailResult,"reviewStatics": beerReviewStaticsResult ,"reviewImageList": beerReviewImageListResult,"reviewList": beerReviewListResult}
  //
  // if (beerDetailResult < 1) {
  //   return response(baseResponse.BEER_DETAIL_NOT_EXIST)
  // }
  //
  // connection.release();
  // return response(baseResponse.BEER_DETAIL_RESULT_SUCCESS, beerDetailReviewResult);

  if (!beerDetailResult) {
    connection.release();
    return response(baseResponse.BEER_DETAIL_NOT_EXIST)
  }

  beerDetailResult.reviewAverage = beerDetailReviewResult.reviewAverage
  beerDetailResult.reviewCount = beerDetailReviewResult.reviewCount
  beerDetailResult.userReviewWrite = userReviewWrite

  connection.release();
  return response(baseResponse.BEER_DETAIL_RESULT_SUCCESS, beerDetailResult);
};


//11-1. 리뷰 전체보기
exports.beerReview = async function (userId, beerId, rowNumber) {
  const connection = await pool.getConnection(async (conn) => conn);

  // 리뷰 통계
  const beerReviewStaticsResult = await beerDao.beerReviewStatics(connection, beerId);

  // 리뷰 이미지
  const beerReviewImageListResult = await beerDao.beerReviewImageList(connection, beerId);

  //리뷰 리스트
  const beerReviewListResult = await beerDao.beerReviewList(connection, userId, beerId, rowNumber);

  if (beerReviewListResult < 1) {
    connection.release();
    return response(baseResponse.REVIEW_RESULT_NOT_EXIST)
  }

  const reviewResult = {"reviewStatics": beerReviewStaticsResult , "reviewImageList": beerReviewImageListResult,"reviewList": beerReviewListResult}
  connection.release();

  return response(baseResponse.BEER_REVIEW_RESULT_SUCCESS, reviewResult);
};





//11-1(2) 스크롤했을 때
exports.beerOnlyReview = async function (userId, beerId, rowNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  //리뷰 리스트
  const beerReviewListResult = await beerDao.beerReviewListScroll(connection, userId, beerId, rowNumber);

  //리뷰 개수
  const beerReviewCountResult = await beerDao.beerReviewCount(connection, beerId);


  if (beerReviewListResult < 1) {
    connection.release();
    return response(baseResponse.REVIEW_RESULT_NOT_EXIST)
  }



  connection.release();
  return response(baseResponse.BEER_REVIEW_RESULT_ALL_SUCCESS, { "reviewCount": beerReviewCountResult.reviewCount , "reviewList" : beerReviewListResult });
};




//11-2. 리뷰 사진 더보기
exports.beerReviewImageListMore = async function (beerId, rowNumber) {
  const connection = await pool.getConnection(async (conn) => conn);

  // 리뷰 이미지 더보기
  const beerReviewImageListMoreResult = await beerDao.beerReviewImageListMore(connection, beerId, rowNumber);

  if (beerReviewImageListMoreResult < 1) {
    connection.release();
    return response(baseResponse.REVIEW_IMAGELISTMORE_NOT_EXIST)
  }

  const reviewImageListMore = []

  for (const reviewImageMore of beerReviewImageListMoreResult) {
    reviewImageListMore.push(reviewImageMore)
  }

  connection.release();
  return response(baseResponse.REVIEW_REVIEWIMAGELISTMORE_SUCCESS, reviewImageListMore);
  // return response(baseResponse.REVIEW_REVIEWIMAGELISTMORE_SUCCESS, {"reviewImageListMore": reviewImageListMore});
};


// 리뷰 사진 더보기 - 리뷰 보러가기
exports.beerShowReviewByReviewId = async function (reviewId, userId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectShowReviewParams = [userId, reviewId]
  const beerShowReviewResult = await beerDao.selectBeerShowReview(connection, selectShowReviewParams);

  if (!beerShowReviewResult) {
    connection.release();
    return response(baseResponse.REVIEW_RESULT_REVIEWID_NOT_EXIST)
  }



  const selectBeerShowReviewImageList = await beerDao.selectBeerShowReviewImageList(connection, reviewId);

  const beerShowReviewImageList = []


  for (const beerShowReviewImg of selectBeerShowReviewImageList) {
    beerShowReviewImageList.push(beerShowReviewImg)
  }

  beerShowReviewResult.reviewImgUrlList = beerShowReviewImageList


  connection.release();

  return response(baseResponse.BEER_REVIEW_SHOW_SUCCESS, beerShowReviewResult);
};






//12. 맛과 향 조회
exports.beerFavorSmell = async function (beerId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const beerFavorResult = await beerDao.selectBeerFavor(connection, beerId);
  const beerSmellResult = await beerDao.selectBeerSmell(connection, beerId);

  const favorList = []
  const smellList = []

  for (const favor of beerFavorResult) {
    favorList.push(favor)
  }

  for (const smell of beerSmellResult) {
    smellList.push(smell)
  }

  connection.release();
  return response(baseResponse.BEER_FAVORSMELL_SUCCESS, {"favorList" : favorList, "smellList": smellList});
};

//13. 맥주디테일 유사맥주,안주 조회
exports.beerRelatedDish = async function (beerKindId, beerId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const beerRelatedResult = await beerDao.selectBeerRelated(connection, beerKindId, beerId);
  const beerDishdescriptionResult = await beerDao.selectBeerDishDescription(connection, beerId);
  const beerDishResult = await beerDao.selectBeerDishList(connection, beerId);

  const relatedList = []
  const dishList = []

  for (const related of beerRelatedResult) {
    relatedList.push(related)
  }

  for (const dish of beerDishResult) {
    dishList.push(dish)
  }

  connection.release();

  return response(baseResponse.BEER_RELATEDDISH_SUCCESS, {"RelatedList" : relatedList,"DishDescription": beerDishdescriptionResult, "DishList": dishList});
};
















exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await beerDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await beerDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await beerDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};