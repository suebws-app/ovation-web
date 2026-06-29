import { useQuery } from "@tanstack/react-query";
import { invitationTemplatesClient } from "@/lib/api/invitation-templates-client";
import type { InvitationTemplatesResponse } from "@/lib/api/types";
import { queryKeys } from "./keys";

const FIVE_MINUTES = 5 * 60 * 1000;

export const useInvitationTemplatesQuery = () =>
  useQuery<InvitationTemplatesResponse>({
    queryKey: queryKeys.invitationTemplates.list(),
    queryFn: invitationTemplatesClient.list,
    staleTime: FIVE_MINUTES,
    gcTime: FIVE_MINUTES,
  });
