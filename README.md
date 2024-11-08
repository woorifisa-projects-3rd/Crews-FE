소모임과 통장을 합쳐 한번에 관리할 수 있는 프로젝트 👨‍👩‍👦‍👦➕🏛

## 실행하기

```
git clone https://github.com/woorifisa-projects-3rd/Crews-FE.git
cd Crews-FE
npm install
npm run dev
```

## Navigation이 없는 페이지의 경우

```js
const { setNavVisible } = useNavStore();
useEffect(() => {
  setNavVisible(false);
  return () => setNavVisible(true);
}, []);
```

`/app/service/payment/page.jsx`를 참고해서 해당 코드 추가하면 Navigation이 사라집니다. 컴포넌트가 `unmount`되면 자동으로 다시 보여지게끔 해두었으니 참고!!

## 🗂️ 폴더구조

```
├── .next ▶️ Next의 빌드 결과물 폴더
├── node_modules ▶️ 프로젝트 관련 JS 라이브러리가 설치된 폴더
├── public ▶️ 이미지, 폰트와 같은 정적 자원들을 배치하는 폴더
│   ├── fonts / ▶️ 로컬 폰트 폴더
│   ├── icons/ ▶️ 아이콘 폴더
│   ├── imgs/ ▶️ 이미지 폴더
│   └── fonts/ 폰트 폴더
├── app/ ▶️ 앱 라우팅 폴더
│   ├── api/auth/[...nextauth]/ ▶️ auth.js 설정 폴더
│   ├── admin/ ▶️ 관리자 폴더
│   │   ├── (auth)/ ▶️ 인증 인가 폴더
│   │   ├── page.jsx ▶️ 관리자 root 경로 페이지(접근제한)
│   │   ├── realFinalLastAdmin/ ▶️ 진정한 관리자 폴더
│   ├── service/ ▶️ 서비스 폴더
│   │   ├── (auth)/ ▶️ 인증 인가 폴더
│   │   ├── search/ ▶️ 검색 폴더
│   │   ├── mypage/ ▶️ 마이페이지 폴더
│   │   ├── agits/ ▶️ 아지트 폴더
│   ├── page.jsx ▶️ root 경로 페이지(/service로 리다이렉트)
│   └── layout.jsx ▶️ root 경로 레이아웃 구조
├── components/ ▶️ 컴포넌트 폴더
│   ├── common/ ▶️ 공통 컴포넌트 폴더
│   │   ├── Header/
│   │   │   ├── Header컴포넌트.jsx
│   │   │   └── Header컴포넌트.module.css
│   │   ├── Modal/
│   │   │   ├── Modal컴포넌트.jsx
│   │   │   └── Modal컴포넌트.module.css
│   │   ├── 컴포넌트.jsx
│   │   └── 컴포넌트.module.css
│   ├── 라우팅폴더명/컴포넌트.jsx
│   └── 라우팅폴더명/컴포넌트.module.css
├── constants/
│   └── 상수명.js
├── hooks/
│   └── 커스텀훅.js
├── apis/
│   ├── instancs.js ▶️ api 요청 기본 설정 파일
│   └── 도메인Api.js
├── stores/ ▶️ Zustand Store 폴더
│   └── 도메인Store.js
├── utils/
│   └── 기능명Utils.js
├── .eslintrc.json ▶️ ESLint 설정 파일
├── .gitignore ▶️ 깃 이그노어 파일
├── jsconfig.json ▶️ VSCode 설정 파일
├── next.config.mjs ▶️ 넥스트 설정 파일
├── package-lock.json ▶️ 라이브러리 의존 관계 설정 파일
└── package.json ▶️ NPM 프로젝트 설정 파일
```

## 🎈 Commit 방법

- feat : 새로운 기능 추가
- fix : 버그 수정
- docs : 문서 수정
- refactor : 코드 리팩터링
- test : 테스트 코드, 리팩터링 테스트 코드 추가
- rename : 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우
- remove : 파일을 삭제하는 작업만 수행한 경우
- !HOTFIX : 급하게 치명적인 버그를 고쳐야 하는 경우

예시
`[feat/#이슈번호]: 타워 추가`
