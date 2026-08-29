"use client";

import { motion } from "framer-motion";
import type { Store, Product } from "@/lib/commerce/types";
import { ProductGrid } from "@/components/products/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { AmbientBackdrop } from "@/components/immersive/ambient-backdrop";
import type { ActiveLocale } from "@/config/i18n";
import type { Dictionary } from "@/lib/i18n/types";

interface ImmersiveTemplateProps {
  store: Store;
  products: Product[];
  dictionary: Dictionary;
  locale: ActiveLocale;
}

export function ImmersiveTemplate({
  store,
  products,
  dictionary,
  locale,
}: ImmersiveTemplateProps) {
  const ambientType = store.theme.pattern === "rings" ? "orbs" : 
                     store.theme.pattern === "beams" ? "beams" : "aurora";

  return (
    <>
      {/* Immersive Hero with Ambient Motion */}
      <div className="relative overflow-hidden min-h-[60vh] flex items-center">
        <AmbientBackdrop type={ambientType} />
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${store.theme.gradient} opacity-30`}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium tracking-wide uppercase text-muted"
            >
              {store.categoryLabel}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {store.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xl text-muted leading-relaxed"
            >
              {store.visualConfig.hero?.description || store.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted"
            >
              <span>{store.location}</span>
              <span>·</span>
              <span>{store.productCount} {dictionary.worlds.products}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex justify-center gap-4"
            >
              <ButtonLink href="/explore" variant="secondary">
                {dictionary.worlds.viewAllStores}
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Brand Story */}
      {store.visualConfig.brandStory && (
        <Section className="bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl font-semibold">
              {store.visualConfig.brandStory.title}
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              {store.visualConfig.brandStory.content}
            </p>
          </motion.div>
        </Section>
      )}

      {/* Products with reveal animation */}
      <Section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading eyebrow="Catalogue" title={store.tagline} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <ProductGrid
            products={products}
            badges={dictionary.badges}
            locale={locale}
          />
        </motion.div>
      </Section>
    </>
  );
}