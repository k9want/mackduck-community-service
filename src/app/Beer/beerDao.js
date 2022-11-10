//7-1. 최근검색어
async function beerSearchRecentKeywordInput(connection, userId) {
  const selectBeerSearchRecentKeywordInputQuery = `select
                                                     keyword,
                                                     date_format(createdAt, '%c.%d') as 'createdAt'
                                                   from Search
                                                   where createdAt IN (select max(createdAt) from Search where status = 'ACTIVE' and userId = ? group by keyword)
                                                   order by Search.createdAt desc
                                                     limit 5;`;
  const [beerSearchRecentKeywordInputRows] = await connection.query(selectBeerSearchRecentKeywordInputQuery, userId);
  return beerSearchRecentKeywordInputRows;
}

//7-2. 인기검색어(리뷰순)
async function beerSearchPopular(connection) {
  const selectBeerSearchPopularQuery = `select
                                          beerId,
                                          beerImgUrl,
                                          nameKr,
                                          bk.beerKind,
                                          alcohol,
                                          feature,
                                          count(r.id) as reviewCount
                                        from Review as r
                                               left join Beer b on r.beerId = b.id
                                               left join BeerKind as bk on bk.id = b.beerKindId
                                               left join User u on r.userId = u.id
                                        where r.status = 'ACTIVE' and u.status = 'ACTIVE'
                                        group by beerId
                                        order by reviewCount desc
                                          limit 5;`;
  const [beerSearchPopularRows] = await connection.query(selectBeerSearchPopularQuery);
  return beerSearchPopularRows;
}





//8. 검색창 입력시
async function beerSearchInput(connection,keyword) {
  const selectBeerSearchInputListQuery = `select
                                            id as beerId,
                                            nameKr,
                                            nameEn
                                          from Beer as b
                                          where b.status = 'ACTIVE' and concat(nameKr, nameEn) LIKE concat('%',?,'%');
  `;
  const [beerSearchInputRows] = await connection.query(selectBeerSearchInputListQuery, keyword);
  return beerSearchInputRows;
}

// 9. 검색창 결과 맥주리스트 보여주기
async function beerSearchResult(connection, keyword) {
  const selectBeerSearchResultListQuery = `select
                                             b.id as beerId,
                                             beerImgUrl,
                                             b.nameEn,
                                             b.nameKr,
                                             coalesce(truncate((sum/reviewCount),1),0) as reviewAverage,
                                             coalesce(reviewCount, 0) as reviewCount
                                           from Beer as b
                                                  left join (select beerId ,sum(score) as sum,count(Review.id) as reviewCount from Review left join User u on u.id = Review.userId
                                                             where Review.status = 'ACTIVE' and u.status = 'ACTIVE' group by beerid ) as r on r.beerId = b.id
                                           where concat(nameKr, nameEn) LIKE concat('%',?,'%') and b.status = 'ACTIVE';`;
  const [beerSearchResultRows] = await connection.query(selectBeerSearchResultListQuery, keyword);
  return beerSearchResultRows;
}



// 10. 맥주 디테일 화면 조회 (맥주 상세 - 1)
async function beerDetailResult(connection, userId, beerId) {
  const selectBeerDetailResultQuery = `select
                                         case when rf.userId
                                                then 'Y'
                                              else 'N'
                                           end as beerLikeCheck,
                                         beerImgUrl,
                                         nameEn,
                                         nameKr,
                                         country,
                                         manufacturer,
                                         bk.beerKind,
                                         alcohol,
                                         ingredient,
                                         feature
                                       from Beer as b
                                              left join BeerKind as bk on b.beerKindId = bk.id
                                              left join (select userId, beerId from Refrigerator where userId = ? and status = 'ACTIVE') as rf on rf.beerId = b.id
                                       where b.id = ? and b.status = 'ACTIVE';`;
  const [beerDetailResultRows] = await connection.query(selectBeerDetailResultQuery, [userId, beerId]);
  return beerDetailResultRows[0];
}


