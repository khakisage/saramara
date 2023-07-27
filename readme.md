# Saramara

게시판 형태의 사이트로 구매가 고민되는 제품을 등록하고, 이에 대한 사람들의 반응과 투표를 통해 구매 결정에 도움을 주는 목적으로 개발을 진행하였습니다.


## 기술 스택
> - React 
> - Typescript
> - Tailwindcss
> - daisyUI
> - Recoil

## Installation
> 1. clone this repo

> 2. yarn

> 3. yarn dev

## page 기능 구현
### 회원가입
![회원가입페이지](https://github.com/khakisage/saramara/assets/91720916/27d0ed34-c0ca-47bf-a33c-1769e111ee2d)
- 이메일과 비밀번호로 가입
- 정규식을 통한 비밀번호 유효성 검증
### 로그인
![로그인페이지](https://github.com/khakisage/saramara/assets/91720916/b14afb53-1b13-4738-8f3c-f8f9878fa843)
- 이메일 및 비밀번호를 사용하는 일반 로그인
- 구글 로그인
### 마이페이지
![내 정보 수정](https://github.com/khakisage/saramara/assets/91720916/bb38f698-a6a8-4c81-9606-79fc615e3bc7)

![마이페이지](https://github.com/khakisage/saramara/assets/91720916/17dc56d0-a0d7-4e11-9a39-6569af308acb)
- 닉네임과 프로필 이미지 수정 가능
- 작성한 게시글 확인 가능
### 게시판
![게시판페이지](https://github.com/khakisage/saramara/assets/91720916/ca8e9e91-a511-4633-bcbe-90ba7f948490)
- 작성된 모든 게시글을 페이지네이션으로 한번에 3개씩 확인 가능
- 상세 내용은 더보기 버튼 클릭 시 확인 가능
### 게시글
![게시글페이지](https://github.com/khakisage/saramara/assets/91720916/afa575ca-ce26-42c6-9a7a-c94355c3ca02)
- 게시글에 대한 투표 기능 (현재 일부 구현)
- 게시글에 대한 댓글 기능
### 게시글 작성
![게시글작성](https://github.com/khakisage/saramara/assets/91720916/d9161645-d0e6-4dba-a863-19dfc9f003ea)
- quill을 통한 게시글 작성
- 사진 정보는 base64로 encode하여 firebase에 저장

## 그 외
### 프로젝트 기간 : 2023/07/03 ~ 2023/07/27
### 부트캠프 : 제로베이스 프론트엔드 스쿨