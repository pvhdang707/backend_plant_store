import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Lấy object Request từ ExecutionContext của NestJS
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // do JwtStrategy trả về 

    // Nếu lúc gọi Decorator có truyền vào tham số (ví dụ: @GetUser('email')), 
    // thì chỉ trả về đúng email. Nếu không truyền gì, trả về toàn bộ object user.
    return data ? user?.[data] : user;
  },
);