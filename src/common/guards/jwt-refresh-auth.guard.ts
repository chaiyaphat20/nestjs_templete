import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//กำหนดว่าต้องส่ง refresh token มา และ check refresh token
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
