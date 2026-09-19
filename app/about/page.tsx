import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { 
  ShoppingBag, 
  Store, 
  BarChart3, 
  MessageSquare, 
  LayoutTemplate,
  Bot,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "About E-Pic - Smart Marketplace Powered by Xeni",
  description: "E-Pic is a smart marketplace solution for SMEs across Asia, powered by Xeni's AI-driven seller operating system.",
};

const challenges = [
  {
    title: "Fragmented Selling Channels",
    body: "SMEs struggle to manage products across multiple platforms with inconsistent inventory and data.",
    icon: ShoppingBag,
  },
  {
    title: "Inventory Complexity",
    body: "Manual stock tracking leads to overselling, underselling, and frustrated customers.",
    icon: Store,
  },
  {
    title: "Limited Analytics",
    body: "Without actionable insights, businesses can't optimize their operations or understand customer behavior.",
    icon: BarChart3,
  },
  {
    title: "Social Media Workload",
    body: "Creating content for multiple platforms is time-consuming and requires specialized skills.",
    icon: MessageSquare,
  },
  {
    title: "Technical Barriers",
    body: "Many SMEs lack the technical resources and budget for robust e-commerce infrastructure.",
    icon: LayoutTemplate,
  },
  {
    title: "Inconsistent Product Information",
    body: "Maintaining accurate product details across channels becomes increasingly difficult as businesses grow.",
    icon: Bot,
  },
];

const solution = [
  {
    title: "Marketplace + Operating System",
    body: "E-Pic provides the marketplace and customer discovery. Xeni provides the seller operating system and AI-powered business management.",
  },
  {
    title: "Centralized Commerce Control",
    body: "Products, inventory, orders, and customer communication are managed in one place through Xeni's smart dashboard.",
  },
  {
    title: "AI-Powered Assistance",
    body: "Xeni's AI helps with content creation, analytics, automation, and personalized customer support.",
  },
];

const features = [
  {
    title: "Smart Seller Dashboard",
    body: "Complete business management from one interface — products, inventory, orders, analytics, and more.",
  },
  {
    title: "AI Content Creation",
    body: "Generate Facebook posts, product descriptions, and marketing materials in Bangla and English.",
  },
  {
    title: "Automated Operations",
    body: "Order processing, payment verification, courier booking, and customer communication run automatically.",
  },
  {
    title: "Business Intelligence",
    body: "Understand sales patterns, peak hours, best products, and growth opportunities with actionable insights.",
  },
  {
    title: "Social Media Integration",
    body: "Connect and manage social media presence across Facebook, Instagram, TikTok, and more.",
  },
  {
    title: "Personalized AI Assistant",
    body: "Configure Xeni to understand your business, brand identity, and customers for personalized assistance.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About E-Pic"
        title="A Simpler Path to Online Commerce"
        description="E-Pic is a smart marketplace solution for SMEs across Asia, powered by Xeni's AI-driven seller operating system."
      />

      {/* The Problem */}
      <Section>
        <SectionHeading
          eyebrow="The Challenge"
          title="Why SMEs Need a Better Solution"
          description="Small and medium enterprises across Asia face significant barriers to successful e-commerce operations."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <li key={challenge.title}>
              <Reveal delay={index * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <challenge.icon className="size-5 text-accent" aria-hidden />
                  <h3 className="mt-4 text-base font-medium">
                    {challenge.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {challenge.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* The Solution */}
      <Section className="border-t border-border bg-surface/40">
        <SectionHeading
          eyebrow="The Solution"
          title="E-Pic + Xeni: Better Together"
          description="A powerful partnership that gives SMEs enterprise-grade commerce capabilities without the complexity."
        />
        <div className="mt-12 space-y-6">
          {solution.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="rounded-2xl border border-border bg-background/60 p-6">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* What Sellers Get */}
      <Section>
        <SectionHeading
          eyebrow="Seller Benefits"
          title="What You Get with Xeni"
          description="Xeni manages your complete business backend, so your products automatically appear in your E-Pic storefront."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <li key={feature.title}>
              <Reveal delay={index * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <h3 className="text-base font-medium">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border bg-surface/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-muted mb-8">
            Open your smart shop with Xeni and start selling on E-Pic marketplace today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <ButtonLink href="/seller" size="lg">
              Open Your Smart Shop
            </ButtonLink>
            <ButtonLink href="/explore" size="lg" variant="secondary">
              Explore Marketplace
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
