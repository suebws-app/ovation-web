export type CompetitorFeatureValue = boolean | string;

export type CompetitorFeature = {
  labelKey: string;
  ovation: CompetitorFeatureValue;
  competitor: CompetitorFeatureValue;
};

export type Competitor = {
  slug: string;
  name: string;
  bulletCounts: {
    strengths: number;
    gaps: number;
    ovationWins: number;
  };
  features: CompetitorFeature[];
  homepageUrl?: string;
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "traditional-guest-book",
    name: "Traditional paper guest book",
    bulletCounts: { strengths: 3, gaps: 4, ovationWins: 3 },
    features: [
      {
        labelKey: "marketing__vs__feature__voice_messages",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__photo_video_capture",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__auto_transcription",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__printed_keepsake",
        ovation: true,
        competitor: "marketing__vs__value__na",
      },
      {
        labelKey: "marketing__vs__feature__multi_language_guests",
        ovation: true,
        competitor: "marketing__vs__value__guest_writes",
      },
      {
        labelKey: "marketing__vs__feature__any_phone",
        ovation: true,
        competitor: false,
      },
    ],
  },
  {
    slug: "video-guest-book-apps",
    name: "Generic video guest book apps",
    bulletCounts: { strengths: 2, gaps: 4, ovationWins: 3 },
    features: [
      {
        labelKey: "marketing__vs__feature__voice_messages",
        ovation: true,
        competitor: "marketing__vs__value__video_only",
      },
      {
        labelKey: "marketing__vs__feature__written_notes",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__zero_app_download",
        ovation: true,
        competitor: "marketing__vs__value__often_required",
      },
      {
        labelKey: "marketing__vs__feature__printed_keepsake",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__multi_language_transcripts",
        ovation: true,
        competitor: "marketing__vs__value__rarely",
      },
    ],
  },
  {
    slug: "wedshoots",
    name: "WedShoots",
    bulletCounts: { strengths: 2, gaps: 3, ovationWins: 2 },
    features: [
      {
        labelKey: "marketing__vs__feature__photo_capture",
        ovation: true,
        competitor: true,
      },
      {
        labelKey: "marketing__vs__feature__voice_messages",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__written_notes",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__auto_transcription",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__printed_keepsake",
        ovation: true,
        competitor: "marketing__vs__value__photo_book_only",
      },
    ],
  },
  {
    slug: "guestpix",
    name: "Guestpix",
    bulletCounts: { strengths: 2, gaps: 3, ovationWins: 2 },
    features: [
      {
        labelKey: "marketing__vs__feature__photo_capture",
        ovation: true,
        competitor: true,
      },
      {
        labelKey: "marketing__vs__feature__voice_messages",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__written_notes",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__printed_book_output",
        ovation: true,
        competitor: false,
      },
    ],
  },
  {
    slug: "zola",
    name: "Zola",
    bulletCounts: { strengths: 2, gaps: 3, ovationWins: 3 },
    features: [
      {
        labelKey: "marketing__vs__feature__guest_voice_messages",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__guest_video_messages",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__auto_transcription",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__printed_keepsake",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__standalone_or_paired",
        ovation: true,
        competitor: "marketing__vs__value__zola_only",
      },
    ],
  },
  {
    slug: "the-knot",
    name: "The Knot",
    bulletCounts: { strengths: 3, gaps: 3, ovationWins: 2 },
    features: [
      {
        labelKey: "marketing__vs__feature__voice_messages",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__auto_transcription",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__printed_keepsake",
        ovation: true,
        competitor: false,
      },
      {
        labelKey: "marketing__vs__feature__pairs_with_any_website",
        ovation: true,
        competitor: false,
      },
    ],
  },
];

export const findCompetitor = (slug: string): Competitor | undefined =>
  COMPETITORS.find((c) => c.slug === slug);
