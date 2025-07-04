import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Step1FormData, type Step2FormData, type Step3FormData } from '../schemas/signupSchemas';

/**
 * 회원가입 프로세스 단계별 데이터를 관리하는 스토어 인터페이스
 */
interface SignupStore {
  // 단계별 폼 데이터
  step1Data: Step1FormData | null;
  step2Data: Step2FormData | null;
  step3Data: Partial<Step3FormData> | null;
  
  // 단계별 중복 확인 상태
  usernameChecked: boolean;
  usernameValid: boolean;
  emailChecked: boolean;
  emailValid: boolean;
  
  // 현재 단계
  currentStep: number;
  
  // 액션
  setStep1Data: (data: Step1FormData) => void;
  setStep2Data: (data: Step2FormData) => void;
  setStep3Data: (data: Partial<Step3FormData>) => void;
  
  setUsernameCheckStatus: (checked: boolean, valid: boolean) => void;
  setEmailCheckStatus: (checked: boolean, valid: boolean) => void;
  
  setCurrentStep: (step: number) => void;
  
  // 특정 필드 업데이트
  updateStep1Field: <K extends keyof Step1FormData>(field: K, value: Step1FormData[K]) => void;
  updateStep2Field: <K extends keyof Step2FormData>(field: K, value: Step2FormData[K]) => void;
  
  // 모든 데이터 초기화
  resetAllData: () => void;
}

/**
 * 회원가입 데이터를 로컬 스토리지에 저장하고 단계 간 데이터를 유지하는 스토어
 */
export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      // 초기 상태
      step1Data: null,
      step2Data: null,
      step3Data: null,
      usernameChecked: false,
      usernameValid: false,
      emailChecked: false,
      emailValid: false,
      currentStep: 1,
      
      // 액션 함수들
      setStep1Data: (data) => set({ step1Data: data }),
      setStep2Data: (data) => set({ step2Data: data }),
      setStep3Data: (data) => set({ step3Data: data }),
      
      setUsernameCheckStatus: (checked, valid) => 
        set({ usernameChecked: checked, usernameValid: valid }),
      
      setEmailCheckStatus: (checked, valid) => 
        set({ emailChecked: checked, emailValid: valid }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateStep1Field: (field, value) => 
        set((state) => ({ 
          step1Data: state.step1Data 
            ? { ...state.step1Data, [field]: value } 
            : { 
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                [field]: value
              }
        })),
        
      updateStep2Field: (field, value) => 
        set((state) => ({ 
          step2Data: state.step2Data 
            ? { ...state.step2Data, [field]: value }
            : { 
                birthDate: '',
                gender: 'prefer_not_to_say', 
                [field]: value 
              }
        })),
      
      resetAllData: () => set({
        step1Data: null,
        step2Data: null,
        step3Data: null,
        usernameChecked: false,
        usernameValid: false,
        emailChecked: false,
        emailValid: false,
        currentStep: 1
      }),
    }),
    {
      name: 'signup-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 브라우저 로컬 스토리지 사용
      partialize: (state) => ({
        // 로컬 스토리지에 저장할 필드 선택
        step1Data: state.step1Data,
        step2Data: state.step2Data,
        step3Data: state.step3Data,
        currentStep: state.currentStep
      }),
    }
  )
);

/**
 * 회원가입 스토어에서 전체 데이터를 가져오는 헬퍼 함수
 * @returns 모든 단계의 데이터를 합친 객체
 */
export const getCompleteSignupData = () => {
  const { step1Data, step2Data, step3Data } = useSignupStore.getState();
  return {
    ...step1Data,
    ...step2Data,
    ...step3Data,
  };
};
