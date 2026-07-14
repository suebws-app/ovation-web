export type AnalyticsEventMap = {
  landing_page_viewed: { section?: string };
  signup_started: { method?: string };
  signup_completed: { method?: string };
  onboarding_completed: { durationSeconds?: number };
  feature_used: { feature: string };
  invitation_sent: { channel?: string };
  content_created: { contentType: string; eventId?: string };
  checkout_started: { planTier: string; billingType?: string };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;
