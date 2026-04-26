import { forwardAuthRequest } from "../../_helpers";

export const POST = (request: Request) =>
  forwardAuthRequest("/oauth/callback", request);
