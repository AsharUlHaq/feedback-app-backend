import { HttpStatus } from "../../utils/http-status.util";

type IResponseArgs = {
  message?: string;
  status?: number;
  data?: any;
};

export class ResponseMapper {
  public static map(
    {
      data = null,
      message = HttpStatus.OK_MESSAGE,
      status = HttpStatus.OK,
    }: IResponseArgs = {
      data: null,
      status: HttpStatus.OK,
      message: HttpStatus.OK_MESSAGE,
    }
  ): { data: any; status: number; message: string; success: boolean } {
    return {
      data,
      message,
      status,
      success: status >= HttpStatus.OK && status < HttpStatus.MULTIPLE_CHOICES,
    };
  }
}