// 10. 맥주 디테일 화면 조회 (맥주 리뷰 - 2)
async function beerDetailReviewResult(connection, beerId) {
  const selectBeerDetailReviewResultQuery = `select
                                         coalesce(truncate(avg(score),1), 0) as reviewAverage,
                                         count(r.id) as reviewCount
                                       from Review as r
                                              left join User u on u.id = r.userId
                                       where r.beerId = ? and u.status = 'ACTIVE' and r.status = 'ACTIVE';`;
  const [beerDetailReviewResultRows] = await connection.query(selectBeerDetailReviewResultQuery, beerId);
  return beerDetailReviewResultRows[0];
}


//11-1(0)유저가 리뷰를 썼는지 안썼는지 체크
async function userReviewWriteCheck(connection, userId) {
  const selectUserReviewWriteCheckQuery = `select r.id from Review as r
                                        where r.userId = ? and r.status = 'ACTIVE'
                                        limit 1;`;
  const [userReviewWriteCheckRows] = await connection.query(selectUserReviewWriteCheckQuery, userId);
  return userReviewWriteCheckRows;
}

// 11-1(1) 리뷰 통계
async function beerReviewStatics(connection, beerId) {
  const selectBeerReviewStaticsQuery = `select
                                          count(distinct(r.id)) as reviewCount,
                                          truncate(avg(score),1) as reviewAverage,
                                          count(case when score=5 then 5 end) as five,
                                          count(case when score=4 then 4 end) as four,
                                          count(case when score=3 then 3 end) as three,
                                          count(case when score=2 then 2 end) as two,
                                          count(case when score=1 then 1 end) as one
                                        from Review r
                                               left join User u on r.userId = u.id
                                        where r.beerId = ? and r.status = 'ACTIVE' and u.status = 'ACTIVE';`;
  const [beerReviewStaticsRows] = await connection.query(selectBeerReviewStaticsQuery, beerId);
  return beerReviewStaticsRows[0];
}

// 11-1(2) 리뷰 이미지리스트 조회
async function beerReviewImageList(connection, beerId) {
  const selectBeerReviewImageListQuery = `select
                                            reviewImgUrl
                                          from Review r
                                                 left join ReviewImage ri on r.id = ri.reviewId
                                                 left join User u on r.userId = u.id
                                          where r.beerId = ? and ri.status = 'ACTIVE' and r.status = 'ACTIVE' and u.status = 'ACTIVE'
                                          group by r.id
                                          order by r.updatedAt desc
                                            limit 4;`;
  const [beerReviewImageListRows] = await connection.query(selectBeerReviewImageListQuery, beerId);
  return beerReviewImageListRows;
}

// 11-1(3) 리뷰전체보기 리뷰리스트 리뷰
async function beerReviewList(connection, userId, beerId, rowNumber) {
  const selectBeerReviewListQuery = `select
                                       case
                                         when u.id = ? then 'Y'
                                         else 'N'
                                         end as userCheck,
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
                                            left join (select reviewId, count(id) as 'reviewLikeCount' from ReviewLike where status = 'ACTIVE' group by reviewId ) as rl on rl.reviewId = r.id
                                            left join (select reviewImgUrl,status,reviewId from ReviewImage ri where status = 'ACTIVE') as ri on r.id = ri.reviewId
                                     where r.beerId = ? and r.status = 'ACTIVE' and u.status = 'ACTIVE' and CONCAT(LPAD(date_format(r.updatedAt, '%Y%c%d'), 10, '0'), LPAD(r.id, 10, '0')) < ?
                                     group by r.id
                                     order by r.updatedAt desc , r.id desc
                                       limit 6;`;
  const [beerReviewResultRows] = await connection.query(selectBeerReviewListQuery, [userId, beerId, rowNumber]);
  return beerReviewResultRows;
}




