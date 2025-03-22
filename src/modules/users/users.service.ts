import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, email, password, fullName } = createUserDto;

    // ตรวจสอบว่า username หรือ email ถูกใช้ไปแล้วหรือไม่
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await this.hashPassword(password);

    // สร้างผู้ใช้ใหม่
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
      },
    });

    return new UserEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => new UserEntity(user));
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserEntity(user);
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return new UserEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return new UserEntity(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
    await this.findOne(id);

    const data: any = { ...updateUserDto };

    // ถ้ามีการอัพเดทรหัสผ่าน ให้เข้ารหัสก่อน
    if (updateUserDto.password) {
      data.password = await this.hashPassword(updateUserDto.password);
    }

    // อัพเดทผู้ใช้
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return new UserEntity(updatedUser);
  }

  async remove(id: string): Promise<{ message: string }> {
    // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
    await this.findOne(id);

    // ลบผู้ใช้
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} successfully deleted` };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
