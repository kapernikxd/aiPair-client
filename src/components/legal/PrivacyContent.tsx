"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useTranslations } from "@/localization/TranslationProvider";

export default function PrivacyContent() {
  const { t, tList } = useTranslations();

  const sections = useMemo(
    () => [
      {
        title: t("legal.privacy.section1.title", "1. Overview"),
        content: (
          <p>
            {t(
              "legal.privacy.section1.body",
              "This Privacy Policy explains how AiPair Inc. (\"AiPair\", \"we\", \"us\") collects, uses, and shares information when you use AiPair products, websites, and services. By accessing AiPair you agree to the practices described here.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.privacy.section2.title", "2. Data We Collect"),
        content: (
          <ul className="list-disc space-y-2 pl-5">
            {tList("legal.privacy.section2.items", [
              "Account data: name, email, avatar, and password or third-party tokens collected for registration and sign-in.",
              "Usage data: interactions with AI companions, session metadata, and device details (browser type, language, etc.).",
              "Communications: messages you send to support or via feedback channels.",
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
      },
      {
        title: t("legal.privacy.section3.title", "3. How We Use Information"),
        content: (
          <ul className="list-disc space-y-2 pl-5">
            {tList("legal.privacy.section3.items", [
              "Provide, personalise, and improve AI conversations and recommendations.",
              "Maintain platform stability and security while enforcing our Terms.",
              "Notify you about updates, respond to support inquiries, and deliver service communications.",
              "Develop new features and conduct aggregated analytics to understand engagement.",
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
      },
      {
        title: t("legal.privacy.section4.title", "4. Sharing and Disclosure"),
        content: (
          <p>
            {t(
              "legal.privacy.section4.body",
              "We do not sell personal data. We may share limited information with contractors who help maintain AiPair (such as hosting or support services) under contractual obligations to protect your data. We disclose information when required by law or to protect AiPair, users, or the public.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.privacy.section5.title", "5. Data Retention"),
        content: (
          <p>
            {t("legal.privacy.section5.body.beforeEmail", "Conversation history and account records are kept while your profile is active and as needed to provide the service. You can request deletion of your account and related data by emailing ")}
            <a className="text-[#6f2da8] underline" href="mailto:aipairpro@yandex.com">
              aipairpro@yandex.com
            </a>
            {t("legal.privacy.section5.body.afterEmail", ". We may retain certain information to comply with legal obligations or resolve disputes.")}
          </p>
        ),
      },
      {
        title: t("legal.privacy.section6.title", "6. Your Choices"),
        content: (
          <ul className="list-disc space-y-2 pl-5">
            {tList("legal.privacy.section6.items", [
              "Adjust profile and privacy preferences within your AiPair account.",
              "Manage conversation memory for each chat directly in the product.",
              "Unsubscribe from marketing emails via the \"Unsubscribe\" link in messages.",
              "Request access, portability, or deletion of data by contacting aipairpro@yandex.com.",
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
      },
      {
        title: t("legal.privacy.section7.title", "7. Security"),
        content: (
          <p>
            {t(
              "legal.privacy.section7.body",
              "We implement technical and organisational measures, including encryption in transit, access controls, and regular security reviews. No system is entirely secure, so we recommend using strong passwords and protecting your devices.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.privacy.section8.title", "8. International Users"),
        content: (
          <p>
            {t(
              "legal.privacy.section8.body",
              "AiPair is operated from the United States, and data may be processed outside your jurisdiction. By using AiPair you consent to the transfer of information to the US and other countries where we or our partners operate.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.privacy.section9.title", "9. Changes to this Policy"),
        content: (
          <p>
            {t(
              "legal.privacy.section9.body",
              "We may update this Privacy Policy from time to time. Significant changes will be posted here with an updated effective date. By continuing to use AiPair after changes take effect, you confirm your agreement.",
            )}
          </p>
        ),
      },
      {
        title: t("legal.privacy.section10.title", "10. Contact"),
        content: (
          <p>
            {t("legal.privacy.section10.body.beforeEmail", "If you have privacy questions for AiPair, email ")}
            <a className="text-[#6f2da8] underline" href="mailto:aipairpro@yandex.com">
              aipairpro@yandex.com
            </a>
            {t("legal.privacy.section10.body.afterEmail", " or visit our ")}
            <Link className="text-[#6f2da8] underline" href="/contact">
              {t("legal.privacy.section10.body.link", "contact page")}
            </Link>
            {t("legal.privacy.section10.body.afterLink", ".")}
          </p>
        ),
      },
    ],
    [t, tList],
  );

  const year = new Date().getFullYear();
  const effectiveDate = new Date().toLocaleDateString();

  return (
    <main className="min-h-screen bg-neutral-950 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl px-6">
        <header className="mb-12 space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            {t("legal.common.category", "AiPair legal documents")}
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            {t("legal.privacy.heading", "Privacy Policy")}
          </h1>
          <p className="text-sm text-white/70">
            {t("legal.common.effectiveDate", "Effective date")}: {effectiveDate}
          </p>
        </header>

        <div className="space-y-8 rounded-3xl border border-white/10 bg-neutral-900/60 p-8 text-sm leading-relaxed text-white/80">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <div className="space-y-3 text-white/80">{section.content}</div>
            </section>
          ))}
        </div>

        <footer className="mt-12 text-center text-xs text-white/60">
          <p>
            © {year} AiPair. {t("legal.common.rights", "All rights reserved.")}
          </p>
        </footer>
      </div>
    </main>
  );
}

