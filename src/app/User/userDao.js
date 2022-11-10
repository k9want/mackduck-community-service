//닉네임 중복 검사
async function selectUserNicknameCheck(connection,nickname) {
  const selectUserNicknameCheckQuery = `select nickname from User where nickname = ?;`;
  const [userNicknameCheckRows] = await connection.query(selectUserNicknameCheckQuery, nickname);
  return userNicknameCheckRows;
}

//유저 정보 조회(성별,나이,취향)
async function selectUserInfoByUserId(connection,userId) {
  const selectUserInfoByUserIdQuery = `select gender,age,beerKindId from User where id = ?;`;
  const [userInfoByUserIdRows] = await connection.query(selectUserInfoByUserIdQuery, userId);
  return userInfoByUserIdRows[0];
}


//유저 냉장고 조회
async function selectUserRefrigerator(connection,userId) {
  const selectUserRefrigeratorListQuery = `select b.id as beerId,
                                                  b.beerImgUrl,
                                                  b.nameKr from Refrigerator as rf
                                                                  left join Beer as b on b.id = rf.beerId
                                           where rf.userId = ? and rf.status = 'ACTIVE'
                                           order by rf.updatedAt desc;`;
  const [userRefrigeratorRows] = await connection.query(selectUserRefrigeratorListQuery, userId);
  return userRefrigeratorRows;
}



//유저 스티커 조회
async function selectUserSticker(connection,userId) {
  const selectUserStickerListQuery = `select
                                        s.beerKindId as stickerIndex
                                      from Sticker as s
                                      where s.userId = ? and s.status = 'ACTIVE'
                                      group by beerKindId;`;
  const [userStickerRows] = await connection.query(selectUserStickerListQuery, userId);
  return userStickerRows;
}

//유저의 리뷰리스트 조회
async function selectUserReviewList(connection,userId, rowNumber) {
  const selectUserReviewListQuery = `select
                                       r.id as reviewId,
                                       nickname,
                                       age,
                                       gender,
                                       beerKindId,
                                       score,
                                       case when r.createdAt != r.updatedAt
                                         then concat(date_format(r.updatedAt, '%Y.%c.%d'),' 수정됨')
                                            else date_format(r.createdAt, '%Y.%c.%d')
                                         end as 'updatedAt',
                                         r.description,
                                       case when ri.reviewImgUrl is null then JSON_ARRAY()
                                            else JSON_ARRAYAGG(JSON_OBJECT('reviewImageUrl', ri.reviewImgUrl))
                                         end as reviewImgUrlList,
                                       coalesce(reviewLikeCount, 0) as reviewLikeCount,
                                       CONCAT(LPAD(date_format(r.updatedAt, '%Y%c%d'), 10, '0'), LPAD(r.id, 10, '0')) as rowNumber
                                     from User as u
                                            left join Review r on u.id = r.userId
                                            left join (select reviewImgUrl,status,reviewId from ReviewImage ri where status = 'ACTIVE') as ri on r.id = ri.reviewId
                                            left join (select reviewId, count(id) as 'reviewLikeCount' from ReviewLike where status = 'ACTIVE' group by reviewId ) as rl on rl.reviewId = r.id
                                     where r.userId = ? and r.status = 'ACTIVE' and CONCAT(LPAD(date_format(r.updatedAt, '%Y%c%d'), 10, '0'), LPAD(r.id, 10, '0')) < ?
                                     group by r.id
                                     order by r.updatedAt desc , r.id desc
                                       limit 15;`;
  const [userReviewListRows] = await connection.query(selectUserReviewListQuery, [userId, rowNumber]);
  return userReviewListRows;
}


//리뷰 수정전 해당 리뷰조회(내 리뷰보기 - 수정하기)
async function selectUserReviewByReviewId(connection,reviewId) {
  const selectUserReviewByReviewIdQuery = `select
                                             r.id as  reviewId,
                                             b.beerImgUrl,
                                             b.nameKr,
                                             score,
                                             r.description
                                           from Review as r
                                                  left join Beer b on b.id = r.beerId
                                           where r.id = ? and r.status = 'ACTIVE';`;
  const [userReviewByReviewIdRows] = await connection.query(selectUserReviewByReviewIdQuery, reviewId);
  return userReviewByReviewIdRows;
}

