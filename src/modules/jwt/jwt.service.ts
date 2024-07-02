import { ENV } from "../../utils/env.util";
import { commonService } from "../common/common.service";
import { JwtPayload, sign, verify } from "jsonwebtoken";

class JwtService {
  async signPayload(payload: any) {
    return sign(payload, ENV.ACCESS_SECRET, { expiresIn: ENV.ACCESS_EXP });
  }

  async verifyToken(token: string) {
    return verify(token, ENV.ACCESS_SECRET) as JwtPayload;
  }
}

export const jwtService = commonService.getOrCreateSingleton(JwtService);
