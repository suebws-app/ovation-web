"use client";

import { Button } from "@ovation/ui/components/Button";
import { Avatar } from "@ovation/ui/components/Avatar";
import { Badge } from "@ovation/ui/components/Badge";
import { Camera } from "@ovation/icons/Camera";
import { Calendar } from "@ovation/icons/Calendar";
import { MapPin } from "@ovation/icons/MapPin";
import { ChevronDown } from "@ovation/icons/ChevronDown";
import { Plus } from "@ovation/icons/Plus";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { SettingsField } from "./SettingsField";
import { SettingsToggle } from "./SettingsToggle";
import { VerifiedDot } from "./VerifiedDot";
import { PartnerCard } from "./PartnerCard";
import { SettingsLanguageChip } from "./SettingsLanguageChip";

export const SettingsProfileSection = () => {
  return (
    <>
      <span className="type-overline text-primary">Settings</span>
      <h1 className="mt-2 font-serif type-display tracking-tight">
        Your <span className="italic text-primary">profile</span>
      </h1>
      <p className="mt-2.5 max-w-xl type-body text-muted-foreground">
        The couple behind the book. This is what guests see on the welcome
        screen and in any thank-you notes you send through Ovation.
      </p>

      <div className="mt-9">
        <SettingsSectionTitle
          title="The couple"
          description="Both partners can sign in and edit. Tap a card to change name, avatar, or role."
        />
        <div className="grid grid-cols-[1fr_44px_1fr] items-stretch">
          <PartnerCard
            initials="L"
            tint="#EFC9A8"
            name="Lena Alvarez"
            role="Bride \u00b7 owner"
            email="lena.alvarez@gmail.com"
            badgeLabel="You"
            badgeVariant="default"
          />
          <div className="flex items-center justify-center">
            <span className="font-serif text-4xl italic text-primary">
              &amp;
            </span>
          </div>
          <PartnerCard
            initials="T"
            tint="#779FEB"
            name="Tom\u00e1s Ribeiro"
            role="Groom \u00b7 owner"
            email="tomas.ribeiro@hey.com"
            badgeLabel="Co-owner"
            badgeVariant="destructive"
          />
        </div>
      </div>

      <div className="mt-11">
        <SettingsSectionTitle
          title="Your account"
          description="Just the fields that belong to you, Lena. Tom\u00e1s edits his own from his sign-in."
        />
        <SettingsCard>
          <div className="border-b border-border py-5.5">
            <div className="grid grid-cols-2 gap-6">
              <SettingsField label="First name" value="Lena" />
              <SettingsField label="Last name" value="Alvarez" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-6">
              <SettingsField
                label="Display name"
                value="Lena"
                hint="Used on the welcome screen and in thank-you notes."
              />
              <SettingsField label="Pronouns" value="she / her" />
            </div>
          </div>
          <SettingsRow
            title="Email"
            description="lena.alvarez@gmail.com \u00b7 used to sign in and for your monthly digest."
          >
            <VerifiedDot ok />
            <Button variant="outline" size="sm" className="rounded-full">
              Change
            </Button>
          </SettingsRow>
          <SettingsRow
            title="Phone"
            description="+34 644 812 039 \u00b7 we only text you for two-factor sign-in."
          >
            <VerifiedDot ok />
            <Button variant="outline" size="sm" className="rounded-full">
              Change
            </Button>
          </SettingsRow>
          <SettingsRow
            title="Password"
            description="Last changed 14 September 2025 \u00b7 9 months ago."
          >
            <Button variant="outline" size="sm" className="rounded-full">
              Update password
            </Button>
          </SettingsRow>
          <SettingsRow
            title="Two-factor authentication"
            description="Text message to the phone number above."
            last
          >
            <Badge variant="secondary">On</Badge>
            <SettingsToggle on={true} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-11">
        <SettingsSectionTitle
          title="Wedding details"
          description="Shown on your book\u2019s welcome screen and used to pace reminders."
        />
        <SettingsCard>
          <div className="border-b border-border py-5.5">
            <div className="grid grid-cols-[1.2fr_1fr] gap-6">
              <SettingsField label="Couple names, as shown">
                <div className="flex items-center gap-2.5 rounded-12 border border-border bg-card px-3.5 py-3 type-body-small">
                  <span>Lena</span>
                  <span className="font-serif italic text-primary">
                    &amp;
                  </span>
                  <span>Tom&aacute;s</span>
                  <span className="ml-auto type-caption text-muted-foreground">
                    Preview:{" "}
                    <strong className="text-foreground">
                      Lena &amp; Tom&aacute;s
                    </strong>
                  </span>
                </div>
              </SettingsField>
              <SettingsField
                label="Wedding date"
                value="14 June 2026"
                adornmentRight={
                  <Calendar
                    width={16}
                    height={16}
                    className="text-muted-foreground"
                  />
                }
                hint="47 days away \u00b7 we\u2019ll open messages 90 days before."
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-6">
              <SettingsField
                label="Location"
                value="Cascais, Portugal"
                adornmentRight={
                  <MapPin
                    width={16}
                    height={16}
                    className="text-muted-foreground"
                  />
                }
              />
              <SettingsField
                label="Time zone"
                value="Europe / Lisbon \u2014 UTC+1"
                hint="Reminders are scheduled in this zone."
              />
            </div>
          </div>
          <SettingsRow
            title="Book language"
            description="Main language for your book. Guests can switch on their end \u2014 we detect their browser."
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 type-body-small">
              <span className="type-body-small">{"\ud83c\uddf5\ud83c\uddf9"}</span>
              Portuguese
              <ChevronDown
                width={12}
                height={12}
                className="text-muted-foreground"
              />
            </span>
          </SettingsRow>
          <SettingsRow
            title="Also accept messages in"
            description="Guests who speak these get their own welcome copy. We auto-translate for you."
            last
          >
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <SettingsLanguageChip flag="\ud83c\uddec\ud83c\udde7" label="English" />
              <SettingsLanguageChip flag="\ud83c\uddea\ud83c\uddf8" label="Spanish" />
              <SettingsLanguageChip flag="\ud83c\uddeb\ud83c\uddf7" label="French" />
              <button
                type="button"
                className="cursor-pointer rounded-full border border-dashed border-border px-3 py-1.5 type-caption font-semibold text-muted-foreground"
              >
                + Add
              </button>
            </div>
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-11">
        <SettingsSectionTitle
          title="How you appear to guests"
          description="Shown right under \u2018You\u2019re at the wedding of\u2026\u2019 on every guest\u2019s screen."
        />
        <SettingsCard>
          <div className="py-5.5">
            <SettingsField
              label="Welcome note"
              hint="Max 180 characters \u00b7 shown below your names on the welcome screen."
            >
              <div className="min-h-22 rounded-12 border border-border bg-card p-4 type-body-small leading-relaxed">
                <span className="font-serif italic text-primary">
                  Hola! Bienvenue.
                </span>{" "}
                Thanks for being part of this. Leave us a message &mdash; a
                story, a song, a recipe, a bad dance move. We&apos;ll cherish
                it.
                <span className="float-right type-caption text-muted-foreground">
                  148 / 180
                </span>
              </div>
            </SettingsField>
          </div>
          <SettingsRow
            title="Your public link"
            description="Share this, print it on a card, or put it in your invitation."
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-2 pl-3.5 pr-1.5 type-body-small">
              <span className="text-muted-foreground">ovation.love/</span>
              <span className="font-semibold">lena-and-tomas</span>
              <button
                type="button"
                className="cursor-pointer rounded-full bg-primary/15 px-2.5 py-1 type-caption font-bold text-primary"
              >
                Copy
              </button>
            </div>
          </SettingsRow>
          <SettingsRow
            title="Show our photo on the welcome screen"
            description="A portrait of the two of you, above the welcome note."
            last
          >
            <SettingsToggle on={true} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-11">
        <SettingsSectionTitle title="Connected accounts" />
        <SettingsCard>
          <ConnectedAccountRow
            letter="G"
            color="#EA4335"
            name="Google"
            description="Sign-in \u00b7 calendar reminders"
            connected
          />
          <ConnectedAccountRow
            letter="\uf8ff"
            color="#111"
            name="Apple"
            description="Sign-in only"
            connected
            fontFamily="system-ui"
          />
          <ConnectedAccountRow
            letter="\u25c7"
            color="#C13584"
            name="Instagram"
            description="Import wedding photos to Keepsakes"
            connected={false}
            last
          />
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

type ConnectedAccountRowProps = {
  letter: string;
  color: string;
  name: string;
  description: string;
  connected: boolean;
  fontFamily?: string;
  last?: boolean;
};

const ConnectedAccountRow = ({
  letter,
  color,
  name,
  description,
  connected,
  fontFamily,
  last,
}: ConnectedAccountRowProps) => (
  <SettingsRow
    title={
      <span className="inline-flex items-center gap-3">
        <span
          className="flex size-7 items-center justify-center rounded-8 type-caption font-bold text-primary-foreground"
          style={{ background: color, fontFamily }}
        >
          {letter}
        </span>
        {name}
      </span>
    }
    description={description}
    last={last}
  >
    {connected ? (
      <>
        <VerifiedDot ok />
        <Button variant="outline" size="sm" className="rounded-full">
          Disconnect
        </Button>
      </>
    ) : (
      <Button size="sm" className="rounded-full">
        Connect
      </Button>
    )}
  </SettingsRow>
);