//리뷰 수정전 해당 리뷰조회(이미지)
async function selectUserReviewImageByReviewId(connection,reviewId) {
  const selectUserReviewByReviewIdQuery = `select
                                             reviewImgUrl as reviewImageUrl
                                           from ReviewImage as ri
                                           where reviewId = ? and ri.status = 'ACTIVE'
                                           order by id desc;`;
  const [userReviewByReviewIdRows] = await connection.query(selectUserReviewByReviewIdQuery, reviewId);
  return userReviewByReviewIdRows;
}



//27. 카카오톡공유 전 맥주정보 조회
async function selectUserBeerInfoUrl(connection,beerId) {
  const selectUserBeerInfoUrlQuery = `select
                                        nameEn,
                                        nameKr,
                                        country,
                                        manufacturer,
                                        bk.beerKind,
                                        alcohol,
                                        ingredient,
                                        feature,
                                        beerImgUrl
                                      from Beer as b
                                             left join BeerKind as bk on bk.id = b.beerKindId
                                      where b.id = ? and b.status = 'ACTIVE';`;
  const [userBeerInfoUrlRows] = await connection.query(selectUserBeerInfoUrlQuery, beerId);
  return userBeerInfoUrlRows;
}



//28-1 맥주추천 전에 유저의 beerKindId 가져오기
async function selectUserBeerKindIdByUserId(connection, userId) {
  const selectUserBeerKindIdByUserIdQuery = `select
                                        beerKindId
                                      from User
                                      where id = ? and status = 'ACTIVE';`;
  const [userBeerKindIdByUserIdRows] = await connection.query(selectUserBeerKindIdByUserIdQuery, userId);
  return userBeerKindIdByUserIdRows;
}

//28-2 가져온 beerKindId로 맥주추천조회
async function selectUserBeersByBeerKindId(connection,beerKindId) {
  const selectUserBeersByBeerKindIdQuery = `select
                                              b.id as beerId,
                                              beerImgUrl,
                                              b.nameEn,
                                              b.nameKr,
                                              coalesce(truncate((sum/reviewCount),1),0) as reviewAverage,
                                              coalesce(reviewCount, 0) as reviewCount
                                            from Beer as b
                                                   left join (select beerId ,sum(score) as sum,count(Review.id) as reviewCount from Review
                                              left join User u on u.id = Review.userId
                                                              where Review.status = 'ACTIVE' and u.status = 'ACTIVE' group by beerid ) as r on r.beerId = b.id
                                            where b.beerKindId = ? and b.status = 'ACTIVE'
                                            order by rand();`;
  const [userBeersByBeerKindIdRows] = await connection.query(selectUserBeersByBeerKindIdQuery, beerKindId);
  return userBeersByBeerKindIdRows;
}








// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}


//유저 냉장고에 맥주있는지 없는지 확인하기 위해서
async function selectUserRefrigeratorCheck(connection, userId, beerId) {
  const selectUserRefrigeratorCheckQuery = `select id,status from Refrigerator as r where userId = ? and beerId = ? ;`;
  const [selectUserRefrigeratorCheckRows] = await connection.query(selectUserRefrigeratorCheckQuery, [userId, beerId]);
  return selectUserRefrigeratorCheckRows;
}

//reviewLike에 있는지 없는지 조회 (있으면 active인지 inactive인지)
async function userReviewLikeCheck(connection, userId, reviewId) {
  const selectUserReviewLikeCheckQuery = `select
                                            id,
                                            rl.status
                                          from ReviewLike as rl where userId = ? and reviewId = ?;`;
  const [selectUserReviewLikeCheckRows] = await connection.query(selectUserReviewLikeCheckQuery, [userId, reviewId]);
  return selectUserReviewLikeCheckRows;
}


// 리뷰 신고하기전에 해당 리뷰존재하는지 확인
async function selectReviewCheck(connection, reviewId) {
  const selectReviewCheckQuery = `select r.id from Review as r
                                                     left join User u on r.userId = u.id
                                  where r.id = ? and u.status = 'ACTIVE' and r.status = 'ACTIVE';`;
  const [selectReviewCheckRows] = await connection.query(selectReviewCheckQuery, reviewId);
  return selectReviewCheckRows;
}




