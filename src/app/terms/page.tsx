import Link from "next/link";

export const metadata = {
  title: "AiPair | Terms of Service",
  description:
    "Review the Terms of Service for AiPair to understand the rules that govern the use of our AI companion platform.",
};

const sections = [
  {
    title: "1. Introduction",
    content: (
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of AiPair, the conversational AI platform provided by
        AiPair Inc. (&ldquo;AiPair&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using AiPair you agree to be bound by these Terms.
        If you do not agree, you may not use the service.
      </p>
    ),
  },
  {
    title: "2. Eligibility & Accounts",
    content: (
      <p>
        You must be at least 13 years old to use AiPair. Creating an account requires accurate, current information. You are
        responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your
        account.
      </p>
    ),
  },
  {
    title: "3. Acceptable Use",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>No reverse engineering, scraping, or automated collection of platform data.</li>
        <li>No harassment, hate speech, or unlawful content shared with AiPair or other users.</li>
        <li>No attempts to circumvent security features or access another user&apos;s account.</li>
        <li>
          You may not use AiPair to develop or distribute competing models or datasets without prior written consent from
          AiPair.
        </li>
      </ul>
    ),
  },
  {
    title: "4. Intellectual Property",
    content: (
      <p>
        AiPair retains all rights, title, and interest in the platform, including software, interfaces, and branding. By
        submitting content, you grant AiPair a non-exclusive, worldwide, royalty-free license to use that content solely for
        operating and improving the service. You remain responsible for the legality of the content you submit.
      </p>
    ),
  },
  {
    title: "5. Subscriptions & Billing",
    content: (
      <p>
        AiPair may offer free and paid plans. Paid plans renew automatically at the published rate unless you cancel before
        the renewal date. All fees are non-refundable unless required by law. We reserve the right to change pricing with
        reasonable notice.
      </p>
    ),
  },
  {
    title: "6. Privacy",
    content: (
      <p>
        Our <Link className="text-[#6f2da8] underline" href="/privacy">Privacy Policy</Link> describes how we collect and use
        your data. By using AiPair you consent to those practices.
      </p>
    ),
  },
  {
    title: "7. Disclaimers & Limitation of Liability",
    content: (
      <p>
        AiPair is provided on an &ldquo;as is&rdquo; basis without warranties of any kind. We do not guarantee accuracy, availability, or
        that conversations will meet your expectations. To the fullest extent permitted by law, AiPair is not liable for any
        indirect, incidental, special, or consequential damages arising from your use of the service.
      </p>
    ),
  },
  {
    title: "8. Termination",
    content: (
      <p>
        We may suspend or terminate your access to AiPair if you violate these Terms or engage in harmful behavior. You may
        cancel your account at any time through your settings or by contacting us at <a href="mailto:feedback@aipair.pro"
        className="text-[#6f2da8] underline">feedback@aipair.pro</a>.
      </p>
    ),
  },
  {
    title: "9. Changes to these Terms",
    content: (
      <p>
        AiPair may update these Terms to reflect changes in our services or legal requirements. When we make material
        updates, we will post a notice on this page and update the effective date below. Continued use after changes become
        effective constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    title: "10. Contact",
    content: (
      <p>
        For questions about these Terms, contact us at <a href="mailto:feedback@aipair.pro" className="text-[#6f2da8]
        underline">feedback@aipair.pro</a> or visit our <Link className="text-[#6f2da8] underline" href="/contact">Contact
        page</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl px-6">
        <header className="mb-12 space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">AiPair Legal</p>
          <h1 className="text-3xl font-bold md:text-4xl">Terms of Service</h1>
          <p className="text-sm text-white/70">Effective date: {new Date().toLocaleDateString()}</p>
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
          <p>© {new Date().getFullYear()} AiPair. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
