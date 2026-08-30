"use client";

import { useState } from "react";
import { useDictionary } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const dict = useDictionary();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    image: user.image || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: dict.account.profileUpdateError });
        return;
      }

      setMessage({ type: "success", text: dict.account.profileUpdated });
      setIsEditing(false);
      
      // Refresh to show updated data
      window.location.reload();
    } catch {
      setMessage({ type: "error", text: dict.account.profileUpdateError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name || "", image: user.image || "" });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{dict.account.editProfile}</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            {dict.account.editProfile}
          </Button>
        )}
      </div>

      {message && (
        <div
          className={cn(
            "p-4 rounded-lg",
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {dict.auth.name}
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={dict.auth.namePlaceholder}
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Profile Image URL
            </label>
            <input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
            />
            <p className="mt-1 text-xs text-muted">
              Enter a URL for your profile image
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? dict.account.save + "..." : dict.account.save}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              {dict.account.cancel}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold text-muted">
                {(user.name || user.email)[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {user.name || dict.account.profile}
              </h3>
              <p className="text-muted">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-medium mb-3">{dict.account.profileDetails}</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted">{dict.auth.name}</dt>
                <dd className="font-medium">{user.name || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{dict.auth.email}</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              {user.image && (
                <div className="flex justify-between">
                  <dt className="text-muted">Profile Image</dt>
                  <dd className="font-medium text-accent truncate max-w-xs">
                    {user.image}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}