//유저 리뷰가 있는지 없는지 r.status도 고려할것
async function selectUserReviewListCheck(connection, reviewId) {
  const selectUserReviewListCheckQuery = `select * from Review as r where r.id = ? and r.status ='ACTIVE';`;
  const [selectUserReviewListCheckRows] = await connection.query(selectUserReviewListCheckQuery, reviewId);
  return selectUserReviewListCheckRows;
}


//최근검색어 전체삭제 전 조회
async function selectUserRecentListCheck(connection, userId) {
  const selectUserRecentListCheckQuery = `select id from Search where userId = ? and status = 'ACTIVE'`;
  const [selectUserRecentListCheckRows] = await connection.query(selectUserRecentListCheckQuery, userId);
  return selectUserRecentListCheckRows;
}





//유저의 리뷰가 맞는지 확인
async function selectUserReviewByUserIdCheck(connection, reviewId) {
  const selectUserReviewByUserIdCheckQuery = `select r.userId from Review as r where id = ? and r.status ='ACTIVE';`;
  const [selectUserReviewByUserIdCheckRows] = await connection.query(selectUserReviewByUserIdCheckQuery, reviewId);
  return selectUserReviewByUserIdCheckRows;
}



// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email
                FROM User 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

//kakaoId로 회원조회

async function selectUserKakaoId(connection, kakaoId) {
  const selectUserKakaoIdQuery = `
                SELECT id
                FROM User 
                WHERE kakaoId = ? and status = 'ACTIVE';
                `;
  const [kakaoIdRows] = await connection.query(selectUserKakaoIdQuery, kakaoId);
  return kakaoIdRows;
}


// userId 회원 조회
async function selectUserId(connection, email) {
  const selectUserIdQuery = `
                 SELECT id 
                 FROM User 
                 WHERE email = ?;
                 `;
  const [userIdByEmailRow] = await connection.query(selectUserIdQuery, email);
  return userIdByEmailRow;
}

//userId 회원 조회 kakaoId로 조회하기
async function selectUserIdByKakaoId(connection, kakaoId) {
  const selectUserIdByKakaoIdQuery = `
                 SELECT id as userId,
                        nickname
                 FROM User 
                 WHERE kakaoId = ? and status = 'ACTIVE';
                 `;
  const [userIdByKakaoIdRow] = await connection.query(selectUserIdByKakaoIdQuery, kakaoId);
  return userIdByKakaoIdRow;
}

// 유저 생성         const insertUserInfoParams = [kakaoId, nickname, gender, age, beerKindId];
async function insertUser(connection, insertUserParams) {
  const insertUserQuery = `
        INSERT INTO User(kakaoId, nickname, gender, age, beerKindId)
        VALUES (?, ?, ?, ?, ? );
    `;
  const insertUserRow = await connection.query(
      insertUserQuery,
      insertUserParams
  );

  return insertUserRow;
}



//냉장고에 맥주 추가
async function insertUserRefrigerator(connection, insertUserRefrigeratorParams) {
  const insertUserRefrigeratorQuery = `INSERT INTO Refrigerator (userId, beerId) VALUES (?, ?);`;
  const insertUserRefrigeratorRow = await connection.query(
      insertUserRefrigeratorQuery,
      insertUserRefrigeratorParams
  );

  return insertUserRefrigeratorRow;
}


//유저 리뷰 작성
async function insertUserReview(connection, insertUserReviewParams) {
  const insertUserReviewQuery = `INSERT INTO Review(userId, beerId, score, description)
                                 VALUES (?, ?, ?, ?);
  `;
  const insertUserReviewRow = await connection.query(
      insertUserReviewQuery,
      insertUserReviewParams
  );

  return insertUserReviewRow;
}


//유저 리뷰 이미지 생성
async function insertUserReviewImage(connection, reviewId, imageUrl) {
  const insertUserReviewImageQuery = `INSERT INTO ReviewImage(reviewId, reviewImgUrl) VALUES (?, ?);
  `;
  const insertUserRevieImagewRow = await connection.query(
      insertUserReviewImageQuery,
      [reviewId, imageUrl]
  );

  return insertUserRevieImagewRow;
}

