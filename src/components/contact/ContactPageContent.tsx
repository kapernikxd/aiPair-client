'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslations } from '@/localization/TranslationProvider';

export function ContactPageContent() {
  const { t } = useTranslations();

  const channels = useMemo(
    () => [
      {
        title: t('contact.channels.support.title', 'Support & Feedback'),
        description: t(
          'contact.channels.support.description',
          'Need help using AiPair or have suggestions to share? Email our support team and we will respond within 2 business days.',
        ),
        actionLabel: t('contact.channels.support.action', 'feedback@aipair.pro'),
        actionHref: 'mailto:feedback@aipair.pro',
      },
      {
        title: t('contact.channels.partnerships.title', 'Partnerships'),
        description: t(
          'contact.channels.partnerships.description',
          'Interested in integrating AiPair characters into your product or building a custom experience? Reach out to discuss collaborations.',
        ),
        actionLabel: t('contact.channels.partnerships.action', 'Partner with us'),
        actionHref: 'mailto:feedback@aipair.pro?subject=Partnership%20with%20AiPair',
      },
      {
        title: t('contact.channels.press.title', 'Press'),
        description: t(
          'contact.channels.press.description',
          'Members of the media can contact us for interviews, product details, or assets about AiPair and our AI companion mission.',
        ),
        actionLabel: t('contact.channels.press.action', 'Request press info'),
        actionHref: 'mailto:feedback@aipair.pro?subject=Press%20Inquiry',
      },
    ],
    [t],
  );

  const faqs = useMemo(
    () => [
      {
        question: t('contact.faq.response.question', 'How quickly will I receive a response?'),
        answer: t(
          'contact.faq.response.answer',
          'We aim to reply to all emails within 48 hours, Monday through Friday. Complex product questions may take longer, but you will hear back from us.',
        ),
      },
      {
        question: t('contact.faq.community.question', 'Do you have a community space?'),
        answer: t(
          'contact.faq.community.answer',
          'Join the conversation with other creators and fans on our upcoming AiPair Discord community. Sign up for updates on the landing page.',
        ),
      },
      {
        question: t('contact.faq.location.question', 'Where is the AiPair team located?'),
        answer: t('contact.faq.location.answer', 'We are a distributed team with contributors across North America and Europe.'),
      },
    ],
    [t],
  );

  return (
    <main className="min-h-screen bg-neutral-950 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mb-16 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">{t('contact.header.tag', 'Contact')}</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">{t('contact.header.title', 'We would love to hear from you')}</h1>
          <p className="mt-4 text-sm text-white/70">
            {t(
              'contact.header.subtitle',
              'Reach out for product support, business opportunities, or to tell us how AiPair can improve your AI companion experience.',
            )}
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {channels.map((channel) => (
            <div key={channel.title} className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">{channel.title}</h2>
                <p className="text-sm leading-relaxed text-white/70">{channel.description}</p>
              </div>
              <a className="mt-6 inline-flex items-center justify-start text-sm font-semibold text-[#c7a7ff] hover:text-white" href={channel.actionHref}>
                {channel.actionLabel}
              </a>
            </div>
          ))}
        </section>

        <section className="mt-16 grid gap-10 rounded-3xl border border-white/10 bg-neutral-900/60 p-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">{t('contact.resources.title', 'Additional resources')}</h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                {t('contact.resources.terms', 'Review our')}{' '}
                <Link className="text-[#c7a7ff] underline" href="/terms">
                  {t('contact.resources.termsLink', 'Terms of Service')}
                </Link>{' '}
                {t('contact.resources.termsSuffix', 'to understand platform usage.')}
              </li>
              <li>
                {t('contact.resources.privacy', 'Learn how we protect your information in the')}{' '}
                <Link className="text-[#c7a7ff] underline" href="/privacy">
                  {t('contact.resources.privacyLink', 'Privacy Policy')}
                </Link>
                .
              </li>
              <li>{t('contact.resources.blog', 'Follow product updates and tutorials on our upcoming blog (launching soon!).')}</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">{t('contact.faq.title', 'Quick answers')}</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
                  <h3 className="text-sm font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm text-white/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center text-xs text-white/60">
          <p>{t('contact.footer.note', 'Prefer to talk live? Keep an eye on your inbox for upcoming community sessions hosted by the AiPair team.')}</p>
        </footer>
      </div>
    </main>
  );
}
