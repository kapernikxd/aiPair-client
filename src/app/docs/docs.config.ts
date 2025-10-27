import type { Metadata } from "next";
import type { ComponentType } from "react";

import {
  ChildSafetyStandards,
  DeleteAccountInfo,
  PrivacyPolicy,
  TermsOfUse,
} from ".";

export type DocSlug =
  | "privacy-policy"
  | "terms-of-use"
  | "child-safety-standards"
  | "delete-account";

export interface DocConfigEntry {
  slug: DocSlug;
  name: string;
  summary: string;
  Component: ComponentType;
  metadata: Metadata;
}

export const DOCS = [
  {
    slug: "privacy-policy",
    name: "Privacy Policy",
    summary:
      "Understand how AiPair collects, uses, and protects your personal data across the platform.",
    Component: PrivacyPolicy,
    metadata: {
      title: "AiPair | Privacy Policy",
      description:
        "Review AiPair's privacy policy to understand how your data is collected, used, and protected.",
    },
  },
  {
    slug: "terms-of-use",
    name: "Terms of Use",
    summary:
      "Learn about the rules and responsibilities that apply when using the AiPair platform.",
    Component: TermsOfUse,
    metadata: {
      title: "AiPair | Terms of Use",
      description:
        "Read the AiPair terms of use to learn about the rules and responsibilities when using the platform.",
    },
  },
  {
    slug: "child-safety-standards",
    name: "Child Safety Standards",
    summary:
      "See the safeguards AiPair follows to keep young users safe and respond to potential issues.",
    Component: ChildSafetyStandards,
    metadata: {
      title: "AiPair | Child Safety Standards",
      description:
        "Understand the measures AiPair takes to keep children safe and how to report potential issues.",
    },
  },
  {
    slug: "delete-account",
    name: "Delete Account Information",
    summary:
      "Find out how to permanently delete your AiPair account and what happens to your data afterwards.",
    Component: DeleteAccountInfo,
    metadata: {
      title: "AiPair | Delete Account Information",
      description:
        "Learn how to delete your AiPair account and what happens to your data once the process is complete.",
    },
  },
] satisfies DocConfigEntry[];

export const DOCS_BY_SLUG = DOCS.reduce<Record<DocSlug, DocConfigEntry>>((acc, doc) => {
  acc[doc.slug] = doc;
  return acc;
}, {} as Record<DocSlug, DocConfigEntry>);
