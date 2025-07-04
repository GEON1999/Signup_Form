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

### 3. SNS_Accounts 테이블 (SNS 연동 정보)

```sql
CREATE TABLE sns_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(255),
  provider_name VARCHAR(100),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);
```

**필드 설명:**

- `id`: SNS 계정 고유 식별자
- `user_id`: Users 테이블 참조 (외래키)
- `provider`: SNS 제공업체 (google, kakao, naver 등)
- `provider_id`: SNS 제공업체에서의 사용자 ID
- `provider_email`: SNS에서 제공하는 이메일
- `provider_name`: SNS에서 제공하는 이름
- `access_token`: OAuth 액세스 토큰
- `refresh_token`: OAuth 리프레시 토큰
- `token_expires_at`: 토큰 만료 시간
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

## 테이블 관계

### 1. Users ↔ Profiles (1:1 관계)

- 한 사용자는 하나의 프로필을 가짐
- 프로필은 반드시 사용자에 속함
- CASCADE DELETE: 사용자 삭제 시 프로필도 삭제

### 2. Users ↔ SNS_Accounts (1:N 관계)

- 한 사용자는 여러 SNS 계정을 연동할 수 있음(확장 가능성)
- SNS 계정은 반드시 하나의 사용자에 속함
- CASCADE DELETE: 사용자 삭제 시 연동된 SNS 계정도 삭제

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

### SNS_Accounts 테이블

```sql
CREATE INDEX idx_sns_accounts_user_id ON sns_accounts(user_id);
CREATE INDEX idx_sns_accounts_provider ON sns_accounts(provider);
CREATE INDEX idx_sns_accounts_provider_id ON sns_accounts(provider, provider_id);
```

## Row Level Security (RLS) 정책

### Users 테이블

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 정보만 조회 가능
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- 사용자는 자신의 정보만 수정 가능
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);
```

### Profiles 테이블

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 프로필만 생성 가능
CREATE POLICY "Users can create own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### SNS_Accounts 테이블

```sql
ALTER TABLE sns_accounts ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 SNS 계정만 조회 가능
CREATE POLICY "Users can view own sns accounts" ON sns_accounts
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 SNS 계정만 수정 가능
CREATE POLICY "Users can update own sns accounts" ON sns_accounts
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 SNS 계정만 생성 가능
CREATE POLICY "Users can create own sns accounts" ON sns_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 SNS 계정만 삭제 가능
CREATE POLICY "Users can delete own sns accounts" ON sns_accounts
    FOR DELETE USING (auth.uid() = user_id);
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
