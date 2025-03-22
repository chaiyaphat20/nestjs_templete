import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe_updated', description: 'Updated username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'john_updated@example.com',
    description: 'Updated email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Updated password with minimum 6 characters',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John Doe Updated', description: 'Updated full name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}
