const user = require("./userController");
const upload = require("../../../config/multer");
const passport = require("passport");
const jwtMiddleware = require("../../../config/jwtMiddleware");

module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    //카카오로그인 테스트완료
    // 1. 카카오로그인 o
    app.post('/users/kakao-login', user.kakaoLogin);
    // app.get('/kakao', passport.authenticate('kakao-login'));
    // app.get('/auth/kakao/callback', passport.authenticate('kakao-login', {
    //     successRedirect: '/',
    //     failureRedirect : '/',
    // }), (req, res) => {res.redirect('/');});

    // 3. 회원가입 o
    app.post('/sign-up', user.postsignUp);

    // 3-2. 닉네임 검사 조회 o
    app.get('/sign-up/q', user.getNicknameCheckSignUp)

    // 4. 유저닉네임 수정 o
    app.patch('/users/:userId/nickname', jwtMiddleware, user.patchUserNickname)

    // 5. 개인정보 수정전 조회 o
    app.get('/users/:userId/info', jwtMiddleware, user.getUserInfo)

    // 6. 개인정보 수정(성별,나이,취향) o
    app.patch('/users/:userId/info/edit',jwtMiddleware, user.patchUserInfo)

    //14. 유저 냉장고 조회 o
    app.get('/users/:userId/refrigerator', jwtMiddleware, user.getUserRefrigerator);

    //15. 유저 냉장고 맥주 추가(맥주 채우기) o
    app.post('/users/:userId/refrigerator', jwtMiddleware, user.postUserRefrigeartor);

    //16. 유저 냉장고 맥주 수정(맥주수정) 삭제 o
    app.patch('/users/:userId/refrigerator/status',jwtMiddleware, user.patchUserRefrigeartor);

    //17. 유저 스티커 조회 o
    app.get('/users/:userId/sticker', jwtMiddleware, user.getUserSticker);

    //18. 맥주 리뷰작성 o
    app.post('/users/:userId/review', jwtMiddleware, upload.array('imageList', 5), user.postUserWriteReview)

    //19. 내 리뷰 보기
    app.get('/users/:userId/reviews',jwtMiddleware, user.getUserReviewList);

    //20. 내 리뷰보기 - 수정하기(리뷰 수정전 해당 리뷰조회) o
    app.get('/users/:userId/reviews/:reviewId', jwtMiddleware, user.getUserReviewByReviewId);

    //21. 내 리뷰 수정 - (완료버튼 눌렀을때) o
    app.patch('/users/:userId/reviews/:reviewId/edit',jwtMiddleware, upload.array('imageList', 5), user.patchUserReviewEdit);

    //22. 내 리뷰보기 - 삭제하기(리뷰삭제) o
    app.patch('/users/:userId/reviews/:reviewId/status', jwtMiddleware, user.patchUserReviewDelete);

    //23. 리뷰신고하기(userId, reviewId, index) o
    app.post('/users/:userId/reviews/:reviewId/report', jwtMiddleware, user.postUserReport);

    //24. 도움이 됐어요(리뷰 좋아요 기능) o
    app.post('/users/:userId/reviews/:reviewId/like', jwtMiddleware, user.postUserReviewLike);

    //25. 피드백보내기 o
    app.post('/users/:userId/feedback', jwtMiddleware, user.postUserWriteFeedback);

    //26. 최근검색어 전체삭제 o
    app.patch('/users/:userId/recent/status',jwtMiddleware, user.patchUserRecentDelete);

    //27.카카오톡공유전 맥주정보조회
    app.get('/beers/:beerId/info-url', user.getBeerInfoUrl)

    //28. 맥주 추천 받기
    app.get('/users/:userId/beer-kind/:beerKindId' , jwtMiddleware , user.getUserBeersByBeerKind)

    //29. 맥덕이에게 전달되었습니다. o
    app.post('/users/:userId/beer-feedback', jwtMiddleware, user.postUserWriteBeerFeedback);

    //30. 관심목록추가(버튼용)- API 10, 28 o
    app.post('/users/:userId/beer-like', jwtMiddleware, user.postUserBeerLikeButton);

    // *. 회원탈퇴
    app.post('/sign-out', jwtMiddleware, user.postUserSignOut)





    //이미지테스트

    //이미지 업로드
    // app.post('/imageUpload', upload.single('image'), (req, res) => {
    //     console.log(req.file);
    //     return res.send(req.file.location)
    // }) // 클라이언트에서 넘어온 파일에 대한 정보가 req.file에 FILE 객체로 저장되어 있습니다.


    // app.post('/imageList', upload.array('imageList', 5), (req, res) => {
    //
    //     const imgUrlList = []
    //
    //     console.log(req.files)
    //     if(req.files != undefined) {
    //         // console.log(req.files.length);
    //         // console.log(req.files[0])
    //         if (req.files.length > 5) {
    //             return res.send('사진은 최대 5개까지만')
    //         }
    //         for (const imageUrl of req.files) {
    //             imgUrlList.push(imageUrl.location)
    //         }
    //     }
    //     return res.send(imgUrlList)
    // }); // 파일의 인덱스로 접근 // 위 single에서와 다르게 req.file이 아닌 req.files에로 넘어옵니다. })
    //








    // // 1. 유저 생성 (회원가입) API
    // app.post('/app/users', user.postUsers);
    //
    //
    //
    // // 2. 유저 조회 API (+ 검색)
    // app.get('/app/users',user.getUsers);
    //
    //
    // // TODO: After 로그인 인증 방법 (JWT)
    // // 로그인 하기 API (JWT 생성)
    // app.post('/app/login', user.login);
    //
    // // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API