# 🚀 회원가입 폼 구현

> **우리의이야기 프론트엔드 코딩테스트**  
> React + TypeScript + TailwindCSS 기반 3단계 회원가입 시스템

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 프로젝트 개요

**목표**: MVP 수준에서 **폼 밸리데이션**과 **컴포넌트 구성**에 집중한 3단계 회원가입 시스템 구현

### 🎯 핵심 요구사항

- ✅ **폼 밸리데이션**: 실시간 검증, 에러 처리, 사용자 피드백
- ✅ **컴포넌트 구성**: 모듈화된 재사용 가능한 컴포넌트 설계
- ✅ **UI 흐름**: 직관적인 3단계 진행 및 네비게이션
- ✅ **상태 관리**: 단계별 데이터 보존 및 폼 상태 관리
- ✅ **TypeScript**: 타입 안전성을 통한 코드 품질 확보

### 📝 단계별 구성

1. **1단계**: 아이디, 비밀번호, 이메일, 전화번호
2. **2단계**: 생년월일, 성별, 프로필 사진 업로드
3. **3단계**: SNS 소설 계정 연결

### 📝 추가 기능 고려사항

- 로그인/인증 시스템
- 이미지 업로드/자르기 기능
- DB 연동을 통한 실시간 중복 확인
- 이메일 인증

---

## 🛠 기술 스택 및 선택 근거

### 🎨 **프론트엔드 코어**

- **React 18** + **TypeScript**

  - _선택 근거_: 컴포넌트 기반 개발, 타입 안전성, 생태계 성숙도
  - _사용 사례_: 단계별 폼 컴포넌트, 재사용 가능한 UI 컴포넌트

- **Vite**

  - _선택 근거_: 빠른 개발 서버, 최적화된 빌드
  - _대안 대비_: CRA보다 5-10배 빠른 개발 경험

- **TailwindCSS**
  - _선택 근거_: 유틸리티 퍼스트, 일관된 디자인 시스템
  - _사용 사례_: 반응형 디자인, 컴포넌트 스타일링

### 🔧 **폼 처리 & 검증**

- **React Hook Form**

  - _선택 근거_: 높은 성능, 적은 리렌더링, 직관적 API
  - _사용 사례_: 각 단계별 폼 상태 관리, 검증 로직

- **Zod**
  - _선택 근거_: TypeScript 퍼스트, 런타임 검증, 타입 추론
  - _사용 사례_: 폼 데이터 스키마 정의, 실시간 검증

### 🗂 **상태 관리**

- **Zustand**
  - _선택 근거_: 간단한 API, 보일러플레이트 최소화
  - _사용 사례_: 단계별 데이터 보존, 진행 상태 관리
  - _대안 대비_: Redux 대비 90% 적은 코드량

### 🚀 **백엔드 & 인증**

- **Supabase**
  - _선택 근거_: 간편한 설정, 경량 프로젝트에 최적
  - _사용 사례_: 회원가입/로그인, 프로필 사진 저장, 실시간 데이터베이스
  - _장점_: JWT 자동 관리, 실시간 구독, Row Level Security

### 🎯 **추가 라이브러리**

- **React Router v6**: 단계별 라우팅, 뒤로가기 방지
- **react-easy-crop**: 프로필 사진 자르기 기능
- **date-fns**: 날짜 형식 처리, 검증
- **react-hot-toast**: 사용자 피드백 알림

---

## 프로젝트 구조

```
signup-form/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── pages/               # 단계별 페이지 컴포넌트
│   ├── hooks/               # 커스텀 훅
│   ├── stores/              # 상태 관리
│   ├── schemas/             # 폼 검증 스키마
│   ├── utils/               # 유틸리티 함수
│   ├── types/               # TypeScript 타입 정의
│   └── constants/           # 상수 정의
└── README.md
```

---

## 🚀 개발 계획

### Phase 1: 프로젝트 설정 & 환경 구성

- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] TailwindCSS, 필수 라이브러리 설치
- [ ] 기본 폴더 구조 및 라우팅 설정
- [ ] **Supabase 프로젝트 생성 및 환경 변수 설정**
- [ ] **데이터베이스 스키마 설계 (Users, Profiles, SNS_Accounts)**

### Phase 2: 데이터베이스 & 인증 기반 구축

- [ ] **Supabase 클라이언트 설정 및 연결**
- [ ] **데이터베이스 테이블 생성 (SQL 스크립트)**
- [ ] **Row Level Security (RLS) 정책 설정**
- [ ] **기본 인증 스토어 구현 (Zustand)**
- [ ] **회원가입/로그인 API 연동**

### Phase 3: 컴포넌트 개발 & 폼 검증

- [ ] 재사용 가능한 UI 컴포넌트 구현
- [ ] 폼 검증 스키마 정의 (Zod)
- [ ] 단계별 페이지 컴포넌트 개발
- [ ] **실시간 중복 확인 (사용자명, 이메일)**
- [ ] **Supabase와 연동된 폼 검증 로직**

### Phase 4: 상태 관리 & 데이터 플로우

- [ ] Zustand 스토어 구현 (회원가입 데이터)
- [ ] 실시간 폼 검증 로직
- [ ] 단계별 데이터 보존 기능
- [ ] **Supabase Storage 연동 (프로필 이미지)**
- [ ] **데이터베이스 저장/조회 로직 구현**

### Phase 5: SNS 연동 & OAuth

- [ ] **카카오 개발자 계정 및 앱 등록**
- [ ] **카카오 OAuth 플로우 구현**
- [ ] **SNS 계정 연동 UI/UX 개발**
- [ ] **SNS_Accounts 테이블 데이터 저장**
- [ ] **연동 성공/실패 처리 로직**

### Phase 6: UI/UX 완성 & 기능 통합

- [ ] 프로필 사진 업로드 & 크롭 기능
- [ ] 애니메이션 및 트랜지션
- [ ] 반응형 디자인 적용
- [ ] **전체 회원가입 플로우 통합 테스트**
- [ ] **세션 기반 간단 인증 구현**

### Phase 7: 최적화 & 마무리

- [ ] 코드 최적화 및 리팩토링
- [ ] 에러 처리 및 사용자 피드백 개선
- [ ] **보안 검토 (RLS, 입력 검증 등)**
- [ ] **성능 최적화 (이미지 압축, 쿼리 최적화)**
- [ ] 문서화 및 README 완성

---

## 💾 실행 방법

### 개발 환경 요구사항

- Node.js 18+
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 🔧 환경 변수 설정

환경 변수는 `.env` 파일에 설정합니다.
소셜 로그인등의 key값은 메일에 별도 첨부 예정이니 확인해 주시면 감사하겠습니다.

---

## 📚 학습 리소스

### 참고 문서

- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [Zod 스키마 검증](https://zod.dev/)
- [Zustand 상태 관리](https://github.com/pmndrs/zustand)
- [TailwindCSS 유틸리티](https://tailwindcss.com/)
