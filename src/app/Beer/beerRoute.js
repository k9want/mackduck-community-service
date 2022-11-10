const beer = require("./beerController");
const jwtMiddleware = require("../../../config/jwtMiddleware");
module.exports = function(app){
    const beer = require('./beerController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //7. 홈/검색창 기본창 화면(최근검색어 & 인기검색어) o
    app.get('/search/recent', jwtMiddleware, beer.getSearchRecent)

    //8. 홈/검색창 입력시 화면 맥주이름 리스트 o
    app.get('/search/q', beer.getSearchInput);

    //9. 홈/검색창 완료시 화면 맥주이름 리스트 o
    app.get('/search/beers/q', jwtMiddleware, beer.getSearchResult);

    //10. 맥주디테일화면(리뷰포함) 조회
    app.get('/beers/:beerId', jwtMiddleware, beer.getBeerDetail);

    //11-1(1). 리뷰탭용 맥주상세화면용
    app.get('/beers/:beerId/reviews', jwtMiddleware, beer.getBeerReview)

    //11-1(2). 리뷰 전체보기-스크롤할 때
    app.get('/beers/:beerId/reviews/scroll', jwtMiddleware, beer.getBeerReviewScroll)

    //11-2. 리뷰 사진더보기
    app.get('/beers/:beerId/reviews/images', beer.getBeerReviewImageList)

    //11-3. 리뷰 사진 더보기-리뷰 보러가기 o
    app.get('/beers/reviews/:reviewId', jwtMiddleware, beer.getBeerShowReviewByReviewId)

    //12. 맥주 디테일 맛과 향 조회
    app.get('/beers/:beerId/favor-smell', beer.getBeerFavorSmell)

    //13. 맥주 디테일 유사맥주, 안주 조회
    app.get('/beers/:beerId/related-dish/:beerKindId', beer.getBeerRelatedDish)

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API