//리뷰 작성용 beerKindId 찾기
async function selectUserBeerKindIdByBeerId(connection, beerId) {
  const selectUserBeerKindIdByBeerIdQuery = `select beerKindId from Beer where id = ?;`;
  const [userBeerKindIdByBeerIdRow] = await connection.query(selectUserBeerKindIdByBeerIdQuery, beerId);
  return userBeerKindIdByBeerIdRow;
}

//팝업창 띄울지 말지
async function selectUserStickerPopUpCheck(connection, userId, beerKindId) {
  const selectUserBeerKindIdByBeerIdQuery = `select
                                               s.beerKindId as stickerCheck
                                             from Sticker as s
                                             where s.userId = ? and s.beerKindId = ? and s.status = 'ACTIVE'
                                             limit 1`;
  const [userBeerKindIdByBeerIdRow] = await connection.query(selectUserBeerKindIdByBeerIdQuery, [userId, beerKindId]);
  return userBeerKindIdByBeerIdRow;
}


//리뷰작성후 스티커 테이블 생성
async function insertUserSticker(connection,insertUserStickerParams) {
  const insertUserStickerQuery = `INSERT INTO Sticker(userId, beerKindId, reviewId)
                                      VALUES (?, ?, ?);`;
  const insertUserStickerRow = await connection.query(insertUserStickerQuery, insertUserStickerParams );

  return insertUserStickerRow;
}






//리뷰 신고하기 const insertUserReportParams = [userId, reviewId, reportIndex];
async function insertUserReport(connection, insertUserReportParams) {
  const insertUserReportQuery = `INSERT INTO Report (userId, reviewId, reportIndex)
                                 VALUES (?, ?, ?)`;
  const insertUserReportRow = await connection.query(
      insertUserReportQuery,
      insertUserReportParams
  );

  return insertUserReportRow;
}




//유저 피드백보내기 생성
async function insertUserFeedback(connection, insertUserFeedbackParams) {
  const insertUserFeedbackQuery = `INSERT INTO Feedback(userId, description) VALUES (?, ?);`;
  const insertUserFeedbackRow = await connection.query(
      insertUserFeedbackQuery,
      insertUserFeedbackParams
  );

  return insertUserFeedbackRow;
}





//29. 맥덕이에게 전달되었습니다.
async function insertUserBeerFeedback(connection, insertUserBeerFeedbackParams) {
  const insertUserBeerFeedbackQuery = `INSERT INTO BeerFeedback(userId, keyword) VALUES (?, ?);`;
  const insertUserBeerFeedbackRow = await connection.query(
      insertUserBeerFeedbackQuery,
      insertUserBeerFeedbackParams
  );

  return insertUserBeerFeedbackRow;
}






// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}


//유저 개인정보 (성별, 나이, 취향) 수정  const patchUserInfoParams = [gender, age, beerKindId, userId]
async function updateUserInfo(connection,patchUserInfoParams) {
  const updateUserInfoQuery = `
  UPDATE User 
  SET gender = ?, age = ?, beerKindId = ?
  WHERE id = ?;`;
  const updateUserInfoRow = await connection.query(updateUserInfoQuery, patchUserInfoParams);
  return updateUserInfoRow[0];
}


//유저 닉네임 수정         const patchUserNicknameParams = [userId, nickname]
async function updateUserNickname(connection, patchUserNicknameParams) {
  const updateUserNicknameQuery = `UPDATE User as u SET nickname = ? WHERE id = ?;`;
  const updateUserNicknameRow = await connection.query(updateUserNicknameQuery, patchUserNicknameParams);
  return updateUserNicknameRow[0];
}



//냉장고에 맥주를 추가하는데 만약에 기존에 비활성화했다면? 활성화로 바꾸는 코드
async function updateUserRefrigeratorAtInsert(connection, id) {
  const updateUserRefrigeratorActiveQuery = `UPDATE Refrigerator as r SET status = 'ACTIVE' WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserRefrigeratorActiveQuery, id);
  return updateUserRow[0];
}


async function updateUserRefrigeratorAtUpdate(connection, id) {
  const updateUserRefrigeratorActiveQuery = `UPDATE Refrigerator as r SET status = 'INACTIVE' WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserRefrigeratorActiveQuery, id);
  return updateUserRow[0];
}



