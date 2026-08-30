"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { useDictionary } from "@/lib/i18n/client";
import { ProfileSection } from "./profile-section";
import { OrdersSection } from "./orders-section";
import { AddressesSection } from "./addresses-section";
import { SettingsSection } from "./settings-section";
import { User, ShoppingBag, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = "profile" | "orders" | "addresses" | "settings";

interface AccountDashboardProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    createdAt?: string;
  };
}

export function AccountDashboard({ user }: AccountDashboardProps) {
  const dict = useDictionary();
  const [activeSection, setActiveSection] = useState<Section>("profile");

  const sections = [
    { id: "profile" as Section, label: dict.account.profile, icon: User },
    { id: "orders" as Section, label: dict.account.orders, icon: ShoppingBag },
    { id: "addresses" as Section, label: dict.account.savedAddresses, icon: MapPin },
    { id: "settings" as Section, label: dict.account.accountSettings, icon: Settings },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {dict.account.myAccount}
          </h1>
          <p className="text-muted">
            {dict.account.welcomeBack}, {user.name || user.email}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Navigation */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                  activeSection === section.id
                    ? "bg-accent text-accent-contrast"
                    : "bg-muted text-muted hover:bg-muted/80"
                )}
              >
                <section.icon className="size-4" />
                {section.label}
              </button>
            ))}
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                    activeSection === section.id
                      ? "bg-accent text-accent-contrast"
                      : "text-muted hover:bg-muted hover:text-foreground"
                  )}
                >
                  <section.icon className="size-5" />
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeSection === "profile" && <ProfileSection user={user} />}
            {activeSection === "orders" && <OrdersSection />}
            {activeSection === "addresses" && <AddressesSection userId={user.id} />}
            {activeSection === "settings" && <SettingsSection user={user} />}
          </main>
        </div>
      </Container>
    </div>
  );
}