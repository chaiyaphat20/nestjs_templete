import * as crypto from 'crypto';

export class IdGenerator {
  static generateObjectIdLike(): string {
    // สร้าง timestamp (8 ตัวอักษร hex)
    const timestamp = Math.floor(Date.now() / 1000)
      .toString(16)
      .padStart(8, '0');
    // สร้างตัวเลข random 12 bytes (24 ตัวอักษร hex)
    const randomBytes = crypto.randomBytes(12).toString('hex');
    return timestamp + randomBytes;
  }
  //ตรวจสอบความถูกต้องของ ID รูปแบบ ObjectId-like
  static isValidObjectIdLike(id: string): boolean {
    // ตรวจสอบว่าเป็น string 32 ตัวอักษรและเป็น hex ทั้งหมด
    return /^[0-9a-f]{32}$/i.test(id);
  }
  //ดึง timestamp จาก ID
  static getTimestampFromId(id: string): Date | null {
    if (!this.isValidObjectIdLike(id)) {
      return null;
    }
    // แปลง 8 ตัวอักษรแรกเป็น timestamp
    const timestamp = parseInt(id.substring(0, 8), 16);
    return new Date(timestamp * 1000);
  }
}
