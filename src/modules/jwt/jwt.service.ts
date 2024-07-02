import { ENV } from "../../utils/env.util";
import { commonService } from "../common/common.service";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { JWT_TYPE } from "./enum/jwt.enum";

class JwtService {
  async signPayload(payload: any, type: JWT_TYPE) {
    let secret = ENV.JWT_REFRESH_SECRET;
    let expiresIn = ENV.JWT_REFRESH_EXP;
    if (type === JWT_TYPE.ACCESS) {
      secret = ENV.JWT_ACCESS_SECRET;
      expiresIn = ENV.JWT_REFRESH_EXP;
    }
    return sign(payload, secret, { expiresIn });
  }

  async verifyToken(token: string, type: JWT_TYPE) {
    return verify(
      token,
      type === JWT_TYPE.ACCESS ? ENV.JWT_ACCESS_SECRET : ENV.JWT_REFRESH_SECRET
    ) as JwtPayload;
  }
}

export const jwtService = commonService.getOrCreateSingleton(JwtService);
