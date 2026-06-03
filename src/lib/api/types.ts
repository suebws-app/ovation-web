export const SUPPORTED_LANGUAGES = [
  "en",
  "fr",
  "nl",
  "de",
  "es",
  "it",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type EventStatus = "draft" | "active" | "paused" | "archived";

export type PlanTier = "premium" | "bundle" | "pro_starter" | "pro_studio";

export type AccountType = "couple" | "pro";

export type TranscriptStatus =
  | "pending"
  | "processing"
  | "done"
  | "failed"
  | "skipped";

export type SubmissionSource = "kiosk" | "qr_scan" | "direct_link";

export type MessageFilter =
  | "all"
  | "favorites"
  | "with_photo"
  | "with_video"
  | "audio_only";

export type MessageSort = "newest" | "oldest" | "longest";

export type EmailPreferences = {
  marketing: boolean;
  digest: boolean;
  alerts: boolean;
};

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  preferredLanguage: SupportedLanguage | string;
  role: string;
  accountType: AccountType;
  planTier: PlanTier | string | null;
  planPurchasedAt: string | null;
  messageLimit: number | null;
  storageExpiresAt: string | null;
  storageDays: number | null;
  storageGb: number | null;
  keepsakeCreditCents: number;
  stripeCustomerId: string | null;
  emailPreferences: EmailPreferences | null;
  primaryEventId: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type Event = {
  id: string;
  ownerUserId: string;
  slug: string;
  partnerAName: string;
  partnerBName: string;
  weddingDate: string | null;
  venueName: string | null;
  venueCity: string | null;
  expectedGuests: number | null;
  welcomeMessage: string | null;
  themeColor: string;
  couplePhotoUrl: string | null;
  status: EventStatus | string;
  defaultLanguage: SupportedLanguage | string;
  createdAt: string;
  updatedAt: string;
};

export type EventStats = {
  totalMessages: number;
  audioMessages: number;
  videoCount: number;
  photoCount: number;
  writtenMessages: number;
  favorites: number;
  unreadMessages: number;
};

export type MessageSummary = {
  id: string;
  guestNames: string;
  hasAudio: boolean;
  hasVideo: boolean;
  hasPhoto: boolean;
  mediaCount: number;
  audioDurationSec: number | null;
  transcriptSnippet: string | null;
  writtenNote: string | null;
  isFavorite: boolean;
  isGoldBookSelected: boolean;
  createdAt: string;
  photoThumbUrl: string | null;
};

export type MessageMediaItem = GalleryItem;

export type MessageDetail = {
  id: string;
  guestNames: string;
  audioUrl: string | null;
  audioDurationSec: number | null;
  audioMimeType: string | null;
  media: GalleryItem[];
  writtenNote: string | null;
  transcript: string | null;
  transcriptLanguage: string | null;
  transcriptStatus: TranscriptStatus | string;
  isFavorite: boolean;
  isGoldBookSelected: boolean;
  coupleNotes: string | null;
  audioTrimStartSec: number | null;
  audioTrimEndSec: number | null;
  submissionSource: SubmissionSource | string;
  createdAt: string;
};

export type CreateEventInput = {
  partnerAName: string;
  partnerBName: string;
  weddingDate?: string;
  venueName?: string;
  venueCity?: string;
  expectedGuests?: number;
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  welcomeMessage?: string;
  themeColor?: string;
  couplePhotoUrl?: string;
  defaultLanguage?: SupportedLanguage;
  slug?: string;
  kioskPin?: string;
  submissionsEnabled?: boolean;
};

export type ListEventsQuery = {
  status?: EventStatus;
  cursor?: string;
  limit?: number;
};

export type ListMessagesQuery = {
  filter?: MessageFilter;
  search?: string;
  sort?: MessageSort;
  cursor?: string;
  limit?: number;
  includeOwnerUploads?: boolean;
};

export type UpdateMessageInput = {
  isFavorite?: boolean;
  isGoldBookSelected?: boolean;
  coupleNotes?: string | null;
  audioTrimStartSec?: number | null;
  audioTrimEndSec?: number | null;
  audioDurationSec?: number | null;
};

export type UpdateProfileInput = {
  fullName?: string;
  avatarUrl?: string;
  preferredLanguage?: SupportedLanguage;
  emailPreferences?: EmailPreferences;
};

export type Paginated<T> = {
  data: T[];
  nextCursor: string | null;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  };
};

export type InvitationChannel =
  | "whatsapp"
  | "email"
  | "sms"
  | "link"
  | "qr_print"
  | "ig_story";

export type InvitationFunnel = {
  sent: number;
  opened: number;
  submitted: number;
};

