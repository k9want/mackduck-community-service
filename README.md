# 🍺 맥주 커뮤니티, 맥덕(맥주덕후)




### 🔖 프로젝트 개요
* 소개 : 국내외 다양한 맥주 정보(약 100종)와 사용자 리뷰를 기반으로, 맥주를 추천하고 경험을 공유할 수 있는 커뮤니티 플랫폼
* 대상 : 맥주를 추천받고, 기록하고, 취향을 공유하고 싶은 모든 맥주 애호가

<br>


### 🔗 주요 기능
* 맥주 리뷰 시스템: 평점, 리뷰, 사진을 통해 맥주에 대한 정보 공유
* 미션 기반 뱃지 시스템: 리뷰 작성 등 미션 달성 시 스티커(뱃지) 보상 제공
* 선호도 통계 확인: 연령대별 맥주 선호도 시각화
* 맥주 검색 기능: 이름 기반의 빠른 맥주 검색 지원
* 카카오 소셜 로그인: 간편한 회원가입 및 로그인 연동

<br>

### 📚 기술 스택 
NodeJs, MySQL, AWS (EC2, RDS, S3), Nginx

<br>

### 💡 주요 성과
* 디스콰이엇(Disquiet) 기준 실시간 인기 앱 2위 달성
* 구글 플레이 스토어 1,000+ 다운로드 기록 (현재 서비스 종료)

<br>

### 🌈 What I learn - Job Performace
* **효율적인 개발 프로세스**
  * 팀 단위 협업 환경에서 개발 우선순위와 범위 조정의 중요성을 체득
  * 기능 구현 순서를 명확히 정하고, 점진적으로 개발해 나가는 유연한 개발 방식 학습

* **책임감 있는 개발 리딩 경험 (PM 역할 수행)**
  * PM으로서 전체 일정 조율, 핵심 기능 정의 및 의사결정 주도
  * 클라이언트 개발자와 긴밀히 소통하며 API 구조 및 데이터 효율성 고민
  * 특히 이미지 처리(S3) 및 소셜 로그인 구현과 같은 핵심 기능에 대해 적극적으로 레퍼런스 분석 및 문제 해결

* **원활한 커뮤니케이션 역량**
  * 기획자와의 협업에서 비개발자 관점에 맞춘 기술 설명과 소통 경험
  * 팀원 간 명확한 역할 분담 및 피드백 주고받는 과정에서 소통의 중요성 체득

<br>

### 🚀 What I Learned – Technical Skills
* **서버 개발 및 인프라**
  * Node.js / MySQL 기반 서버 개발 및 REST API 설계/구현
  * EC2, RDS, S3, Nginx를 활용한 AWS 인프라 구축 경험
  * aws-sdk, multer-s3로 이미지 업로드 처리 및 S3 이미지 서버 구성

* **인증 및 보안**
  * passport, passport-kakao를 활용한 카카오 소셜 로그인 구현
  * JWT 토큰 기반 인증 처리, 사용자 인증 플로우 설계

* **데이터 처리**
  * 커서 기반 페이지네이션 도입으로 실시간 리뷰 반영 및 성능 개선
  * DB 트랜잭션 처리 및 유효성 검증(Validation) 로직 적용


<br>

### 🌏 API 명세서
https://docs.google.com/spreadsheets/d/1tRwMhJRArAWqNEy0TWntaWE7-8S5Bdy79z4XZi_TNLo/edit?usp=sharing

<br>


### ✨Structure
주요 파일 구조
```
├── config                              #
│   ├── baseResponseStatus.js           # Response 시의 Status들을 모아 놓은 곳. 
│   ├── database.js                     # 데이터베이스 관련 설정
│   ├── express.js                      # express Framework 설정 파일
│   ├── jwtMiddleware.js                # jwt 관련 미들웨어 파일
│   ├── mutler.js                       # AWS S3 이미지 처리를 위한 파일
│   ├── secret.js                       # 서버 key 값들 
│   ├── winston.js                      # logger 라이브러리 설정
├── * log                               # 생성된 로그 폴더
├── * node_modules                    	# 외부 라이브러리 폴더 (package.json 의 dependencies)
├── src                     			
│   ├── app              				# 앱에 대한 코드 작성
│ 	│   ├── Beer            			# Beer 도메인 폴더
│ 	│ 	│   ├── beerDao.js 		        # Beer 관련 데이터베이스
│ 	│ 	│   ├── beerController.js 		# req, res 처리
│ 	│ 	│   ├── beerProvider.js   		# R에 해당하는 서버 로직 처리
│ 	│ 	│   ├── beerService.js   		# CUD에 해당하는 서버 로직 처리   
│ 	│   ├── User            			# User 도메인 폴더
│ 	│ 	│   ├── beerDao.js 		        # User 관련 데이터베이스
│ 	│ 	│   ├── beerController.js 		# 
│ 	│ 	│   ├── beerProvider.js   		# 
│ 	│ 	│   ├── beerService.js   		# 
└── index.js                            # 포트 설정 및 시작 파일                     		      	 
```

<br>

### 📁 Folder Structure
#### 1️⃣ 프로젝트 구조 개요
* src: 메인 비즈니스 로직
  * **Beer, User로 나눠 도메인 별로 패키지를 구성하도록 했다**.
* config, util: 메인 로직은 아니지만, 설정 파일 및 유틸성 로직을 모아둔 폴더
  
#### 2️⃣ 도메인 레이어 구조
```Request ⇨ Route ⇨ Controller ⇨ Service/Provider ⇨ DAO ⇨ DB
DB ⇨ DAO ⇨ Service/Provider ⇨ Controller ⇨ Route ⇨ Response
```
| 계층 | 역할 |
| --- | --- |
| **Route** | 라우팅 처리 (Request 엔드포인트 연결) |
| **Controller** | 요청 처리 및 응답 포맷 구성, 형식적 Validation |
| **Provider / Service** | 핵심 비즈니스 로직 처리, 의미적 Validation |
| **DAO (Data Access Object)** | SQL 쿼리 수행, DB 직접 접근 담당 |

#### 3️⃣ Validation
* Controller: 값 유무, 길이, 형식 등의 형식적(validation) 처리
* Provider / Service: DB 존재 여부, 중복 체크 등 의미적(validation) 처리

<br>

### ☁️ AWS S3 이미지 업로드 처리
- **사용 기술**: `aws-sdk`, `multer`, `multer-s3`
- **기능 흐름**:
    1. 클라이언트로부터 이미지 파일 수신
    2. S3에 이미지 저장 후, 해당 **이미지 URL을 DB에 저장**
    3. 클라이언트에는 DB에 저장된 이미지 URL 전달
- **최적화 포인트**:
    - 업로드 시 **파일 크기를 압축**하여 S3 저장 비용 및 네트워크 트래픽 최소화 시도도
