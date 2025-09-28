import Link from "next/link";

export const metadata = {
  title: "AiPair | Privacy Policy",
  description: "Learn how AiPair collects, uses, and protects personal data across our AI companion experiences.",
};

const sections = [
  {
    title: "1. Overview",
    content: (
      <p>
        This Privacy Policy explains how AiPair Inc. (&ldquo;AiPair&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and shares information when you
        use AiPair products, websites, and services. By accessing AiPair, you consent to the practices described in this
        policy.
      </p>
    ),
  },
  {
    title: "2. Information We Collect",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Account details:</strong> name, email, avatar, and password or federated identity tokens when you register
          or authenticate.
        </li>
        <li>
          <strong>Usage data:</strong> interactions with AI companions, session metadata, and device information such as
          browser type and language.
        </li>
        <li>
          <strong>Communications:</strong> any messages you send to our support team or feedback email.
        </li>
      </ul>
    ),
  },
  {
    title: "3. How We Use Information",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Provide, personalize, and improve AI conversations and recommendations.</li>
        <li>Monitor platform stability, security, and compliance with our Terms.</li>
        <li>Communicate updates, respond to support inquiries, and send transactional notices.</li>
        <li>Develop new features and conduct aggregated analytics to understand engagement trends.</li>
      </ul>
    ),
  },
  {
    title: "4. Sharing & Disclosure",
    content: (
      <p>
        We do not sell personal data. We may share limited information with vendors that help us operate AiPair (for example,
        cloud hosting or customer support tools) under contracts that require safeguarding your data. We may disclose
        information if required by law or to protect AiPair, our users, or the public.
      </p>
    ),
  },
  {
    title: "5. Data Retention",
    content: (
      <p>
        Conversation data and account records are retained for as long as your account remains active and as necessary to
        provide our services. You may request deletion of your account and associated data by contacting
        <a className="text-[#6f2da8] underline" href="mailto:feedback@aipair.pro"> feedback@aipair.pro</a>. We may retain
        certain information to comply with legal obligations or resolve disputes.
      </p>
    ),
  },
  {
    title: "6. Your Choices",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Update profile and privacy settings directly in your AiPair dashboard.</li>
        <li>Control memory features on a per-conversation basis within the product.</li>
        <li>Opt-out of marketing communications by using the unsubscribe link in our emails.</li>
        <li>Request data access, portability, or deletion by emailing <a className="text-[#6f2da8] underline" href="mailto:feedback@aipair.pro">feedback@aipair.pro</a>.</li>
      </ul>
    ),
  },
  {
    title: "7. Security",
    content: (
      <p>
        We implement technical and organizational safeguards such as encryption in transit, access controls, and regular
        security reviews. No system is fully secure, so we encourage you to use strong passwords and protect your devices.
      </p>
    ),
  },
  {
    title: "8. International Users",
    content: (
      <p>
        AiPair is operated from the United States and may process information outside your jurisdiction. By using AiPair, you
        consent to the transfer of information to the U.S. and other countries where we or our vendors operate.
      </p>
    ),
  },
  {
    title: "9. Changes to this Policy",
    content: (
      <p>
        We may update this Privacy Policy periodically. Material changes will be posted on this page with a revised effective
        date. Continued use of AiPair after changes take effect indicates your acceptance.
      </p>
    ),
  },
  {
    title: "10. Contact",
    content: (
      <p>
        If you have questions about privacy at AiPair, contact us at <a className="text-[#6f2da8] underline" href="mailto:feedback@aipair.pro">feedback@aipair.pro</a> or via our <Link className="text-[#6f2da8] underline" href="/contact">Contact page</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl px-6">
        <header className="mb-12 space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">AiPair Legal</p>
          <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
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
