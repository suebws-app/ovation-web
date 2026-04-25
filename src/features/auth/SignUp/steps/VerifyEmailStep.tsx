"use client";

import { Button } from "@ovation/ui/components/Button";
import { OtpInput } from "@ovation/ui/components/OtpInput";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Mail } from "@ovation/icons/Mail";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";

export const VerifyEmailStep = () => {
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-89px)] items-center justify-center bg-[radial-gradient(800px_500px_at_50%_0%,_oklch(0.705_0.120_262.5/0.12),_transparent_60%),radial-gradient(600px_400px_at_80%_100%,_oklch(0.723_0.135_40/0.08),_transparent_60%)]">
      <div className="w-full max-w-[520px] text-center">
        <MailIcon />

        <Eyebrow className="text-primary">Step 2 &middot; Verify email</Eyebrow>
        <h1 className="mt-3 font-serif text-[2.75rem] leading-tight font-semibold tracking-tight">
          Check your inbox.
        </h1>
        <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-[420px] leading-relaxed">
          We sent a 6-digit code to{" "}
          <strong className="text-foreground">
            {formData.email || "your email"}
          </strong>
          . It expires in <strong className="text-destructive">9:42</strong>.
        </p>

        <OtpInput
          value={formData.otpCode}
          onChange={(value) => updateFormData({ otpCode: value })}
          className="mt-10"
        />

        <div className="type-body-small text-muted-foreground mt-6.5 flex items-center justify-center gap-3.5">
          Didn&apos;t get it?{" "}
          <button
            type="button"
            className="text-primary cursor-pointer font-semibold"
          >
            Send again
          </button>
          <span className="opacity-30">&middot;</span>
          <button
            type="button"
            className="text-primary cursor-pointer font-semibold"
          >
            Change email
          </button>
        </div>

        <div className="mt-9 inline-block">
          <Button
            onClick={() => router.push("/sign-up/step/3")}
            disabled={formData.otpCode.length < 6}
            size="lg"
            className="shadow-primary/40 rounded-full px-10 shadow-md"
          >
            Verify &amp; continue
            <ArrowRight width={16} height={16} />
          </Button>
        </div>

        <p className="type-caption text-muted-foreground mt-11 font-serif italic">
          Tip: check spam if it&apos;s been a minute.
        </p>
      </div>
    </div>
  );
};

const MailIcon = () => (
  <div className="rounded-20 bg-primary/10 mb-6 inline-flex size-18 items-center justify-center">
    <Mail width={30} height={30} className="text-primary" strokeWidth={1.75} />
  </div>
);
