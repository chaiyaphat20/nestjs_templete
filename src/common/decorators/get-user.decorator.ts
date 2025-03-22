import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//get ข้อมูล user จาก token เลย
export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!data) return request.user;
  return request.user[data];
});
