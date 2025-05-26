import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  validate(payload: any) {
    // Validate the JWT payload
    // You can add additional validation logic here if needed
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    console.log("JWT payload:", payload);
    return payload.sub
  }
}