import { forwardAuthRequest } from "../_helpers";

export const POST = (request: Request) =>
  forwardAuthRequest("/verify-email", request);
