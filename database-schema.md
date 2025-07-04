# 데이터베이스 스키마 설계

## 개요

회원가입 시스템을 위한 데이터베이스 스키마 설계

## 테이블 구조

### 1. Users 테이블 (기본 인증 정보)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  social_id VARCHAR(255), -- GitHub 연동 시 GitHub 이메일 저장, 비연동시 NULL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**

- `id`: 사용자 고유 식별자 (UUID)
- `username`: 사용자 아이디 (고유)
- `email`: 이메일 주소 (고유)
- `phone`: 전화번호 (고유)
- `password_hash`: 암호화된 비밀번호
- `email_verified`: 이메일 인증 여부
- `phone_verified`: 전화번호 인증 여부
- `social_id`: GitHub 연동 시 GitHub 이메일 저장 (통합 계정 관리용)
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

### 2. Profiles 테이블 (개인 정보)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  birth_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**

- `id`: 프로필 고유 식별자
- `user_id`: Users 테이블 참조 (외래키)
- `birth_date`: 생년월일
- `gender`: 성별 (enum 제약 조건)
- `profile_image_url`: 프로필 사진 URL
- `bio`: 자기소개 (선택사항)
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

### 3. 소셜 계정 연동

Supabase의 내장 인증 시스템과 `linkIdentity` 기능을 사용하여 소셜 계정 연동을 처리합니다.
- 이메일/비밀번호로 회원가입한 사용자에게 GitHub 등의 소셜 계정을 연결
- 별도의 sns_accounts 테이블 없이 Supabase Auth에서 통합 관리
- `auth.identities` 테이블에서 연결된 계정 정보 확인 가능

## 테이블 관계

### 1. Users ↔ Profiles (1:1 관계)

- 한 사용자는 하나의 프로필을 가짐
- 프로필은 반드시 사용자에 속함
- CASCADE DELETE: 사용자 삭제 시 프로필도 삭제

## 인덱스 설계

### Users 테이블

```sql
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

### Profiles 테이블

```sql
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```



## 회원가입 단계별 데이터 수집

### Step 1: 기본 정보

- `users.username`
- `users.email`
- `users.phone`
- `users.password_hash`

### Step 2: 개인 정보

- `profiles.birth_date`
- `profiles.gender`
- `profiles.profile_image_url`

### Step 3: SNS 연동 (선택사항)

- `sns_accounts.provider`
- `sns_accounts.provider_id`
- `sns_accounts.provider_email`
- `sns_accounts.provider_name`
- OAuth 토큰 정보

## 데이터 검증 규칙

### Users 테이블

- `username`: 4-20자, 영문자/숫자만 허용
- `email`: 유효한 이메일 형식
- `phone`: 대한민국 전화번호 형식
- `password`: 최소 8자, 대소문자/숫자/특수문자 포함
