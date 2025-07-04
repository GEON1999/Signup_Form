import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        // GitHub OAuth 콜백 처리
        const { data: authData, error: authError } =
          await supabase.auth.getSession();

        if (authError) {
          throw new Error(`인증 오류: ${authError.message}`);
        }

        const user = authData.session?.user;
        if (!user || !user.email) {
          throw new Error('GitHub에서 사용자 정보를 가져올 수 없습니다.');
        }

        // 기존 계정 확인 (users 테이블에서 이메일 또는 social_id 확인)
        const { data: existingUsers, error: userError } = await supabase
          .from('users')
          .select('id, email, social_id')
          .or(`email.eq.${user.email},social_id.eq.${user.email}`)
          .limit(1);

        if (userError) {
          console.error('사용자 조회 오류:', userError);
          throw new Error('계정 확인 중 오류가 발생했습니다.');
        }

        // 기존 계정이 없으면 로그인 거부
        if (!existingUsers || existingUsers.length === 0) {
          // GitHub 인증 세션 정리
          await supabase.auth.signOut();

          setStatus('error');
          setErrorMessage(
            '등록되지 않은 계정입니다. 먼저 회원가입을 완료해주세요.'
          );

          // 3초 후 홈으로 리디렉션
          setTimeout(() => {
            navigate('/', {
              state: {
                error:
                  '등록되지 않은 GitHub 계정입니다. 회원가입 후 GitHub을 연동해주세요.',
              },
            });
          }, 1500);
          return;
        }

        // 기존 계정이 있으면 로그인 허용
        console.log('GitHub 로그인 성공:', existingUsers[0]);
        setStatus('success');

        // /home으로 리디렉션
        navigate('/home', { replace: true });
      } catch (error: any) {
        console.error('GitHub 콜백 처리 오류:', error);
        setStatus('error');
        setErrorMessage(error.message || '로그인 처리 중 오류가 발생했습니다.');

        // GitHub 인증 세션 정리
        await supabase.auth.signOut();

        // 3초 후 홈으로 리디렉션
        setTimeout(() => {
          navigate('/', {
            state: {
              error: error.message || 'GitHub 로그인 중 오류가 발생했습니다.',
            },
          });
        }, 1500);
      }
    };

    handleGitHubCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              GitHub 로그인 처리 중...
            </h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              로그인 성공!
            </h2>
            <p className="text-gray-600">홈페이지로 이동합니다...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              로그인 실패
            </h2>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <p className="text-gray-500 text-sm">홈페이지로 돌아갑니다...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
