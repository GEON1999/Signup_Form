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
          social_id: userData.socialId || null, // GitHub 연동 시 GitHub 이메일 저장
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
          birth_date: userData.birthDate || null,
          gender: userData.gender || 'prefer_not_to_say',
          profile_image_url: userData.profileImageUrl || '',
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

    // 2. users 테이블에서 통합 조회 (명확한 우선순위로 동일한 레코드 반환)
    const userEmail = authUser.email;
    if (!userEmail) {
      throw new Error('사용자 이메일 정보가 없습니다.');
    }

    let userData = null;
    let userError = null;

    // 우선순위 1: email로 레코드 찾기 (기본 사용자 레코드)
    const { data: emailUser, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();

    if (emailError) {
      console.error('email 기준 사용자 조회 오류:', emailError);
      userError = emailError;
    } else if (emailUser) {
      console.log('기본 사용자 레코드 발견 (email 매칭):', emailUser.email);
      userData = emailUser;
    } else {
      // 우선순위 2: social_id로 레코드 찾기 (폴백)
      const { data: socialUser, error: socialError } = await supabase
        .from('users')
        .select('*')
        .eq('social_id', userEmail)
        .maybeSingle();

      if (socialError) {
        console.error('social_id 기준 사용자 조회 오류:', socialError);
        userError = socialError;
      } else if (socialUser) {
        console.log('대체 사용자 레코드 발견 (social_id 매칭):', socialUser.email);
        userData = socialUser;
      }
    }

    // 사용자 정보 처리
    let user: User;
    if (userError) {
      console.error('사용자 정보 조회 오류:', userError);
      throw userError;
    } else if (!userData) {
      // 통합 사용자 정보가 없으면 기본 정보 생성 (최소한의 폴백)
      console.warn(`이메일 ${userEmail}에 대한 통합 사용자 정보가 없음 - 기본 정보 사용`);
      user = {
        id: authUser.id,
        username: authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        phone: '',
        email_verified: authUser.email_confirmed_at ? true : false,
        phone_verified: false,
        social_id: undefined,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at,
      };
    } else {
      // 통합 사용자 정보 발견!
      console.log(`통합 사용자 정보 발견: ${userData.email} (social_id: ${userData.social_id})`);
      user = userData;
    }

    // 3. 프로필 조회 (통합된 사용자의 실제 이메일 사용)
    console.log(`프로필 조회 시작 - 사용자 ID: ${user.id}`);
    
    // 프로필 조회에 사용할 이메일: 통합된 사용자의 실제 이메일
    const profileSearchEmail = userData?.email || userEmail;
    console.log(`프로필 검색 이메일: ${profileSearchEmail} (authUser: ${userEmail}, userData: ${userData?.email})`);
    
    let profileData = null;

    // 우선순위 1: 통합된 사용자 ID로 프로필 조회
    const { data: directProfile, error: directError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (directError) {
      console.error('직접 프로필 조회 오류:', directError);
    } else if (directProfile) {
      console.log('직접 프로필 발견:', directProfile);
      profileData = directProfile;
    } else {
      // 우선순위 2: 이메일/social_id 기준 프로필 조회 (폴백)
      console.log(`직접 프로필 없음, 폴백 조회 시도...`);
      
      // 통합된 사용자의 email과 social_id 둘 다 수집
      const searchEmails = [];
      if (userData?.email) searchEmails.push(userData.email);
      if (userData?.social_id) searchEmails.push(userData.social_id);
      
      console.log(`폴백 검색 이메일들:`, searchEmails);
      
      // 각 이메일로 users 테이블에서 사용자 찾기
      const allUserRecords: any[] = [];
      
      for (const email of searchEmails) {
        console.log(`이메일로 사용자 검색: ${email}`);
        
        const { data: usersWithEmail, error: emailError } = await supabase
          .from('users')
          .select('id, email, username, social_id')
          .eq('email', email);
        
        if (emailError) {
          console.error(`이메일 ${email} 사용자 조회 오류:`, emailError);
        } else if (usersWithEmail && usersWithEmail.length > 0) {
          console.log(`이메일 ${email}로 ${usersWithEmail.length}개 사용자 발견:`, usersWithEmail);
          allUserRecords.push(...usersWithEmail);
        }
      }
      
      // 중복 제거 (동일한 user_id)
      const uniqueUsers = allUserRecords.filter((user, index, array) => 
        array.findIndex(u => u.id === user.id) === index
      );
      
      console.log(`총 ${uniqueUsers.length}개 고유 사용자 발견:`, uniqueUsers);

      // 각 사용자 ID로 프로필 찾기
      for (const userRecord of uniqueUsers) {
        console.log(`프로필 조회 시도 - user_id: ${userRecord.id} (email: ${userRecord.email})`);
        
        const { data: fallbackProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userRecord.id)
          .maybeSingle();

        console.log(`프로필 조회 결과 (user_id: ${userRecord.id}):`, fallbackProfile);

        if (fallbackProfile) {
          console.log(`🎉 폴백 프로필 발견! (user_id: ${userRecord.id}):`, fallbackProfile);
          profileData = fallbackProfile;
          break; // 첫 번째 프로필 사용
        } else {
          console.log(`프로필 없음 (user_id: ${userRecord.id})`);
        }
      }
      
      if (uniqueUsers.length === 0) {
        console.log('어떤 이메일로도 사용자를 찾을 수 없음!');
      }
    }

    const profile = profileData;
    console.log('최종 프로필 결과:', profile);

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

/**
 * GitHub identity를 기존 계정에 연결하는 API 함수
 * @returns linkIdentity 성공 여부
 */
export const linkGitHubIdentity = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // 현재 로그인된 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('로그인이 필요합니다.');
    }

    // linkIdentity로 GitHub 연결
    const { error: linkError } = await supabase.auth.linkIdentity({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/signup/step3?link=success`,
        scopes: 'user:email',
      },
    });

    if (linkError) {
      throw linkError;
    }

    return {
      success: true,
      message: 'GitHub 계정 연결이 시작되었습니다.',
    };
  } catch (error: any) {
    console.error('GitHub linkIdentity 오류:', error);
    return {
      success: false,
      message: error.message || 'GitHub 연결 중 오류가 발생했습니다.',
    };
  }
};

/**
 * GitHub OAuth 로그인 전용 함수
 * 홈 화면에서 GitHub 로그인 시 사용
 * @returns GitHub 로그인 결과
 */
export const handleGitHubLogin = async (): Promise<{
  user: User | null;
  profile: Profile | null;
}> => {
  try {
    // GitHub OAuth 로그인
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/home`,
        scopes: 'user:email',
      },
    });

    if (authError) {
      throw authError;
    }

    // OAuth는 리다이렉트 방식이므로 여기서는 null 반환
    // 실제 사용자 정보는 콜백 후 getCurrentUser()로 얻음
    return {
      user: null,
      profile: null,
    };
  } catch (error: any) {
    console.error('GitHub 로그인 오류:', error);
    throw error;
  }
};
