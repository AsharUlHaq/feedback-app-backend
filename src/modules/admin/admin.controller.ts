import { Handler } from "express";
import { commonService } from "../common/common.service";
import { LoggerService } from "../../utils/logger.util";
import { userService } from "../user/user.service";
import { NotFoundException } from "../../utils/exception.util";
import { AdminTypes } from "./admin.schema";
import { ResponseMapper } from "../../common/mapper/response.mapper";

class AdminController {
  private readonly logger = LoggerService(AdminController.name);

  userStatusToggleHandler: Handler = async (req, res, next) => {
    try {
      const body = req.body as AdminTypes.ToggleUserStatus;
      const user = await userService.findOneById(body.id);
      if (!user) throw new NotFoundException("User not found");

      await userService.update({
        data: { isActive: !user.isActive },
        where: { id: body.id },
      });

      return ResponseMapper.map({ res });
    } catch (error: any) {
      this.logger.error(error.message);
      next(error);
    }
  };
}

export const adminController =
  commonService.getOrCreateSingleton(AdminController);
