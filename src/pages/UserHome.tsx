import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer } from '../components/ui';
import { getCurrentUser } from '../api/auth';
import { supabase } from '../lib/supabase';
import type { User, Profile } from '../types/auth';

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // getCurrentUser API를 통해 사용자 정보 가져오기
        const { user, profile } = await getCurrentUser();
        
        if (!user) {
          // 로그인되지 않은 상태면 로그인 페이지로 리디렉션
          navigate('/', { replace: true });
          return;
        }

        setUser(user);
        setProfile(profile);
      } catch (error: any) {
        console.error('사용자 정보 조회 오류:', error);
        setError(error.message || '사용자 정보를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 기본 프로필 이미지
  const defaultProfileImage = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <FormContainer
          title="사용자 프로필"
          subtitle="로그인 성공! 환영합니다"
          maxWidth="md"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              {/* 프로필 이미지 */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                <img
                  src={profile?.profile_image_url || defaultProfileImage}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 사용자 정보 */}
              <h2 className="text-2xl font-bold text-gray-800">{user?.username}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>

              {/* 부가 정보 */}
              <div className="w-full max-w-md mt-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 정보</h3>
                  <dl className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">이메일</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{user?.email}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">이메일 인증</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {user?.email_verified ? (
                          <span className="text-green-600">인증됨 ✓</span>
                        ) : (
                          <span className="text-yellow-600">인증 필요</span>
                        )}
                      </dd>
                    </div>
                    {profile?.birth_date && (
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">생년월일</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {profile.birth_date}
                        </dd>
                      </div>
                    )}
                    {profile?.gender && profile.gender !== 'prefer_not_to_say' && (
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">성별</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {profile.gender === 'male'
                            ? '남성'
                            : profile.gender === 'female'
                            ? '여성'
                            : '기타'}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="mt-8 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </FormContainer>
      </div>
    </div>
  );
};

export default UserHome;
