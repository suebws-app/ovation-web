"use client";

import { Button } from "@ovation/ui/components/Button";
import { Badge } from "@ovation/ui/components/Badge";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { SettingsToggle } from "./SettingsToggle";
import { SettingsRadio } from "./SettingsRadio";

export const SettingsPrivacySection = () => {
  return (
    <>
      <span className="type-overline text-primary">Settings</span>
      <h1 className="type-display mt-2 font-serif tracking-tight">
        Privacy &amp; <span className="text-primary italic">visibility</span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        Control who can see your book, who can leave messages, and who can see
        them. Defaults are private &mdash; change only what you want to open up.
      </p>

      <div className="mt-9">
        <SettingsSectionTitle title="Book visibility" />
        <SettingsCard>
          <SettingsRow
            title="Private"
            description="Only you, your partner, and invited guests can see anything."
          >
            <SettingsRadio on={true} />
          </SettingsRow>
          <SettingsRow
            title="Unlisted"
            description="Anyone with the link can view \u2014 but it won\u2019t appear in search."
          >
            <SettingsRadio on={false} />
          </SettingsRow>
          <SettingsRow
            title="Public"
            description="Discoverable in Ovation\u2019s gallery of wedding books (curated, opt-in)."
            last
          >
            <SettingsRadio on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title="Who can leave messages" />
        <SettingsCard>
          <SettingsRow
            title="Invited guests only"
            description="Only people who scanned a QR card you sent, or used your invite link."
          >
            <SettingsRadio on={true} />
          </SettingsRow>
          <SettingsRow
            title="Anyone with the link"
            description="Useful if you\u2019re sharing over WhatsApp or Instagram."
          >
            <SettingsRadio on={false} />
          </SettingsRow>
          <SettingsRow
            title="Require guest to sign in"
            description="Guests enter their email before leaving a message. Catches pranksters."
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title="Message review" />
        <SettingsCard>
          <SettingsRow
            title="Review before publishing"
            description="Every message waits in your queue until you approve it. Turn off for a more live feel."
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title="Auto-flag strong language"
            description={
              <>
                Uses on-device filtering.{" "}
                <button
                  type="button"
                  className="text-primary cursor-pointer font-semibold"
                >
                  See word list &rarr;
                </button>
              </>
            }
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title="Auto-publish from family"
            description="Messages from guests you tagged as \u2018family\u2019 skip the queue."
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle
          title="What guests see"
          description="Controls what a guest sees when they visit ovation.love/lena-and-tomas."
        />
        <SettingsCard>
          <SettingsRow
            title="Show total message count"
            description='A "142 messages from 88 guests" stat on the welcome screen.'
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title="Show other guests\u2019 messages"
            description="Lets guests browse what others left (after yours is recorded)."
          >
            <SettingsToggle on={false} />
          </SettingsRow>
          <SettingsRow
            title="Show who has & hasn\u2019t contributed"
            description="A read-only list. Only visible to co-owners by default."
            last
          >
            <SettingsToggle on={false} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title="Transcripts & AI" />
        <SettingsCard>
          <SettingsRow
            title="Transcribe every message"
            description="We use on-device speech recognition. Transcripts never leave your book."
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title="Let guests see their transcript"
            description="Guests can correct their own transcript before submitting."
          >
            <SettingsToggle on={true} />
          </SettingsRow>
          <SettingsRow
            title="Allow AI suggestions"
            description="Claude can propose thank-you notes and book layouts. Off means pure manual."
            last
          >
            <Badge variant="secondary">On-device only</Badge>
            <SettingsToggle on={true} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-10 flex justify-end gap-2.5">
        <Button variant="outline" className="rounded-full">
          Discard changes
        </Button>
        <Button className="rounded-full">Save changes</Button>
      </div>
    </>
  );
};
