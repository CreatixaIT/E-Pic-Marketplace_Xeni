"use client";

import { useDictionary } from "@/lib/i18n/client";
import { Mail, Shield, Bell, Lock, AlertTriangle } from "lucide-react";

interface SettingsSectionProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    createdAt?: string;
  };
}

export function SettingsSection({ user }: SettingsSectionProps) {
  const dict = useDictionary();

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Recently";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{dict.account.settings}</h2>

      {/* Account Details */}
      <div className="p-6 border border-border rounded-lg space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Mail className="size-5" />
          {dict.account.accountDetails}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted">{dict.auth.email}</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted">{dict.auth.name}</span>
            <span className="font-medium">{user.name || "—"}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted">{dict.account.memberSince}</span>
            <span className="font-medium">{memberSince}</span>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="space-y-4">
        <div className="p-6 border border-border rounded-lg opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="size-5 text-muted" />
            <h3 className="font-semibold text-lg">{dict.account.changePassword}</h3>
          </div>
          <p className="text-sm text-muted">{dict.account.comingSoonDescription}</p>
        </div>

        <div className="p-6 border border-border rounded-lg opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="size-5 text-muted" />
            <h3 className="font-semibold text-lg">{dict.account.notifications}</h3>
          </div>
          <p className="text-sm text-muted">{dict.account.comingSoonDescription}</p>
        </div>

        <div className="p-6 border border-border rounded-lg opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="size-5 text-muted" />
            <h3 className="font-semibold text-lg">{dict.account.privacy}</h3>
          </div>
          <p className="text-sm text-muted">{dict.account.comingSoonDescription}</p>
        </div>

        <div className="p-6 border border-border rounded-lg opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="size-5 text-muted" />
            <h3 className="font-semibold text-lg">{dict.account.deleteAccount}</h3>
          </div>
          <p className="text-sm text-muted">{dict.account.comingSoonDescription}</p>
        </div>
      </div>
    </div>
  );
}