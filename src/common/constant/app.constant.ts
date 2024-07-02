import { ENV } from "../../utils/env.util";

export const APP_CONSTANT = {
  BOOTSTRAP_MESSAGE: `Application running at http://localhost:${ENV.PORT}`,
  PORT: ENV.PORT,
};