export type InvitationStats = {
  byChannel: Partial<Record<InvitationChannel | string, InvitationFunnel>>;
  totals: InvitationFunnel;
};

export type PublicKioskSettings = {
  captureAudio: boolean;
  capturePhoto: boolean;
  captureVideo: boolean;
  maxVideoDurationSeconds: number;
  maxAudioDurationSeconds: number;
  returnAfterSeconds: number;
  welcomeShowPhoto: boolean;
  welcomeShowLanguagePicker: boolean;
  welcomeChime: boolean;
  fullscreenLock: boolean;
  guidedMode: boolean;
  exitPin: string | null;
};

export type PublicEvent = {
  partnerAName: string;
  partnerBName: string;
  weddingDate: string | null;
  welcomeMessage: string | null;
  themeColor: string;
  couplePhotoUrl: string | null;
  defaultLanguage: string;
  supportedLanguages: string[];
  submissionOpen: boolean;
  limitReached: boolean;
  kiosk: PublicKioskSettings;
};

export type AudioUploadTarget = {
  kind: "audio";
  key: string;
  url: string;
  headers?: Record<string, string>;
  maxSizeBytes: number;
  expiresAt: string;
};

export type MediaUploadTarget = {
  mediaId: string;
  type: "photo" | "video";
  key: string;
  url: string;
  headers?: Record<string, string>;
  maxSizeBytes: number;
  expiresAt: string;
};

export type UploadUrlsResult = {
  audioTargets: AudioUploadTarget[];
  mediaTargets: MediaUploadTarget[];
};

export type GalleryItem = {
  id: string;
  type: "photo" | "video";
  uploaderType: "guest" | "owner";
  uploaderName: string | null;
  messageId: string | null;
  url: string | null;
  thumbUrl: string | null;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  isFavorite: boolean;
  isGoldBookSelected: boolean;
  createdAt: string;
};

export type GalleryFeed = {
  data: GalleryItem[];
  nextCursor: string | null;
};

export type CreateMessageResult = {
  message: {
    id: string;
    status: string;
  };
};

export type KeepsakeSku =
  | "gold_book"
  | "video_montage"
  | "digital_album"
  | "audio_vinyl"
  | "thank_you_cards"
  | "canvas_print"
  | string;

export type KeepsakeProduct = {
  sku: KeepsakeSku;
  name: string;
  description: string;
  subtitle: string | null;
  priceCents: number;
  currency: string;
  imageUrl?: string | null;
  timelineDays?: string | null;
};

export type KeepsakeCatalog = {
  products: KeepsakeProduct[];
};

export type KeepsakeProductDetail = {
  id: string;
  sku: string;
  slug: string;
  productType: string;
  name: string;
  description: string | null;
  subtitle: string | null;
  basePriceCents: number;
  currency: string;
  category: string;
  heroImageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  leadTimeMinDays: number | null;
  leadTimeMaxDays: number | null;
};

export type KeepsakeProductVariant = {
  id: string;
  sku: string;
  name: string;
  priceCents: number | null;
  currency: string;
  attributes: Record<string, unknown>;
  isActive: boolean;
  sortOrder: number;
};

export type KeepsakeCustomizationSchema = {
  productType: string;
  schemaJson: Record<string, unknown>;
  version: number;
};

export type KeepsakeProductDetailResult = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  customizationSchema: KeepsakeCustomizationSchema | null;
};

export type JobStatusValue =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | string;

export type Job = {
  id: string;
  status: JobStatusValue;
  progress: number | null;
  result: unknown;
  error: string | null;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled"
  | "in_production"
  | "shipped"
  | "delivered"
  | string;

export type Order = {
  id: string;
  eventId: string;
  userId: string;
  orderType: string;
  status: OrderStatus;
  currency: string;
  subtotalCents: number;
  totalCents: number;
  productSku: string;
  productName: string;
  variantSku: string | null;
  variantName: string | null;
  quantity: number;
  unitPriceCents: number;
  customization: Record<string, unknown>;
  fulfillmentStatus: string;
  paymentProvider: string | null;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  mediaId: string;
};

export type OrderTracking = {
  carrier: string | null;
  number: string | null;
  url: string | null;
};

export type OrderDetail = {
  id: string;
  orderType: string;
  status: OrderStatus;
  totalCents: number;
  productSku: string;
  productName: string;
  variantSku: string | null;
  variantName: string | null;
  quantity: number;
  unitPriceCents: number;
  customization: Record<string, unknown>;
  fulfillmentStatus: string;
  mediaIds: string[];
  tracking: OrderTracking | null;
  createdAt: string;
};

export type OrderSession = {
  orders: OrderDetail[];
  totalCents: number;
};

export type QrCodeFormat = "png" | "svg";

export type QrCodeResult = {
  qrData: string;
  shortUrl: string;
  format: QrCodeFormat;
};

export type CheckoutOrderType = "plan" | "keepsake";

export type CheckoutPlanTier = "premium" | "bundle";

export type CheckoutItem = {
  productSku: string;
  productVariantId?: string;
  quantity: number;
  customization?: Record<string, unknown>;
  photoIds?: string[];
};

export type CheckoutShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  country: string;
  postalCode: string;
};

