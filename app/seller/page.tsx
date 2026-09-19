import type { Metadata } from "next";
import { 
  BadgeCheck, 
  LayoutTemplate, 
  LineChart, 
  Wallet,
  Bot,
  Sparkles,
  BarChart3,
  Globe2,
  Zap
} from "lucide-react";
import type { SellerBenefit } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Open Your Smart Shop with Xeni",
  description:
    "Xeni is your AI-powered seller operating system. Manage your complete online business from one place and sell on E-Pic marketplace.",
};

const benefits: SellerBenefit[] = [
  {
    id: "ai-powered",
    title: "Your Personal AI Assistant",
    description:
      "Train Xeni to understand your business, brand identity, and customers. Get personalized assistance for content, analytics, and automation.",
    icon: Bot,
  },
  {
    id: "smart-management",
    title: "Complete Business Management",
    description:
      "Products, inventory, orders, customer communication, and analytics — all in one smart dashboard. Xeni handles the backend so you can focus on growth.",
    icon: LayoutTemplate,
  },
  {
    id: "creative-tools",
    title: "AI-Powered Content Creation",
    description:
      "Generate Facebook posts, product descriptions, and ad creatives with Xeni's AI. Create compelling content in Bangla and English.",
    icon: Sparkles,
  },
  {
    id: "social-media",
    title: "Social Media Integration",
    description:
      "Connect and manage your social media presence. Xeni helps you reach customers across Facebook, Instagram, TikTok, and more.",
    icon: Globe2,
  },
  {
    id: "analytics",
    title: "Business Intelligence",
    description:
      "Understand your sales, peak hours, best products, and growth opportunities. Xeni provides actionable insights, not just data.",
    icon: BarChart3,
  },
  {
    id: "automation",
    title: "Business Automation",
    description:
      "Automate order processing, payment verification, courier booking, and customer communication. Let Xeni handle the repetitive tasks.",
    icon: Zap,
  },
];

const steps = [
  {
    title: "Sign Up with Xeni",
    description: "Create your account using Google or email. Xeni becomes your personal business operating system.",
  },
  {
    title: "Train Your Personal Xeni",
    description: "Configure your AI assistant with your business details, brand identity, and preferences.",
  },
  {
    title: "Launch Your Smart Shop",
    description: "Add products, configure your store, and start selling on E-Pic marketplace automatically.",
  },
];

export default function SellerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Powered by Xeni"
        title="Open Your Smart Shop with Xeni"
        description="Xeni is your AI-powered seller operating system. Manage your complete online business from one place and sell on E-Pic marketplace."
      >
        <div className="flex flex-wrap gap-3">
          <a
            href="https://xeni.xentroinfotech.com/en/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3 text-base font-medium text-white transition-colors hover:from-blue-700 hover:to-purple-700"
          >
            OPEN YOUR SMART SHOP WITH XENI
          </a>
          <ButtonLink href="/explore" size="lg" variant="secondary">
            Explore existing stores
          </ButtonLink>
        </div>
      </PageHeader>

      <Section>
        <SectionHeading
          eyebrow="What Xeni Does for You"
          title="Your Complete Business Operating System"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <li key={benefit.id}>
              <Reveal delay={index * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <benefit.icon className="size-5 text-accent" aria-hidden />
                  <h3 className="mt-4 text-base font-medium">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border bg-surface/40">
        <SectionHeading
          eyebrow="How It Works"
          title="Three steps to your smart shop"
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-background/60 p-6">
                  <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
          <h3 className="text-lg font-semibold mb-3">Xeni + E-Pic Partnership</h3>
          <p className="text-sm leading-relaxed text-muted mb-4">
            Xeni manages your complete business backend — products, inventory, orders, customer communication, analytics, and AI-powered automation. 
            Your products managed in Xeni automatically appear in your E-Pic storefront, giving you a powerful marketplace presence with minimal effort.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-muted">
            <div className="flex items-center gap-2">
              <Bot className="size-4" />
              <span>AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <LayoutTemplate className="size-4" />
              <span>Smart Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <span>Creative Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="size-4" />
              <span>Social Media</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              <span>Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <span>Automation</span>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
