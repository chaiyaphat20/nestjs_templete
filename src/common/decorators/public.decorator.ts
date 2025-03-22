import { SetMetadata } from '@nestjs/common';

//กรณีที่ตั้งค่า JwtGuard เป็น global guard  จะใช้ เพื่อ ยกเลิก JwtGuard
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