// 11-1(*(2)-1) 리뷰 개수
async function beerReviewCount(connection, beerId) {
  const selectBeerReviewListQuery = `select
                                       count(r.id) as reviewCount
                                     from Review as r
                                            left join User u on u.id = r.userId
                                     where r.beerId = ? and u.status = 'ACTIVE' and r.status = 'ACTIVE';`;
  const [beerReviewResultRows] = await connection.query(selectBeerReviewListQuery, beerId);
  return beerReviewResultRows[0];
}

// 11-1(*(2)-2) 리뷰 전체보기 스크롤하는 화면
async function beerReviewListScroll(connection, userId, beerId, rowNumber) {
  const selectBeerReviewListQuery = `select
                                       case
                                         when u.id = ? then 'Y'
                                         else 'N'
                                         end as userCheck,
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
                                            left join (select reviewId, count(id) as 'reviewLikeCount' from ReviewLike where status = 'ACTIVE' group by reviewId ) as rl on rl.reviewId = r.id
                                            left join (select reviewImgUrl,status,reviewId from ReviewImage ri where status = 'ACTIVE') as ri on r.id = ri.reviewId
                                     where r.beerId = ? and r.status = 'ACTIVE' and u.status = 'ACTIVE' and CONCAT(LPAD(date_format(r.updatedAt, '%Y%c%d'), 10, '0'), LPAD(r.id, 10, '0')) < ?
                                     group by r.id
                                     order by r.updatedAt desc , r.id desc
                                       limit 18;`;
  const [beerReviewResultRows] = await connection.query(selectBeerReviewListQuery, [userId, beerId, rowNumber]);
  return beerReviewResultRows;
}








//11-2 사진 더보기
async function beerReviewImageListMore(connection, beerId, rowNumber) {
  const selectBeerReviewImageListMoreQuery = `select
                                                r.id as reviewId,
                                                reviewImgUrl,
                                                CONCAT(LPAD(date_format(ri.updatedAt, '%Y%c%d'), 10, '0'), LPAD(ri.id, 10, '0')) as rowNumber
                                              from Review r
                                                     left join ReviewImage ri on r.id = ri.reviewId
                                                     left join User u on r.userId = u.id
                                              where r.beerId = ? and ri.status = 'ACTIVE' and r.status = 'ACTIVE' and u.status = 'ACTIVE'
                                                and CONCAT(LPAD(date_format(ri.updatedAt, '%Y%c%d'), 10, '0'), LPAD(ri.id, 10, '0')) < ?
                                              order by ri.updatedAt desc,  ri.id desc
                                                limit 30;`;
  const [beerReviewImageListMore] = await connection.query(selectBeerReviewImageListMoreQuery, [beerId, rowNumber]);
  return beerReviewImageListMore;
}

//11-3 리뷰 사진 더보기 - 리뷰 보러가기
async function selectBeerShowReview(connection,selectShowReviewParams) {
  const selectBeerShowReviewQuery = `select
                                       u.nickname,
                                       u.age,
                                       u.gender,
                                       u.beerKindId,
                                       r.score,
                                       case when r.createdAt != r.updatedAt
                                              then concat(date_format(r.updatedAt, '%Y.%c.%d'),' 수정됨')
                                            else date_format(r.createdAt, '%Y.%c.%d')
                                         end as 'updatedAt',
                                         case
                                           when u.id = ? then 'Y'
                                           else 'N'
                                           end as userCheck,
                                       r.description,
                                       coalesce(reviewLikeCount, 0) as reviewLikeCount
                                     from Review as r
                                            left join User u on u.id = r.userId
                                            left join Beer b on b.id = r.beerId
                                            left join (select reviewId, count(id) as 'reviewLikeCount' from ReviewLike where status = 'ACTIVE' group by reviewId ) as rl on rl.reviewId = r.id
                                     where r.id = ? and r.status = 'ACTIVE' and u.status = 'ACTIVE';`;
  const [beerShowReviewRows] = await connection.query(selectBeerShowReviewQuery, selectShowReviewParams);
  return beerShowReviewRows[0];
}

