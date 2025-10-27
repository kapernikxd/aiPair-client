import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import {
  ChildSafetyStandards,
  DeleteAccountInfo,
  PrivacyPolicy,
  TermsOfUse,
} from "..";

interface DocEntry {
  Component: ComponentType;
  metadata: Metadata;
}

const DOCS = {
  "privacy-policy": {
    Component: PrivacyPolicy,
    metadata: {
      title: "AiPair | Privacy Policy",
      description:
        "Review AiPair's privacy policy to understand how your data is collected, used, and protected.",
    },
  },
  "terms-of-use": {
    Component: TermsOfUse,
    metadata: {
      title: "AiPair | Terms of Use",
      description:
        "Read the AiPair terms of use to learn about the rules and responsibilities when using the platform.",
    },
  },
  "child-safety-standards": {
    Component: ChildSafetyStandards,
    metadata: {
      title: "AiPair | Child Safety Standards",
      description:
        "Understand the measures AiPair takes to keep children safe and how to report potential issues.",
    },
  },
  "delete-account": {
    Component: DeleteAccountInfo,
    metadata: {
      title: "AiPair | Delete Account Information",
      description:
        "Learn how to delete your AiPair account and what happens to your data once the process is complete.",
    },
  },
} satisfies Record<string, DocEntry>;

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const entry = DOCS[params.slug as keyof typeof DOCS];

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
  const entry = DOCS[params.slug as keyof typeof DOCS];

  if (!entry) {
    notFound();
  }

  const { Component } = entry;

  return <Component />;
}

export const dynamicParams = false;
