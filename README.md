# Macdcuk(맥주덕후)
맥주정보 및 해당 맥주를 마신 유저들의 리뷰를 통해 맥주에 대한 정보를 얻는 플랫폼

![맥덕이미지](https://github.com/user-attachments/assets/69484719-4954-4451-8e39-67bd35d5b9a3)


https://makeus-challenge.notion.site/MackDuck-933cc3600d2e4513a1c36ef5e1b130e5

### macduck API 명세서
https://docs.google.com/spreadsheets/d/1tRwMhJRArAWqNEy0TWntaWE7-8S5Bdy79z4XZi_TNLo/edit?usp=sharing

### macduck ERD
URL : https://aquerytool.com/aquerymain/index/?rurl=3c457a7a-a704-4d40-bfcb-ce33f2bdb284&
Password : 81gw3d


### Folder Structure
- `src`: 메인 로직
  Beer, User로 나눠 도메인 별로 패키지를 구성하도록 했다.
- `config` 및 `util` 폴더: 메인 로직은 아니지만 `src` 에서 필요한 부차적인 파일들을 모아놓은 폴더
- 도메인 폴더 구조
> Route - Controller - Provider/Service - DAO

- Route: Request에서 보낸 라우팅 처리
- Controller: Request를 처리하고 Response 해주는 곳. (Provider/Service에 넘겨주고 다시 받아온 결과값을 형식화), 형식적 Validation
- Provider/Service: 비즈니스 로직 처리, 의미적 Validation 
- DAO: Query가 작성되어 있는 곳.

### Comparison
3개 템플릿 모두 다음과 같이 Request에 대해 DB까지 거친 뒤, 다시 Controller로 돌아와 Response 해주는 구조
> `Request` -> Route -> Controller -> Service/Provider -> DAO -> DB

> DB -> DAO -> Service/Provider -> Controller -> Route -> `Response`

#### Node.js (패키지매니저 = npm)
> Request(시작) / Response(끝)  ⇄ Router (*Route.js) ⇄ Controller (*Controller.js) ⇄ Service (CUD) / Provider (R) ⇄ DAO (DB)

### Validation
서버 API 구성의 기본은 Validation을 잘 처리하는 것이라고 생각했다.
값, 형식, 길이 등의 형식적 Validation은 Controller에서,
DB에서 검증해야 하는 의미적 Validation은 Provider 혹은 Service에서 처리했다.


## ✨Structure
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


### [AWS S3](aws-sdk,multer-s3,multer)
aws-sdk,multer-s3,multer를 이용해서 클라이언트에서 받은 이미지들을 AWS S3에 넣도록 처리, S3에 이미지를 저장하면서 Url을 DB에도 저장,
클라이언트에서는 데이터조회 시 이미지 url을 전달한다.
(이미지를 s3에 저장할 때 파일크기를 줄여서 저장하여 s3 용량 부담을 줄이려고 노력했다.)
