module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    SEARCH_RESULT_EXIST : { "isSuccess": true, "code": 1001, "message":"검색 완료 성공" },
    BEER_FAVORSMELL_SUCCESS : { "isSuccess": true, "code": 1002, "message":"맥주 맛/향 조회 성공" },
    BEER_RELATEDDISH_SUCCESS : { "isSuccess": true, "code": 1003, "message":"유사맥주/안주 조회 성공" },
    USER_REFRIGERATOR_SUCCESS : { "isSuccess": true, "code": 1004, "message":"유저 냉장고 조회 성공" },
    USER_STICKER_SUCCESS : { "isSuccess": true, "code": 1005, "message":"유저 스티커 조회 성공" },
    BEER_REVIEW_RESULT_SUCCESS : { "isSuccess": true, "code": 1006, "message":"리뷰 조회 성공" },
    BEER_DETAIL_RESULT_SUCCESS : { "isSuccess": true, "code": 1007, "message":"상품 디테일 조회 성공" },
    REFRIGERATOR_BEERID_ADD_SUCCESS : { "isSuccess": true, "code": 1008, "message":"냉장고에 추가 성공" },
    REFRIGERATOR_BEERID_ACTIVE_SUCCESS : { "isSuccess": true, "code": 1009, "message":"냉장고 추가(ACTIVE로 수정) 성공" },
    REFRIGERATOR_BEERID_DELETE_SUCCESS : { "isSuccess": true, "code": 1010, "message":"냉장고에서 삭제 성공" },
    REVIEW_REVIEWID_SUCCESS : { "isSuccess": true, "code": 1011, "message":"리뷰 수정 전 리뷰조회 성공" },
    REVIEW_REVIEWIMAGELISTMORE_SUCCESS : { "isSuccess": true, "code": 1012, "message":"리뷰 이미지 더보기 성공" },
    USER_REVIEWID_DELETE_SUCCESS : { "isSuccess": true, "code": 1013, "message":"리뷰 삭제 성공" },
    USER_REVIEW_SUCCESS : { "isSuccess": true, "code": 1014, "message":"리뷰 작성 성공" },
    USER_REVIEW_UPDATE_SUCCESS : { "isSuccess": true, "code": 1015, "message":"리뷰 수정 성공" },
    SIGNIN_SUCCESS : { "isSuccess": true, "code": 1016, "message":"소셜로그인 성공" },
    SIGNUP_POSSIBLE_SUCCESS : { "isSuccess": true, "code": 1017, "message":"회원가입 가능합니다." },
    SIGNUP_SUCCESS : { "isSuccess": true, "code": 1018, "message":"회원가입 성공" },
    USER_NICKNAME_SUCCESS : { "isSuccess": true, "code": 1019, "message":"닉네임 설정 성공" },
    USER_NICKNAME_UPDATE_SUCCESS : { "isSuccess": true, "code": 1020, "message":"닉네임 수정 성공" },
    USER_INFO_SUCCESS : { "isSuccess": true, "code": 1021, "message":"유저 정보 조회 성공" },
    USER_INFO_UPDATE_SUCCESS : { "isSuccess": true, "code": 1022, "message":"유저 정보 수정 성공" },
    BEER_SEARCH_SUCCESS : { "isSuccess": true, "code": 1023, "message":"검색 입력 성공" },
    BEER_RECENT_SUCCESS : { "isSuccess": true, "code": 1024, "message":"최근검색어,인기맥주 조회 성공" },
    BEER_REVIEW_SHOW_SUCCESS : { "isSuccess": true, "code": 1025, "message":"리뷰 더보러가기 조회 성공" },
    USER_REVIEW_USERID_SUCCESS : { "isSuccess": true, "code": 1026, "message":"내 리뷰 보기 조회 성공" },
    USER_RECENTLIST_DELETE_SUCCESS : { "isSuccess": true, "code": 1027, "message":"최근검색어 전체 삭제 성공" },
    USER_FEEDBACK_SUCCESS : { "isSuccess": true, "code": 1028, "message":"피드백보내기 성공" },
    REVIEW_REPORT_SUCCESS : { "isSuccess": true, "code": 1029, "message":"신고하기 성공" },
    REVIEWLIKEID_ACTIVE_SUCCESS : { "isSuccess": true, "code": 1030, "message":"도움이 됐어요 추가(ACTIVE로 수정) 성공" },
    REVIEWLIKEID_INACTIVE_SUCCESS : { "isSuccess": true, "code": 1031, "message":"도움이 됐어요 삭제(INACTIVE로 수정) 성공" },
    REVIEW_LIKE_SUCCESS : { "isSuccess": true, "code": 1032, "message":"도움이 됐어요 추가 성공" },
    BEER_FEEDBACK_SUCCESS : { "isSuccess": true, "code": 1033, "message":"맥덕이에게 전달되었어요! 성공" },
    BEER_INFO_SUCCESS : { "isSuccess": true, "code": 1034, "message":"카톡공유 전 맥주정보 조회 성공" },
    BEER_BY_BEERKINDID_SUCCESS : { "isSuccess": true, "code": 1035, "message":"맥주 추천 받기 조회 성공" },
    USER_SIGNOUT_SUCCESS : { "isSuccess": true, "code": 1036, "message":"회원탈퇴 성공" },
    BEER_REVIEW_RESULT_ALL_SUCCESS : { "isSuccess": true, "code": 1037, "message":"리뷰전체보기 조회 성공" },

































    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임길이는 최소2자리에서 최대6자리입니다." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    BEER_ID_EMPTY : { "isSuccess": false, "code": 2019, "message": "beerId를 입력해주세요." },
    BEERKIND_ID_EMPTY : { "isSuccess": false, "code": 2020, "message": "beerKindId를 입력해주세요." },
    REVIEW_REVIEWID_EMPTY : { "isSuccess": false, "code": 2021, "message": "reviewId를 입력해주세요." },
    REVIEW_SCORE_EMPTY : { "isSuccess": false, "code": 2022, "message": "별점을 입력해주세요." },
    REVIEW_DESCRIPTION_EMTPY: { "isSuccess": false, "code": 2023, "message": "리뷰내용을 입력해주세요." },
    ACCESS_TOKEN_EMPTY : { "isSuccess": false, "code": 2024, "message": "accessToken을 입력해주세요." },
    ACCESS_TOKEN : { "isSuccess": false, "code": 2025, "message": "유효하지 않은 accessToken입니다" },
    SIGNUP_KAKAOID_EMPTY : { "isSuccess": false, "code": 2026, "message":"kakaoId를 입력해주세요" },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력해주세요." },
    SIGNUP_GENDER_EMPTY : { "isSuccess": false, "code": 2027, "message":"성별을 선택해주세요." },
    SIGNUP_AGE_EMPTY : { "isSuccess": false, "code": 2028, "message":"나이를 선택해주세요." },
    SIGNUP_BEERKINDID_EMPTY : { "isSuccess": false, "code": 2029, "message":"취향을 입력해주세요." },
    SEARCH_KEYWORD_INPUT : { "isSuccess": false, "code": 2030, "message":"keyword를 입력해주세요." },
    FEEDBACK_DESCRIPTION_EMTPY: { "isSuccess": false, "code": 2031, "message": "피드백내용을 입력해주세요." },
    FEEDBACK_DESCRIPTION_LENGTH : { "isSuccess": false,"code": 2032,"message":"피드백 내용은 최소20자리에서 최대500자리입니다." },
    REPORT_INDEX_EMPTY : { "isSuccess": false,"code": 2033,"message":"reportIndex를 입력해주세요" },
    BEER_FEEDBACK_KEYWORD_EMTPY: { "isSuccess": false, "code": 2034, "message": "맥덕이에게 전달할 keyword를 입력해주세요." },
    USER_SINGOUT_EMTPY: { "isSuccess": false, "code": 2035, "message": "회원탈퇴 이유를 입력해주세요" },







    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },


    SEARCH_INPUT_NOT_EXIST : { "isSuccess": false, "code": 3007, "message": "해당 키워드에 관한 상품이 없습니다." },
    REFRIGERATOR_RESULT_NOT_EXIST : { "isSuccess": false, "code": 3008, "message": "냉장고가 비어있습니다." },
    STICKER_RESULT_NOT_EXIST : { "isSuccess": false, "code": 3009, "message": "스티커가 없습니다." },
    REVIEW_RESULT_NOT_EXIST : { "isSuccess": false, "code": 3010, "message": "해당 상품에 관한 리뷰가 없습니다." },
    BEER_DETAIL_NOT_EXIST : { "isSuccess": false, "code": 3011, "message": "상품에 관한 상세화면이 없습니다." },
    REFRIGERATOR_BEERID_EXIST : { "isSuccess": false, "code": 3012, "message": "이미 냉장고에 있습니다." },
    REFRIGERATOR_BEERID_UPDATE_NOT_EXIST : { "isSuccess": false, "code": 3013, "message": "해당 (맥주)beerId가 냉장고에 없습니다." },
    USER_REVIEWLIST_NOT_EXIST : { "isSuccess": false, "code": 3014, "message": "유저의 리뷰가 없습니다." },
    USER_REVIEWBYREVIEWID_NOT_EXIST : { "isSuccess": false, "code": 3015, "message": "수정할 리뷰가 존재하지 않습니다." },
    USERID_REVIEWUSERID_NOT_MATCH : { "isSuccess": false, "code": 3016, "message": "해당 리뷰를 쓴 유저가 아닙니다." },
    REVIEW_IMAGELISTMORE_NOT_EXIST : { "isSuccess": false, "code": 3017, "message": "이미지리스트가 없습니다." },
    USER_REVIEWBYDELETE_NOT_EXIST : { "isSuccess": false, "code": 3018, "message": "삭제할 리뷰가 존재하지 않습니다." },
    USER_INFO_NOT_EXIST : { "isSuccess": false, "code": 3019, "message":"유저 정보가(성별,나이,취향) 없습니다." },
    SEARCH_RESULT_NOT_EXIST : { "isSuccess": false, "code": 3020, "message": "해당 키워드에 대한 맥주 정보가 없어요..." },
    REVIEW_RESULT_REVIEWID_NOT_EXIST : { "isSuccess": false, "code": 3021, "message": "리뷰가 존재하지 않습니다. reviewId를 확인해주세요" },
    USER_RECENT_NOT_EXIST : { "isSuccess": false, "code": 3022, "message": "최근검색어가 존재하지 않습니다." },
    REVIEW_REPORT_NOT_EXIST : { "isSuccess": false, "code": 3023, "message": "신고할 리뷰가 존재하지 않습니다." },
    REVIEW_LIKE_NOT_EXIST : { "isSuccess": false, "code": 3024, "message": "좋아요 누를 리뷰가 존재하지 않습니다." },
    BEER_INFO_NOT_EXIST : { "isSuccess": false, "code": 3025, "message": "공유할 맥주정보가 없습니다." },
    BEER_BY_BEERKINDID_NOT_EXIST : { "isSuccess": false, "code": 3026, "message":"추천받을 맥주가 아직 존재하지 않습니다." },
    USER_USERID_ALREADY_EXIST : { "isSuccess": false, "code": 3027, "message":"이미 회원입니다." },
    USER_SIGNOUT_NOT_EXIST : { "isSuccess": false, "code": 3028, "message":"이미 탈퇴한 회원입니다." },
















    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
