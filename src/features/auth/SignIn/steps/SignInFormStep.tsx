"use client";

import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { Separator } from "@ovation/ui/components/Separator";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Logo } from "@ovation/ui/components/Logo";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { SocialAuthButtons } from "../../components/SocialAuthButtons";
import { VoiceMessagePreview } from "../components/VoiceMessagePreview";
import { useSignInStore } from "../useSignInStore";
import { Link, useRouter } from "@/i18n/navigation";

export const SignInFormStep = () => {
  const { formData, updateFormData } = useSignInStore();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in/verify");
  };

  return (
    <div className="desktop:grid-cols-2 grid min-h-screen">
      <div className="tablet:px-20 flex flex-col items-center px-6 py-12">
        <Logo className="self-start" />

        <div
          className="flex w-full flex-1 flex-col justify-center"
          style={{ maxWidth: 440 }}
        >
          <Eyebrow className="text-primary mb-2.5">Welcome back</Eyebrow>
          <h1 className="font-serif text-[3.25rem] leading-[1.05] font-semibold tracking-tight">
            Sign in to your
            <br />
            <span className="text-primary italic">wedding book.</span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3.5 leading-relaxed">
            12 new voice messages from your guests are waiting for you.
          </p>

          <SocialAuthButtons action="sign-in" className="mt-9" />

          <Separator label="or with email" className="my-6" />

          <div className="space-y-4.5">
            <div>
              <Label htmlFor="signin-email" className="mb-2">
                Email
              </Label>
              <Input
                id="signin-email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="signin-password" className="mb-2">
                Password
              </Label>
              <Input
                id="signin-password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Checkbox
              checked={formData.keepSignedIn}
              onChange={(checked) => updateFormData({ keepSignedIn: checked })}
              label="Keep me signed in"
            />
            <Link
              href="/forgot-password"
              className="type-body-small text-primary font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            onClick={handleSignIn}
            disabled={!formData.email || !formData.password}
            size="lg"
            className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
          >
            Sign in
            <ArrowRight width={16} height={16} />
          </Button>

          <p className="type-body-small text-muted-foreground mt-4.5 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-foreground font-semibold">
              Start your wedding book &rarr;
            </Link>
          </p>
        </div>

        <p className="type-caption text-muted-foreground/60 self-start">
          Protected by 2-factor. Your messages never leave your couple account.
        </p>
      </div>

      <BrandPanel />
    </div>
  );
};

const BrandPanel = () => (
  <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:flex-col desktop:justify-between relative hidden overflow-hidden bg-gradient-to-br p-14">
    <div
      className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full"
      style={{
        background:
          "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
      }}
    />
    <div
      className="pointer-events-none absolute -bottom-15 -left-10 size-65 rounded-full"
      style={{
        background:
          "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
      }}
    />

    <Eyebrow className="relative tracking-[2.5px] opacity-70">
      18 days after &middot; Lena &amp; Tom&aacute;s
    </Eyebrow>

    <div className="relative">
      <p className="mb-6.5 font-serif text-[2.75rem] leading-tight tracking-tight italic">
        &ldquo;The way you look at her — like the room just got quieter.&rdquo;
      </p>
      <VoiceMessagePreview
        name="Margot Devreese"
        role="Maid of honour"
        duration="2:22"
        initial="M"
        tint="#EFC9A8"
      />
    </div>

    <p className="type-body-small relative max-w-[420px] leading-relaxed opacity-75">
      87 voices, 1h 42m of stories, 64 photos — held safely for you to revisit
      whenever you want.
    </p>
  </div>
);
