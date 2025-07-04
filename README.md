# 🚀 회원가입 폼 구현

> **우리의이야기 프론트엔드 코딩테스트**  
> React + TypeScript + TailwindCSS 기반 회원가입 시스템

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 프로젝트 개요

**목표**: MVP 수준에서 **폼 밸리데이션**과 **컴포넌트 구성**에 집중한 회원가입 시스템 구현

### 📝 유의사항

- supabase 관련 환경 변수는 이메일에 별도 첨부 예정이니 확인해 주시면 감사하겠습니다.
- 로컬 실행 시 주소가 `http://localhost:5173/` 일 때만 소셜 로그인 기능이 정상 작동합니다.(callback url 설정)

### 🎯 완성된 핵심 기능

- ✅ **폼 밸리데이션**: Zod 스키마 기반 실시간 검증, 에러 처리, 사용자 피드백
- ✅ **컴포넌트 구성**: 모듈화된 재사용 가능한 UI 컴포넌트 설계
- ✅ **인증 시스템**: Supabase Auth 기반 로컬/소셜 로그인 통합 관리
- ✅ **상태 관리**: Zustand 기반 단계별 데이터 보존 및 로컬 스토리지 지속성
- ✅ **TypeScript**: 완전한 타입 안전성을 통한 코드 품질 확보
- ✅ **데이터베이스 연동**: 실시간 중복 확인, 프로필 이미지 업로드

### 📝 구현된 단계별 구성

1. **1단계**: 사용자명, 이메일, 비밀번호, 전화번호 + 실시간 중복 확인
2. **2단계**: 생년월일, 성별, 프로필 사진 업로드 (Supabase Storage)
3. **3단계**: GitHub OAuth 연동 (선택사항)

### 🔐 통합 로그인 시스템

- **로컬 로그인**: 이메일/비밀번호 기반 인증
- **GitHub OAuth**: 소셜 로그인 (기존 계정만 허용)
- **계정 통합**: social_id 컬럼을 통한 로컬/소셜 계정 매핑

---

## 기술 스택 및 선택 근거

### 프론트엔드 코어

- **React 18** + **TypeScript**
  - _선택 근거_: 컴포넌트 기반 개발, 타입 안전성, 생태계 성숙도
  - _구현 완료_: 단계별 폼 컴포넌트, 재사용 가능한 UI 컴포넌트, 완전한 타입 정의

- **Vite**
  - _선택 근거_: 빠른 개발 서버, HMR, 경량화된 번들링
  - _구현 완료_: 개발 환경 최적화, 빠른 빌드 설정

- **TailwindCSS**
  - _선택 근거_: 유틸리티 퍼스트, 빠른 스타일링, 일관된 디자인 시스템
  - _구현 완료_: 반응형 UI, 모든 컴포넌트 스타일링 완료

### 폼 & 검증

- **React Hook Form**
  - _선택 근거_: 성능 최적화(리렌더링 최소화), 직관적 API, 검증 통합
  - _구현 완료_: 3단계 폼 상태 관리, 실시간 검증, 에러 처리

- **Zod**
  - _선택 근거_: TypeScript 우선 스키마 검증, 런타임 안전성
  - _구현 완료_: 모든 폼 입력값 검증, API 응답 검증, 타입 추론

### 상태 관리 & 백엔드

- **Zustand**
  - _선택 근거_: 간단한 API, 보일러플레이트 최소화, TypeScript 지원
  - _구현 완료_: 회원가입 단계별 데이터 관리, 로컬 스토리지 지속성

- **Supabase**
  - _선택 근거_: 완전한 백엔드 서비스, Auth 기본 제공, Storage 통합
  - _구현 완료_: 인증 시스템, 데이터베이스, 파일 업로드, OAuth

### 개발 도구

- **ESLint** + **Prettier**: 코드 품질 및 일관성 (완료)
- **TypeScript**: 타입 안전성 및 개발 생산성 (완료)

---

## 🚀 개발 계획

### Phase 1: 프로젝트 설정 & 환경 구성

- [x] Vite + React + TypeScript 프로젝트 생성
- [x] TailwindCSS, 필수 라이브러리 설치
- [x] 기본 폴더 구조 및 라우팅 설정
- [x] **Supabase 프로젝트 생성 및 환경 변수 설정**
- [x] **데이터베이스 스키마 설계 (Users, Profiles, SNS_Accounts)**

### Phase 2: 데이터베이스 & 인증 기반 구축

- [x] **Supabase 클라이언트 설정 및 연결**
- [x] **데이터베이스 테이블 생성 (SQL 스크립트)**
- [ ] **Row Level Security (RLS) 정책 설정**
- [x] **기본 인증 스토어 구현 (Zustand)**
- [x] **회원가입/로그인 API 연동**

### Phase 3: 컴포넌트 개발 & 폼 검증

- [x] 재사용 가능한 UI 컴포넌트 구현
- [x] 폼 검증 스키마 정의 (Zod)
- [x] 단계별 페이지 컴포넌트 개발
- [x] **실시간 중복 확인 (사용자명, 이메일)**
- [x] **Supabase와 연동된 폼 검증 로직**

### Phase 4: 상태 관리 & 데이터 플로우

