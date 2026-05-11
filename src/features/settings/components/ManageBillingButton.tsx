"use client";

import { useState } from "react";
import { Button } from "@ovation/ui/components/Button";
import { paymentsClient } from "@/lib/api/payments-client";

type ManageBillingButtonProps = {
  label: string;
};

export const ManageBillingButton = ({ label }: ManageBillingButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await paymentsClient.createBillingPortalSession({
        returnUrl: window.location.href,
      });
      window.location.assign(result.url);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};