//24(1). 좋아요 active => inactive
async function updateUserReviewLikeDelete(connection, id) {
  const updateUserReviewLikeDeleteQuery = `UPDATE ReviewLike SET status = 'INACTIVE' WHERE id = ?;`;
  const updateUserReviewLikeDeleteRow = await connection.query(updateUserReviewLikeDeleteQuery, id);
  return updateUserReviewLikeDeleteRow[0];
}


//24(2). 좋아요 inactive => active
async function updateUserReviewLikeAdd(connection, id) {
  const updateUserReviewLikeAddQuery = `UPDATE ReviewLike SET status = 'ACTIVE' WHERE id = ?;`;
  const updateUserReviewLikeAddRow = await connection.query(updateUserReviewLikeAddQuery, id);
  return updateUserReviewLikeAddRow[0];
}

//24(3) 처음 좋아요 눌렀을때 reviewLike에 insert   insertUserReviewLikeParams = [userId, reviewId];
async function insertUserReviewLike(connection, insertUserReviewParams) {
  const insertUserReviewLikeQuery = `INSERT INTO ReviewLike (userId, reviewId) VALUES (?, ?);`;
  const insertUserReviewLikRow = await connection.query(
      insertUserReviewLikeQuery,
      insertUserReviewParams
  );
  return insertUserReviewLikRow;
}









//API 21 - 수정하기 완료버튼 눌렀을때 (1) review table 수정
async function updateUserReviewEdit(connection, insertUserReviewEdit) {
  const  updateUserReviewEditQuery = `UPDATE Review SET score = ?, description = ? WHERE id = ?`;
  const updateUserReviewEditRow = await connection.query(updateUserReviewEditQuery, insertUserReviewEdit);
  return updateUserReviewEditRow[0];
}





async function updateUserReviewDelete(connection, reviewId) {
  const  updateUserReviewDeleteQuery = `UPDATE Review r SET r.status = 'INACTIVE' WHERE r.id = ?;`;
  const updateUserReviewDeleteRow = await connection.query(updateUserReviewDeleteQuery, reviewId);
  return updateUserReviewDeleteRow[0];
}


async function updateUserReviewImageDelete(connection, reviewId) {
  const updateUserReviewImageDeleteQuery = `UPDATE ReviewImage as ri SET ri.status = 'INACTIVE'
                                             WHERE ri.reviewId = ?;`;
  const updateUserReviewImageDeleteRow = await connection.query(updateUserReviewImageDeleteQuery, reviewId);
  return updateUserReviewImageDeleteRow[0];
}



// 리뷰삭제시 해당리뷰 좋아요도 삭제
async function updateUserReviewLikeAllDelete(connection, reviewId) {
  const updateUserReviewImageDeleteQuery = `UPDATE ReviewLike as rl SET rl.status = 'INACTIVE'
                                             WHERE rl.reviewId = ?;`;
  const updateUserReviewImageDeleteRow = await connection.query(updateUserReviewImageDeleteQuery, reviewId);
  return updateUserReviewImageDeleteRow[0];
}




//26 최근검색어 전부 삭제
async function updateUserRecentListDelete(connection, userId) {
  const updateUserRecentListDeleteQuery = `UPDATE Search SET status = 'INACTIVE' WHERE userId = ? and status = 'ACTIVE';`;
  const updateUserRecentListDeleteRow = await connection.query(updateUserRecentListDeleteQuery, userId);
  return updateUserRecentListDeleteRow[0];
}



//유저 스티커 지우기 (리뷰 삭제시 사용)
async function deleteUserSticker(connection, reviewId) {
  const deleteUserStickerQuery = `DELETE FROM Sticker WHERE reviewId = ?;`;
  const deleteUserStickerRow = await connection.query(deleteUserStickerQuery, reviewId);
  return deleteUserStickerRow[0];
}





//회원탈퇴
//(0) 유저 존재하는지 안하는지 우선 체크
async function selectUserCheck(connection, userId) {
  const selectUserCheckQuery = `select id from User where status = 'ACTIVE' and id = ?;`;
  const selectUserCheckRow = await connection.query(selectUserCheckQuery, userId);
  return selectUserCheckRow[0];
}

