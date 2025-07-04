// 인증 관련 타입 정의

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  email_verified: boolean;
  phone_verified: boolean;
  social_id?: string; // GitHub 연동 시 GitHub 이메일 저장
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profile_image_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  // 상태
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setProfile: (profile: Profile) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface SignupData {
  // Step 1 - 기본 정보
  username: string;
  email: string;
  password: string;
  phone: string;
  
  // Step 2 - 프로필 정보
  birthDate: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profileImageUrl?: string;
  
  // Step 3 - 소셜 연동 정보
  socialId?: string; // GitHub 연동 시 GitHub 이메일 저장
}
