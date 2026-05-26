export const appRoutes = {
  home: "/",

  marketing: {
    howItWorks: "/how-it-works",
    goldBook: "/gold-book",
    keepsakes: "/keepsakes",
    pricing: "/pricing",
    stories: "/stories",
    forPlanners: "/for-planners",
    sample: "/sample",
    changelog: "/changelog",
    about: "/about",
    careers: "/careers",
    sustainability: "/sustainability",
    pressKit: "/press-kit",
    contact: "/contact",
  },

  legal: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
    cookies: "/legal/cookies",
    gdpr: "/legal/gdpr",
    dpaForPlanners: "/legal/dpa-for-planners",
  },

  auth: {
    signIn: "/sign-in",
    signInVerify: "/sign-in/verify",
    signInWelcome: "/sign-in/welcome",
    signUp: "/sign-up",
    role: "/role",
    verify: "/verify",
    plans: "/plans",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },

  create: {
    root: "/create",
    cover: "/create/cover",
    done: "/create/done",
  },

  app: {
    root: "/home",
    settings: "/settings",
    keepsakes: "/keepsakes",
    cart: "/cart",
    orders: "/orders",
    qrCode: "/qr-code",
    qrCodeOrder: "/qr-code/order",
    plans: "/plans",
    messages: "/messages",
    message: (messageId: string) => `/messages/${messageId}`,
    photos: "/photos",
    guests: "/guests",
    kiosk: "/kiosk",
    link: "/link",
    help: "/help",
    account: "/account",
    events: "/events",
    event: (id: string) => `/events/${id}`,
    eventMessages: (id: string) => `/events/${id}/messages`,
    eventGuests: (id: string) => `/events/${id}/guests`,
    eventPhotos: (id: string) => `/events/${id}/photos`,
    eventKeepsakes: (id: string) => `/events/${id}/keepsakes`,
    eventKeepsakeCustomizer: (id: string, slug: string) =>
      `/events/${id}/keepsakes/${slug}`,
    eventOrders: (id: string) => `/events/${id}/orders`,
    eventQrCode: (id: string) => `/events/${id}/qr-code`,
    eventKiosk: (id: string) => `/events/${id}/kiosk`,
    eventLink: (id: string) => `/events/${id}/link`,
  },

  settings: {
    root: "/settings",
    profile: "/settings/profile",
    notifications: "/settings/notifications",
    privacy: "/settings/privacy",
    data: "/settings/data",
    danger: "/settings/danger",
    link: "/settings/link",
    branding: "/settings/branding",
    access: "/settings/access",
    billing: "/settings/billing",
  },

  guest: {
    base: (slug: string) => `/g/${slug}`,
    record: (slug: string) => `/g/${slug}/record`,
    compose: (slug: string) => `/g/${slug}/compose`,
    review: (slug: string) => `/g/${slug}/review`,
    thankYou: (slug: string) => `/g/${slug}/thank-you`,
  },

  kiosk: {
    page: (slug: string) => `/kiosk/${slug}`,
  },

  checkout: {
    root: "/checkout",
    success: "/checkout/success",
    orderSuccess: (orderId: string) => `/checkout/${orderId}/success`,
    cancel: (orderId: string) => `/checkout/${orderId}/cancel`,
  },
} as const;
