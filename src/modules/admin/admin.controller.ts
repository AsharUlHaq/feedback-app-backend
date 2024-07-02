import type { Request } from "express";
import type { AdminTypes } from "./admin.schema";
import { commonService } from "../common/common.service";
import { LoggerService } from "../../utils/logger.util";
import { userService } from "../user/user.service";
import {
  ForbiddenException,
  NotFoundException,
} from "../../utils/exception.util";
import { ResponseMapper } from "../../common/mapper/response.mapper";
import { $Enums } from "@prisma/client";

class AdminController {
  private readonly logger = LoggerService(AdminController.name);

  async userStatusToggleHandler(req: Request) {
    try {
      const body = req.body as AdminTypes.ToggleUserStatus;
      const user = await userService.findOneById(body.id);
      if (!user) throw new NotFoundException("User not found");
      if (user.role === $Enums.UserRole.ADMIN)
        throw new ForbiddenException("Cannot change status of admin");

      await userService.update({
        data: { isActive: !user.isActive },
        where: { id: body.id },
      });

      return ResponseMapper.map();
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }
}

export const adminController =
  commonService.getOrCreateSingleton(AdminController);
