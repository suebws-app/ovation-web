"use client";

import { useState } from "react";
import { Button } from "@ovation/ui/components/Button";
import { Warning } from "@ovation/icons/Warning";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { DeleteBookModal } from "./DeleteBookModal";

export const SettingsDangerSection = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <span className="type-overline text-destructive">Settings</span>
      <h1 className="type-display mt-2 font-serif tracking-tight">
        Danger <span className="text-destructive italic">zone</span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        Changes here can&apos;t be undone. We&apos;ll ask you to confirm with
        your password and, for deletion, a typed confirmation.
      </p>

      <div className="mt-9">
        <SettingsSectionTitle title="Change owner" />
        <SettingsCard>
          <SettingsRow
            title="Transfer book ownership"
            description={
              <>
                Lena is the current owner. Transfer to{" "}
                <strong className="text-foreground">Tom&aacute;s</strong>, your
                co-owner. You&apos;ll keep edit access as a co-owner.
              </>
            }
          >
            <Button variant="outline" size="sm" className="rounded-full">
              Transfer to Tom&aacute;s
            </Button>
          </SettingsRow>
          <SettingsRow
            title="Leave this book"
            description="Step down as owner or co-owner. You\u2019ll lose access until re-invited."
            last
          >
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/40 text-destructive rounded-full"
            >
              Leave book
            </Button>
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle title="Archive or delete" />
        <div className="rounded-16 border-destructive/30 overflow-hidden border-2">
          <div
            className="type-overline text-destructive flex items-center gap-2.5 px-5 py-3"
            style={{
              background:
                "repeating-linear-gradient(135deg, var(--destructive) / 0.08 0 12px, var(--destructive) / 0.14 12px 24px)",
            }}
          >
            <Warning width={14} height={14} />
            These actions are final
          </div>
          <div className="bg-card px-7">
            <SettingsRow
              title="Archive the book"
              description="Guests can no longer leave messages and the URL goes offline. You can un-archive anytime."
            >
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive rounded-full"
              >
                Archive
              </Button>
            </SettingsRow>
            <SettingsRow
              title={
                <span className="text-destructive">
                  Delete book permanently
                </span>
              }
              description="All messages, photos, transcripts and the Gold Book draft will be erased after 30 days. We recommend exporting your data first."
              warn
              last
            >
              <Button
                variant="destructive"
                size="sm"
                className="rounded-full"
                onClick={() => setShowDeleteModal(true)}
              >
                <Warning width={13} height={13} />
                Delete book&hellip;
              </Button>
            </SettingsRow>
          </div>
        </div>
      </div>

      <div className="mt-9">
        <SettingsSectionTitle
          title="Your Ovation account"
          description="Deleting your account also deletes any books you solely own."
        />
        <SettingsCard>
          <SettingsRow
            title="Close my Ovation account"
            description="All your books, messages, billing history, and devices will be removed."
            warn
            last
          >
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/40 text-destructive rounded-full"
            >
              Close account
            </Button>
          </SettingsRow>
        </SettingsCard>
      </div>

      <p className="type-caption text-muted-foreground mt-6 max-w-lg font-serif italic">
        &ldquo;The best designs make destructive actions feel heavy on purpose.
        Take your time &mdash; nothing here is in a hurry.&rdquo;
      </p>

      {showDeleteModal && (
        <DeleteBookModal onClose={() => setShowDeleteModal(false)} />
      )}
    </>
  );
};
