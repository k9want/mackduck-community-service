# Macdcuk(맥주덕후)
맥주정보 및 해당 맥주를 마신 유저들의 리뷰를 통해 맥주에 대한 정보를 얻는 플랫폼

https://makeus-challenge.notion.site/MackDuck-933cc3600d2e4513a1c36ef5e1b130e5

### macduck API 명세서
https://docs.google.com/spreadsheets/d/1tRwMhJRArAWqNEy0TWntaWE7-8S5Bdy79z4XZi_TNLo/edit?usp=sharing

### macduck ERD
URL : https://aquerytool.com/aquerymain/index/?rurl=3c457a7a-a704-4d40-bfcb-ce33f2bdb284&
Password : 81gw3d


### Folder Structure
- `src`: 메인 로직
  `src`에는 도메인 별로 패키지를 구성하도록 했다. **도메인**이란 회원(User), 게시글(Post), 댓글(Comment), 주문(Order) 등 소프트웨어에 대한 요구사항 혹은 문제 영역이라고 생각하면 된다. 각자 설계할 APP을 분석하고 필요한 도메인을 도출하여 `src` 폴더를 구성하자.
- `config` 및 `util` 폴더: 메인 로직은 아니지만 `src` 에서 필요한 부차적인 파일들을 모아놓은 폴더
- 도메인 폴더 구조
> Route - Controller - Provider/Service - DAO

- Route: Request에서 보낸 라우팅 처리
- Controller: Request를 처리하고 Response 해주는 곳. (Provider/Service에 넘겨주고 다시 받아온 결과값을 형식화), 형식적 Validation
- Provider/Service: 비즈니스 로직 처리, 의미적 Validation
- DAO: Data Access Object의 줄임말. Query가 작성되어 있는 곳.

### Comparison
3개 템플릿 모두 다음과 같이 Request에 대해 DB 단까지 거친 뒤, 다시 Controller로 돌아와 Response 해주는 구조를 갖는다. 구조를 먼저 이해하고 템플릿을 사용하자.
> `Request` -> Route -> Controller -> Service/Provider -> DAO -> DB

> DB -> DAO -> Service/Provider -> Controller -> Route -> `Response`

#### Node.js (패키지매니저 = npm)
> Request(시작) / Response(끝)  ⇄ Router (*Route.js) ⇄ Controller (*Controller.js) ⇄ Service (CUD) / Provider (R) ⇄ DAO (DB)

### Validation
서버 API 구성의 기본은 Validation을 잘 처리하는 것이다. 외부에서 어떤 값을 날리든 Validation을 잘 처리하여 서버가 터지는 일이 없도록 유의하자.
값, 형식, 길이 등의 형식적 Validation은 Controller에서,
DB에서 검증해야 하는 의미적 Validation은 Provider 혹은 Service에서 처리하면 된다.

## ✨Structure
앞에 (*)이 붙어있는 파일(or 폴더)은 추가적인 과정 이후에 생성된다.
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
│ 	│ 	│   ├── beerController.js 		# req, res 처리
│ 	│ 	│   ├── beerProvider.js   		# R에 해당하는 서버 로직 처리
│ 	│ 	│   ├── beerService.js   		# CUD에 해당하는 서버 로직 처리   
├── .gitignore                     		# git 에 포함되지 않아야 하는 폴더, 파일들을 작성 해놓는 곳
├── index.js                            # 포트 설정 및 시작 파일                     		
├── * package-lock.json              	 
├── package.json                        # 프로그램 이름, 버전, 필요한 모듈 등 노드 프로그램의 정보를 기술
└── README.md
```
## ✨Description
본 템플릿은 `Node.js`와 `Express` (`Node.js`의 웹 프레임워크)를 기반으로 구성되었다. `Node.js`와 `Express`의 자세한 내용과 원리는 각자 구글링을 통해 살펴보기 바란다.

### [Node.js](https://nodejs.org/ko/)
-  `node index.js` 를 통해서 js 파일을 실행한다.
-  node는 js 파일을 실행할 때 `package.json` 이라는 파일을 통해서 어떤 환경으로 구동하는지, 어떤 라이브러리들을 썼는지(dependencies) 등의 기본적인 설정값 들을 참고한다.
- `npm install` npm(node package manager)을 통해 package.json에 있는 dependencies 등을 참고하여 node_modules 폴더를 생성하고 라이브러리 파일을 다운로드 한다. 이 라이브러리들은 사용하고 싶은 파일에서 require 하여 사용할 수 있다.

### [Express](https://expressjs.com/ko/)
config > express.js 에서 express 프레임워크를 기반으로 한 app 모듈을 export 하도록 하여 어느 폴더에서든 사용할 수 있도록 구성했다.
새로운 도메인을 만들 경우, 해당 파일에 다음과 같이 Route 폴더를 추가하여 express.js에서 만든 app 모듈을 사용할 수 있도록 구성하면 된다.
```javascript
require('../src/app/User/userRoute')(app);
```
`index.js`에서 express에서 만든 app이 3000번 포트를 Listen 하도록 구성했다. 본인이 사용하고 싶은 포트 번호는 이곳에서 지정해주면 된다.

### [mysql2](https://www.npmjs.com/package/mysql2)
Database는 config > database.js에 mysql2 라이브러리를 사용해 구성했다. 자세한 설명과 추가적인 기능들은 mysql2 라이브러리의 공식 README를 참고하자.
cf. connection을 다 사용했다면 release를 통해 꼭 할당 해제를 해야 한다.

### [winston](https://www.npmjs.com/package/winston)
Log는 winston, winston-daily-rotate-file 라이브러리를 사용해 구성했다. 서버 접근 시에 새로 생기게 될 log 폴더에서 로그를 어떻게 남기는지 살펴보자. (커스텀해도 좋다.)

### [AWS S3 이미지 처리](aws-sdk,multer-s3,multer)
3개의 패키지를 이용해서 클라이언트에서 받은 이미지들을 AWS S3로 넣는 이미지를 처리, S3에 이미지를 저장하면서 Url을 DB에도 저장한다.

## ✨Usage

### API 만들기 예제
로컬에서 npm install을 통해 node_modules 라이브러리 폴더를 생성한다.

### [PM2](https://pm2.keymetrics.io/)
무중단 서비스를 위해 PM2를 사용한다. (JavaScript 런타임 Node.js의 프로세스 관리자) 자세한 사용법은 공식 사이트를 참고하자.

### Error
서버 Error를 마주했다면, 원인을 파악할 수 있는 다양한 방법들을 통해 문제 원인을 찾자.
- Nginx 로그 확인 (로그 경로는 구글링)
- pm2 log 확인 (로그 경로는 구글링)
- console.log 로 디버깅
- 그 외 방법들


## ✨License
- 본 템플릿의 소유권은 소프트스퀘어드에 있습니다. 본 자료에 대한 상업적 이용 및 무단 복제, 배포 및 변경을 원칙적으로 금지하며 이를 위반할 때에는 형사처벌을 받을 수 있습니다.