- [x] **Zustand 스토어 구현 (회원가입 데이터)**
- [x] **실시간 폼 검증 로직**
- [x] **단계별 데이터 보존 기능**
- [x] **Supabase Storage 연동 (프로필 이미지)**
- [x] **데이터베이스 저장/조회 로직 구현**

### Phase 5: SNS 연동 & OAuth

- [ ] **카카오 개발자 계정 및 앱 등록**
- [ ] **카카오 OAuth 플로우 구현**
- [ ] **SNS 계정 연동 UI/UX 개발**
- [ ] **SNS_Accounts 테이블 데이터 저장**
- [ ] **연동 성공/실패 처리 로직**

### Phase 6: UI/UX 완성 & 기능 통합

- [ ] 프로필 사진 업로드 & 크롭 기능
- [ ] 애니메이션 및 트랜지션
- [x] 반응형 디자인 적용
- [x] **전체 회원가입 플로우 통합 테스트**
- [ ] **세션 기반 간단 인증 구현**

### Phase 7: 최적화 & 마무리

- [ ] 코드 최적화 및 리팩토링
- [ ] 에러 처리 및 사용자 피드백 개선
- [ ] **보안 검토 (RLS, 입력 검증 등)**
- [ ] **성능 최적화 (이미지 압축, 쿼리 최적화)**
- [x] 문서화 및 README 완성

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
supabase 관련 환경 변수는 이메일에 별도 첨부 예정이니 확인해 주시면 감사하겠습니다.

---

## 🔧 핵심 설계 결정 사항 및 고민 과정

### 🤔 **주요 아키텍처 결정**

#### 1. **OAuth 제공자 변경: 카카오 → GitHub**

**배경:**

- 초기 계획: 카카오 OAuth 연동
- 변경 이유: Supabase에서 사용자 이메일을 필수로 요구하는데, 카카오는 이메일 제공을 보장하지 않음

**선택 근거:**

- ✅ **GitHub**: 개발자 대상 서비스에 적합, 이메일 정보 안정적 제공
- ❌ **카카오**: 이메일 필수값 미제공으로 Supabase 요구사항과 충돌

#### 2. **Row Level Security (RLS) 제거 결정**

**배경:**

- 초기 계획: Supabase RLS 적용으로 보안 강화
- 변경 이유: 개발 단계에서 접근 권한 문제로 인한 복잡성 증가

**선택 근거:**

- ✅ **제거**: 개발 속도 향상, 디버깅 용이성
- ⚠️ **트레이드오프**: 보안 레벨 일부 하향 (프로덕션 환경에서는 재검토 필요)

### 💡 **인증 시스템 통합 전략**

#### **핵심 문제: Supabase Auth의 계정 분리 구조**

**문제 상황:**

```
동일 이메일의 로컬 계정과 GitHub 계정이 서로 다른 user_id로 생성
→ 사용자 관점에서는 하나의 계정으로 인식하고 싶음
```

#### **검토된 해결방안**

| 방안                  | 장점                    | 단점                   | 선택여부 |
| --------------------- | ----------------------- | ---------------------- | -------- |
| **linkIdentity 사용** | 공식 지원, 단일 user_id | 베타 기능, 복잡한 구현 | ❌       |
| **매핑 테이블 생성**  | 완전한 제어             | 추가 테이블 관리 부담  | ❌       |
| **Users 테이블 통합** | 단순함, 안정성          | Auth에 중복 계정 생성  | ✅       |

#### **선택된 솔루션: Custom Users 테이블 통합**

**구현 방식:**

```typescript
// Supabase Auth: 인증만 담당 (별도 user_id 허용)
// Custom Users: 실제 사용자 데이터 관리 (social_id로 매핑)

const { data: existingUsers } = await supabase
  .from('users')
  .select('*')
  .or(`email.eq.${email},social_id.eq.${email}`)
  .limit(1);
```

**장점:**

- ✅ Supabase Auth 기본 기능만 사용하여 안정성 확보
- ✅ 각 인증 방식별 독립적 보안 정책 적용 가능
- ✅ social_id 컬럼으로 간단한 매핑 관계 구현
- ✅ 향후 다른 OAuth 제공자 쉽게 추가 가능

**단점:**

- ⚠️ Supabase Auth에 중복 계정 생성 (리소스 사용량 증가)
- ⚠️ 인증 로직이 두 곳에 분산 (Auth + Custom Users)
- ⚠️ getCurrentUser에서 추가 DB 쿼리 필요

### 🎯 **구현 결과**

**사용자 경험:**

- 로컬 로그인과 GitHub 로그인 모두 동일한 프로필 데이터 확인
- 통합된 사용자 관리 화면
- 일관된 인증 플로우

**개발자 경험:**

- 복잡한 계정 연결 로직 없이 안정적인 시스템 구축
- 향후 확장 시 동일한 패턴으로 새로운 OAuth 제공자 추가 가능
- 명확한 책임 분리 (인증 vs 프로필 데이터)

### **추가 기능 고려 네용**

- 이미지 크롭/리사이즈 기능
- 애니메이션 & 트랜지션
- 이메일 인증 (supabase 기본제공)
- 아이디 / 비밀번호 찾기 (supabase 기본제공)

---
