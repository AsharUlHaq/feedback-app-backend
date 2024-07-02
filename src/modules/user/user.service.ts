import type { Prisma } from "@prisma/client";
import { prisma } from "../../utils/db.util";
import { commonService } from "../common/common.service";

class UserService {
  async findOneById(id: number, select?: Prisma.UserSelect) {
    return prisma.user.findUnique({ where: { id }, select });
  }

  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return prisma.user.findUnique(args);
  }

  async findMany(args: Prisma.UserFindManyArgs) {
    return prisma.user.findMany(args);
  }

  async create(args: Prisma.UserCreateArgs) {
    return prisma.user.create(args);
  }

  async update(args: Prisma.UserUpdateArgs) {
    return prisma.user.update(args);
  }
}

export const userService = commonService.getOrCreateSingleton(UserService);
