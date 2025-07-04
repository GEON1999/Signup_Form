import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * 프로필 이미지 업로드 함수
 * @param file 업로드할 이미지 파일
 * @param userId 사용자 ID (선택적)
 * @returns 업로드된 이미지의 URL
 */
export const uploadProfileImage = async (
  file: File,
  userId?: string
): Promise<string> => {
  try {
    if (!file) {
      throw new Error('업로드할 파일이 없습니다.');
    }

    // 파일 확장자 가져오기
    const fileExt = file.name.split('.').pop();
    // 고유한 파일 이름 생성 (userId가 있으면 사용, 없으면 uuid 생성)
    const fileName = `${userId || uuidv4()}_profile.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('avatars') // 버킷 이름
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('이미지 업로드 오류:', error);
      throw error;
    }

    if (!data?.path) {
      throw new Error('이미지 경로를 가져올 수 없습니다.');
    }

    // 업로드된 이미지의 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('프로필 이미지 업로드 API 오류:', error.message);
    throw error;
  }
};

/**
 * 이미지 URL로부터 파일 객체 생성 (base64 데이터 URL인 경우)
 * @param dataUrl base64 데이터 URL
 * @param fileName 생성할 파일 이름
 * @returns File 객체
 */
export const dataUrlToFile = async (
  dataUrl: string,
  fileName = 'profile.jpg'
): Promise<File> => {
  // base64 데이터 URL에서 실제 base64 문자열 추출
  const base64Data = dataUrl.split(',')[1];
  // base64를 바이너리로 변환
  const binaryData = atob(base64Data);

  // 바이너리 데이터를 Uint8Array로 변환
  const bytes = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    bytes[i] = binaryData.charCodeAt(i);
  }

  // MIME 타입 추출
  const mimeMatch = dataUrl.match(/^data:([^;]+);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  // File 객체 생성
  return new File([bytes.buffer], fileName, { type: mime });
};