export type CheckoutSessionInput = {
  eventId?: string;
  orderType: CheckoutOrderType;
  planTier?: CheckoutPlanTier;
  items?: CheckoutItem[] | null;
  shippingAddress?: CheckoutShippingAddress;
  promoCode?: string;
  successUrl: string;
  cancelUrl: string;
};

export type CartTotalsItem = {
  productSku: string;
  productVariantId?: string;
  quantity: number;
};

export type CartTotalsInput = {
  eventId: string;
  items: CartTotalsItem[];
  shippingCountry?: string;
  promoCode?: string;
};

export type CartTotalsResult = {
  currency: string;
  subtotalCents: number;
  promoDiscountCents?: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  vatRate: number;
  freeShipping: boolean;
};

export type CheckoutSessionResult = {
  orderId: string;
  checkoutUrl: string;
  providerSessionId: string;
};

export type Plan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  messageLimit: number | null;
  storageDays: number | null;
  creditCents: number;
  sortOrder: number;
};


export type BasePlanInfo = {
  planCode: string;
  planName: string;
  activatedAt: string;
  expiresAt: string | null;
};

export type DreState =
  | "none"
  | "pending"
  | "active"
  | "cancellation_scheduled"
  | "expired";

export type DreInfo = {
  state: DreState;
  intentCreatedAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  paddleSubscriptionId: string | null;
};

export type MeBillingOverview = {
  basePlan: BasePlanInfo | null;
  dre: DreInfo | null;
};

export type MeBillingHistoryItem = {
  id: string;
  planCode: string;
  planName: string | null;
  totalCents: number;
  currency: string;
  status: string;
  paymentCompletedAt: string | null;
  refundedAt: string | null;
  refundAmountCents: number | null;
  createdAt: string;
};

export type DreCheckoutSessionInput = {
  successUrl: string;
  cancelUrl: string;
};

export type DreCheckoutSessionResult = {
  checkoutUrl: string;
  providerSessionId: string;
};

export type ProCheckoutSessionInput = {
  planCode: "pro_starter" | "pro_studio";
  eventId?: string;
  successUrl: string;
  cancelUrl: string;
};

export type ProCheckoutSessionResult = {
  orderId: string;
  checkoutUrl: string;
  providerSessionId: string;
};

export type BillingPortalSessionInput = {
  returnUrl?: string;
};

export type BillingPortalSessionResult = {
  url: string;
};

export type CoverPhotoContentType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/heic";

export type CoverUploadResult = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  maxSizeBytes: number;
};

export const LINK_MAX_DURATION_OPTIONS = [15, 30, 45, 60] as const;
export type LinkMaxDurationSeconds =
  (typeof LINK_MAX_DURATION_OPTIONS)[number];

export const KIOSK_RETURN_AFTER_OPTIONS = [10, 20, 30, 60, 120] as const;
export type KioskReturnAfterSeconds =
  (typeof KIOSK_RETURN_AFTER_OPTIONS)[number];

export const KIOSK_WELCOME_NOTE_MAX = 180;

export type LinkSettings = {
  id: string;
  eventId: string;
  captureAudio: boolean;
  capturePhoto: boolean;
  captureVideo: boolean;
  maxVideoDurationSeconds: number;
  maxAudioDurationSeconds: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateLinkSettingsInput = Partial<
  Omit<LinkSettings, "id" | "eventId" | "createdAt" | "updatedAt">
>;

export type KioskSettings = {
  id: string;
  eventId: string;
  returnAfterSeconds: number;
  fullscreenLock: boolean;
  guidedMode: boolean;
  exitPin: string | null;
  airplaneMode: boolean;
  welcomeNote: string | null;
  welcomeShowPhoto: boolean;
  welcomeShowLanguagePicker: boolean;
  welcomeChime: boolean;
  defaultLanguage: SupportedLanguage | string;
  supportedLanguages: (SupportedLanguage | string)[];
  createdAt: string;
  updatedAt: string;
};

export type UpdateKioskSettingsInput = Partial<
  Omit<KioskSettings, "id" | "eventId" | "createdAt" | "updatedAt">
>;
