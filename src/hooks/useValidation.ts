import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { checkUsernameAvailability, checkEmailAvailability } from '../api/auth';

interface ValidationResult {
  isChecking: boolean;
  isValid: boolean;
  message: string;
}

/**
 * 사용자명 실시간 중복 확인 커스텀 훅
 * @param username 확인할 사용자명
 * @param delay 디바운스 지연 시간 (기본값: 500ms)
 * @returns 검증 상태와 결과
 */
export const useUsernameValidation = (
  username: string, 
  delay: number = 500
): ValidationResult => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
  const debouncedUsername = useDebounce(username, delay);

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.trim().length === 0) {
      setIsChecking(false);
      setIsValid(false);
      setMessage('');
      return;
    }

    const validateUsername = async () => {
      setIsChecking(true);
      
      try {
        const result = await checkUsernameAvailability(debouncedUsername);
        setIsValid(result.isAvailable);
        setMessage(result.message);
      } catch (error) {
        console.error('사용자명 검증 오류:', error);
        setIsValid(false);
        setMessage('검증 중 오류가 발생했습니다');
      } finally {
        setIsChecking(false);
      }
    };

    validateUsername();
  }, [debouncedUsername]);

  return { isChecking, isValid, message };
};

/**
 * 이메일 실시간 중복 확인 커스텀 훅
 * @param email 확인할 이메일
 * @param delay 디바운스 지연 시간 (기본값: 500ms)
 * @returns 검증 상태와 결과
 */
export const useEmailValidation = (
  email: string, 
  delay: number = 500
): ValidationResult => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
  const debouncedEmail = useDebounce(email, delay);

  useEffect(() => {
    if (!debouncedEmail || debouncedEmail.trim().length === 0) {
      setIsChecking(false);
      setIsValid(false);
      setMessage('');
      return;
    }

    const validateEmail = async () => {
      setIsChecking(true);
      
      try {
        const result = await checkEmailAvailability(debouncedEmail);
        setIsValid(result.isAvailable);
        setMessage(result.message);
      } catch (error) {
        console.error('이메일 검증 오류:', error);
        setIsValid(false);
        setMessage('검증 중 오류가 발생했습니다');
      } finally {
        setIsChecking(false);
      }
    };

    validateEmail();
  }, [debouncedEmail]);

  return { isChecking, isValid, message };
};
