import type { Prisma } from "@prisma/client";
import { commonService } from "../common/common.service";
import { prisma } from "../../utils/db.util";

class AuthService {
  findOneById(id: number) {
    return prisma.session.findUnique({ where: { userId: id } });
  }

  findOneByRefreshToken(refreshToken: string) {
    return prisma.session.findUnique({ where: { refreshToken } });
  }

  create(args: Prisma.SessionCreateArgs) {
    return prisma.session.create(args);
  }

  update(args: Prisma.SessionUpdateArgs) {
    return prisma.session.update(args);
  }

  async upsert(data: { userId: number; refreshToken: string }) {
    const session = await prisma.session.findUnique({
      where: { userId: data.userId },
    });

    if (!session) return this.create({ data });
    return this.update({
      data: { refreshToken: data.refreshToken },
      where: { userId: data.userId },
    });
  }
}

export const authService = commonService.getOrCreateSingleton(AuthService);