// //11-3 리뷰 사진 더보기 - 리뷰 보러가기 (이미지리스트)
async function selectBeerShowReviewImageList(connection,reviewId) {
  const selectBeerShowReviewImageListQuery = `select
                                        reviewImgUrl as reviewImageUrl
                                     from ReviewImage as ri
                                     where reviewId = ? and ri.status = 'ACTIVE'
                                     order by id desc;`;
  const [beerShowReviewImageList] = await connection.query(selectBeerShowReviewImageListQuery, reviewId);
  return beerShowReviewImageList;
}



//12. 맥주 디테일 맛 조회
async function selectBeerFavor(connection,beerId) {
  const selectBeerFavorListQuery = `select
                                           favor
                                         from BeerFavor as bf
                                                left join Favor f on bf.favorId = f.id
                                         where beerId = ?;`;
  const [beerFavorRows] = await connection.query(selectBeerFavorListQuery, beerId);
  return beerFavorRows;
}

//맥주 디테일 향 조회
async function selectBeerSmell(connection,beerId) {
  const selectBeerSmellListQuery = `select
                                      smell
                                    from BeerSmell as bs
                                           left join Smell s on bs.smellId = s.id
                                    where beerId = ?;`;
  const [beerSmellRows] = await connection.query(selectBeerSmellListQuery, beerId);
  return beerSmellRows;
}

//맥주 디테일 유사맥주 조회
async function selectBeerRelated(connection,beerKindId,beerId) {
  const selectBeerRelatedListQuery = `select beerImgUrl, nameKr from Beer
                                      where beerKindId = ? and id != ?
                                      limit 3;`;
  const [beerRelatedRows] = await connection.query(selectBeerRelatedListQuery, [beerKindId, beerId]);
  return beerRelatedRows;
}

//맥주 안주 설명
async function selectBeerDishDescription(connection,beerId) {
  const selectBeerDishDescriptionListQuery = `select dishDescription from Beer
                                      where id = ?;
  `;
  const [beerDishDescriptionRows] = await connection.query(selectBeerDishDescriptionListQuery, beerId);
  return beerDishDescriptionRows[0];
}


//맥주 디테일 안주 조회
async function selectBeerDishList(connection,beerId) {
  const selectBeerDishListQuery = `select
                                     dish
                                   from BeerDish as bd
                                          left join Dish d on bd.dishId = d.id
                                          left join Beer b on bd.beerId = b.id
                                   where beerId = ?;`;
  const [beerDishRows] = await connection.query(selectBeerDishListQuery, beerId);
  return beerDishRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

//유저 Search테이블에 검색어 저장

async function insertUserSearchKeyword(connection, insertUserSearchKeywordParams) {
  const insertUserSearchKeywordQuery = `INSERT INTO Search (userId, keyword) VALUES (?, ?)`;
  const insertUserSearchKeywordRow = await connection.query(
      insertUserSearchKeywordQuery,
      insertUserSearchKeywordParams
  );

  return insertUserSearchKeywordRow;
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

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}


module.exports = {
  beerSearchRecentKeywordInput,
  beerSearchPopular,
  beerSearchInput,
  beerSearchResult,
  beerDetailResult,
  beerDetailReviewResult,
  userReviewWriteCheck,
  beerReviewStatics,
  beerReviewImageList,
  beerReviewList,
  beerReviewCount,
  beerReviewListScroll,
  beerReviewImageListMore,



  selectBeerShowReview,
  selectBeerShowReviewImageList,
  selectBeerFavor,
  selectBeerSmell,
  selectBeerRelated,
  selectBeerDishList,
  selectBeerDishDescription,





  selectUserId,
  insertUserInfo,
  insertUserSearchKeyword,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
};
