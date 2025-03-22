import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: string;

  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Unique email address' })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of user' })
  fullName: string | null;

  @Exclude()
  refreshToken: string | null;

  @ApiProperty({ example: '2025-03-22T05:10:59.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-03-22T05:10:59.000Z', description: 'Last update date' })
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
