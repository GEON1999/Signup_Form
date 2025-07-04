import { supabase } from '../lib/supabase';
import type { SignupData, User, Profile } from '../types/auth';

/**
 * 회원가입 API 함수
 * @param userData 회원가입에 필요한 사용자 데이터
 * @returns 회원가입 결과 (사용자 정보, 프로필 정보)
 */
export const signUp = async (
  userData: SignupData
): Promise<{ user: User | null; profile: Profile | null }> => {
  try {
    // 1. Supabase Auth로 사용자 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('회원가입 실패: 사용자 정보가 생성되지 않았습니다.');
    }

    // 2. users 테이블에 사용자 정보 저장
    const { data: userData2, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          username: userData.username,
          email: userData.email,
          phone: '', // 빈 문자열로 기본값 설정
          email_verified: false,
          phone_verified: false,
        },
      ])
      .select('*')
      .single();

    if (userError) {
      console.error('사용자 정보 저장 실패:', userError);
      // Auth 사용자는 생성되었지만 DB 저장 실패 시 기본 정보 반환
      const basicUser: User = {
        id: authData.user.id,
        username: userData.username,
        email: userData.email,
        phone: '', // 빈 문자열로 기본값 설정
        email_verified: false,
        phone_verified: false,
        created_at: authData.user.created_at || new Date().toISOString(),
        updated_at: authData.user.updated_at || new Date().toISOString(),
      };
      return { user: basicUser, profile: null };
    }

    // 3. profiles 테이블에 프로필 정보 저장
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: authData.user.id,
          birth_date: userData.birth_date || null,
          gender: userData.gender || 'prefer_not_to_say',
          profile_image_url: userData.profile_image_url || '',
        },
      ])
      .select('*')
      .single();

    if (profileError) {
      console.error('프로필 정보 저장 실패:', profileError);
      // 프로필 저장 실패 시 사용자 정보만 반환
      return { user: userData2, profile: null };
    }

    return { user: userData2, profile: profileData };
  } catch (error: any) {
    console.error('회원가입 API 오류:', error.message);
    throw error;
  }
};

/**
 * 로그인 API 함수
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @returns 로그인 결과 (사용자 정보, 프로필 정보)
 */
export const signIn = async (
  email: string,
  password: string
): Promise<{ user: User | null; profile: Profile | null }> => {
  try {
    // 1. Supabase Auth로 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('로그인 실패: 사용자 정보가 없습니다.');
    }

    // 2. users 테이블에서 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    // 사용자 정보 처리
    let user;
    if (userError) {
      console.error('사용자 정보 조회 오류:', userError);
      throw userError;
    } else if (!userData) {
      // 사용자 정보가 없으면 기본 정보 생성
      user = {
        id: data.user.id,
        username: data.user.email?.split('@')[0] || '',
        email: data.user.email || '',
        phone: '',
        email_verified: data.user.email_confirmed_at ? true : false,
        phone_verified: false,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at,
      };
    } else {
      user = userData;
    }

    // 3. profiles 테이블에서 프로필 정보 조회
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .maybeSingle();

    // 프로필이 없어도 에러로 처리하지 않음
    const profile = profileError ? null : profileData;

    return { user, profile };
  } catch (error: any) {
    console.error('로그인 API 오류:', error.message);
    throw error;
  }
};

/**
 * 로그아웃 API 함수
 * @returns 로그아웃 성공 여부
 */
export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error('로그아웃 API 오류:', error.message);
    throw error;
  }
};

/**
 * 비밀번호 재설정 이메일 전송 API 함수
 * @param email 비밀번호를 재설정할 이메일
 * @returns 이메일 전송 성공 여부
 */
export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error('비밀번호 재설정 API 오류:', error.message);
    throw error;
  }
};

/**
 * 새 비밀번호 설정 API 함수
 * @param newPassword 새 비밀번호
 * @returns 비밀번호 변경 성공 여부
 */