//0-1 회원탈퇴 피드백 적기
async function insertUserSignOutFeedback(connection, userId, description) {
  const selectUserCheckQuery = `INSERT INTO SignOut(userId, description) VALUES (?, ?);`;
  const selectUserCheckRow = await connection.query(selectUserCheckQuery, [userId, description]);
  return selectUserCheckRow;
}


// (1) 유저 비활성화
async function updateUserSignOut(connection, userId) {
  const updateUserRecentListDeleteQuery = `UPDATE User as u SET u.status = 'INACTIVE' WHERE u.id = ?;`;
  const updateUserRecentListDeleteRow = await connection.query(updateUserRecentListDeleteQuery, userId);
  return updateUserRecentListDeleteRow[0];
}

//(2) 리뷰 삭제

async function updateReviewSignOut(connection, userId) {
  const updateUserRecentListDeleteQuery = `UPDATE Review as r SET r.status = 'DELETED' WHERE r.userId = ? and r.status = 'ACTIVE';`;
  const updateUserRecentListDeleteRow = await connection.query(updateUserRecentListDeleteQuery, userId);
  return updateUserRecentListDeleteRow[0];
}


//(3) 이미지 삭제
async function updateReviewImageSignOut(connection, userId) {
  const updateUserRecentListDeleteQuery = `UPDATE ReviewImage as ri SET ri.status = 'DELETED'
                                           WHERE ri.status = 'ACTIVE' and ri.reviewId IN (select r.id from Review as r where r.userId = ? and r.status = 'DELETED');`;
  const updateUserRecentListDeleteRow = await connection.query(updateUserRecentListDeleteQuery, userId);
  return updateUserRecentListDeleteRow[0];
}

//(4) 냉장고 삭제
async function updateRefrigeratorSignOut(connection, userId) {
  const updateUserRecentListDeleteQuery = `UPDATE Refrigerator as r SET r.status = 'DELETED' WHERE r.userId = ?;`;
  const updateUserRecentListDeleteRow = await connection.query(updateUserRecentListDeleteQuery, userId);
  return updateUserRecentListDeleteRow[0];
}

//(5) 스티커 삭제
async function updateStickerSignOut(connection, userId) {
  const updateUserRecentListDeleteQuery = `UPDATE Sticker as s SET s.status = 'DELETED' WHERE s.userId = ?;`;
  const updateUserRecentListDeleteRow = await connection.query(updateUserRecentListDeleteQuery, userId);
  return updateUserRecentListDeleteRow[0];
}


module.exports = {
  selectUserNicknameCheck,
  selectUserInfoByUserId,
  selectUserRefrigerator,
  selectUserSticker,
  selectUserReviewList,
  selectUserReviewByReviewId,
  selectUserReviewImageByReviewId,
  selectUserBeerInfoUrl,
  selectUserBeerKindIdByUserId,
  selectUserBeersByBeerKindId,

  selectUser,
  selectUserRefrigeratorCheck,
  userReviewLikeCheck,
  selectReviewCheck,
  selectUserReviewListCheck,
  selectUserRecentListCheck,
  selectUserReviewByUserIdCheck,
  selectUserEmail,
  selectUserKakaoId,
  selectUserIdByKakaoId,
  selectUserId,


  insertUserRefrigerator,

  //리뷰 작성용
  insertUserReview,
  insertUserReviewImage,
  selectUserBeerKindIdByBeerId,
  selectUserStickerPopUpCheck,
  insertUserSticker,

  insertUserReport,
  insertUserFeedback,
  insertUserBeerFeedback,

  insertUser,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateUserNickname,
  updateUserRefrigeratorAtInsert,
  updateUserRefrigeratorAtUpdate,

  //24 API 좋아요
  updateUserReviewLikeDelete,
  updateUserReviewLikeAdd,
  insertUserReviewLike,

  updateUserReviewEdit,
  updateUserReviewDelete,
  updateUserReviewImageDelete,
  updateUserReviewLikeAllDelete,

  updateUserRecentListDelete,


  deleteUserSticker,

  selectUserCheck,
  insertUserSignOutFeedback,
  updateUserSignOut,
  updateReviewSignOut,
  updateReviewImageSignOut,
  updateRefrigeratorSignOut,
  updateStickerSignOut,



};
