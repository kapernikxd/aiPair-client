import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DOCS, DOCS_BY_SLUG, type DocSlug } from "../docs.config";

export function generateStaticParams() {
  return DOCS.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const entry = DOCS_BY_SLUG[params.slug as DocSlug];

  if (!entry) {
    return {
      title: "AiPair | Documentation",
      description:
        "Explore AiPair policies and documentation to learn more about how the platform operates.",
    };
  }

  return entry.metadata;
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const entry = DOCS_BY_SLUG[params.slug as DocSlug];

  if (!entry) {
    notFound();
  }

  const { Component } = entry;

  return <Component />;
}

export const dynamicParams = false;