export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error('비밀번호 변경 API 오류:', error.message);
    throw error;
  }
};

/**
 * 현재 로그인한 사용자 정보 조회 API 함수
 * @returns 현재 로그인한 사용자 정보
 */
export const getCurrentUser = async (): Promise<{
  user: User | null;
  profile: Profile | null;
}> => {
  try {
    // 1. 현재 세션 확인
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session?.user) {
      return { user: null, profile: null };
    }

    const authUser = sessionData.session.user;

    // 2. users 테이블에서 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    // 사용자 정보 처리
    let user;
    if (userError) {
      console.error('사용자 정보 조회 오류:', userError);
      throw userError;
    } else if (!userData) {
      // 사용자 정보가 없으면 기본 정보 생성
      user = {
        id: authUser.id,
        username: authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        phone: '',
        email_verified: authUser.email_confirmed_at ? true : false,
        phone_verified: false,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at,
      };
    } else {
      user = userData;
    }

    // 3. profiles 테이블에서 프로필 정보 조회
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .maybeSingle();

    const profile = profileError ? null : profileData;

    return { user, profile };
  } catch (error: any) {
    console.error('현재 사용자 정보 조회 API 오류:', error.message);
    throw error;
  }
};

/**
 * 사용자명 중복 확인 API 함수
 * @param username 확인할 사용자명
 * @returns 중복 여부 (true: 중복됨, false: 사용 가능)
 */
export const checkUsernameAvailability = async (
  username: string
): Promise<{
  isAvailable: boolean;
  message: string;
}> => {
  try {
    console.log('사용자명 중복 확인 시작:', username);

    // 데이터베이스에서 중복 확인 - select 메소드 변경
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

    console.log('Supabase 사용자명 응답:', { data, error });

    if (error) {
      console.error('사용자명 중복 확인 오류:', error);
      return {
        isAvailable: false,
        message: '중복 확인 중 오류가 발생했습니다',
      };
    }

    // 실제 데이터베이스에서 찾지 못한 경우 목업 데이터에서 확인
    let isAvailable = data.length === 0;

    console.log('사용자명 중복 확인 결과:', {
      dataLength: data.length,
      isAvailable,
    });

    return {
      isAvailable,
      message: isAvailable
        ? '중복되지 않은 사용자명입니다'
        : '이미 사용중인 사용자명입니다',
    };
  } catch (error: any) {
    console.error('사용자명 중복 확인 API 오류:', error.message);
    return {
      isAvailable: false,
      message: '중복 확인 중 오류가 발생했습니다',
    };
  }
};

/**
 * 이메일 중복 확인 API 함수
 * @param email 확인할 이메일
 * @returns 중복 여부 (true: 중복됨, false: 사용 가능)
 */
export const checkEmailAvailability = async (
  email: string
): Promise<{
  isAvailable: boolean;
  message: string;
}> => {
  try {
    console.log('이메일 중복 확인 시작:', email);

    // 데이터베이스에서 중복 확인 - select 메소드 변경
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    console.log('Supabase 이메일 응답:', { data, error });

    if (error) {
      console.error('이메일 중복 확인 오류:', error);
      return {
        isAvailable: false,
        message: '중복 확인 중 오류가 발생했습니다',
      };
    }

    // 실제 데이터베이스에서 찾지 못한 경우 목업 데이터에서 확인
    let isAvailable = data.length === 0;

    console.log('이메일 중복 확인 결과:', {
      dataLength: data.length,
      isAvailable,
    });

    return {
      isAvailable,
      message: isAvailable
        ? '중복되지 않은 이메일입니다'
        : '이미 가입된 이메일입니다',
    };
  } catch (error: any) {
    console.error('이메일 중복 확인 API 오류:', error.message);
    return {
      isAvailable: false,
      message: '중복 확인 중 오류가 발생했습니다',
    };
  }
};
