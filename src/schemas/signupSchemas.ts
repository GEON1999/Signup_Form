import { z } from 'zod';

// 1단계: 기본 정보 (아이디, 비밀번호, 이메일, 전화번호)
export const step1Schema = z
  .object({
    username: z
      .string()
      .min(4, '아이디는 4글자 이상이어야 합니다')
      .max(20, '아이디는 20글자 이하여야 합니다')
      .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문, 숫자만 사용 가능합니다')
      .refine(
        (val) => !/^\d+$/.test(val),
        '아이디는 숫자만으로 구성될 수 없습니다'
      ),

    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .max(255, '이메일은 255글자 이하여야 합니다')
      .email('올바른 이메일 형식을 입력해주세요'),

    password: z
      .string()
      .min(8, '비밀번호는 8글자 이상이어야 합니다')
      .max(20, '비밀번호는 20글자 이하여야 합니다')
      .regex(/(?=.*[a-z])/, '비밀번호에 소문자가 포함되어야 합니다')
      .regex(/(?=.*[A-Z])/, '비밀번호에 대문자가 포함되어야 합니다')
      .regex(/(?=.*\d)/, '비밀번호에 숫자가 포함되어야 합니다')
      .regex(
        /(?=.*[!@#$%^&*])/,
        '비밀번호에 특수문자(!@#$%^&*)가 포함되어야 합니다'
      ),

    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),

    phone: z
      .string()
      .min(1, '전화번호를 입력해주세요')
      .max(20, '전화번호는 20글자 이하여야 합니다')
      .regex(
        /^01[0-9]{8,9}$/,
        '올바른 전화번호 형식을 입력해주세요 (01012345678)'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

// 2단계: 개인 정보 (생년월일, 성별, 프로필 사진)
export const step2Schema = z.object({
  birthDate: z
    .string()
    .min(1, '생년월일을 입력해주세요')
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      '올바른 날짜 형식을 입력해주세요 (YYYY-MM-DD)'
    )
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 14 && age <= 120;
    }, '만 14세 이상만 가입 가능합니다'),

  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    errorMap: () => ({ message: '성별을 선택해주세요' }),
  }),

  profileImage: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true; // 선택사항이므로 파일이 없어도 통과
      return file.size <= 5 * 1024 * 1024; // 5MB 제한
    }, '프로필 사진은 5MB 이하여야 합니다')
    .refine((file) => {
      if (!file) return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
        file.type
      );
    }, '프로필 사진은 JPG, PNG, GIF 형식만 업로드 가능합니다'),
});

// 3단계: SNS 연결 (선택사항)
export const step3Schema = z.object({
  snsConnections: z
    .object({
      kakao: z
        .object({
          connected: z.boolean().default(false),
          accountId: z.string().optional(),
        })
        .optional(),

      naver: z
        .object({
          connected: z.boolean().default(false),
          accountId: z.string().optional(),
        })
        .optional(),

      google: z
        .object({
          connected: z.boolean().default(false),
          accountId: z.string().optional(),
        })
        .optional(),
    })
    .default({}),
});

// 전체 회원가입 통합 스키마
export const signupSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
});

// TypeScript 타입 추출
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일 또는 아이디를 입력해주세요')
    .refine((value) => {
      // 이메일 형식 또는 아이디 형식 둘 다 허용
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      return emailRegex.test(value) || usernameRegex.test(value);
    }, '올바른 이메일 또는 아이디를 입력해주세요'),

  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
