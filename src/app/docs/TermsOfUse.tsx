import { EMAIL, SITE_NAME } from '@/helpers/http';
import React from 'react';

const TermsOfUse = () => {
  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      padding: '60px 20px',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>Terms of Use</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}><strong>Effective Date:</strong> April 1, 2024</p>

      <section style={{ marginBottom: '40px' }}>
        <p>Welcome to &quot;{SITE_NAME}&quot;!</p>
        <p>
          These Terms of Use (&quot;Terms&quot;) govern your access to and use of the {SITE_NAME} mobile application and the
          website <a href={process.env.DOMAIN} target="_blank" rel="noopener noreferrer">{process.env.DOMAIN}</a>{' '}
          (collectively, the &quot;Service&quot;).
        </p>
        <p>By accessing or using our Service, you agree to be bound by these Terms.</p>
        <p>If you do not agree with these Terms, you may not access or use the Service.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>1. Use of the Service</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Use the Service only in compliance with applicable laws.</li>
          <li>Do not use the Service for illegal or unauthorized purposes.</li>
          <li>Do not harass, abuse, or harm other users.</li>
          <li>Do not disrupt the security or integrity of the Service.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2. User Content</h2>
        <p>By submitting content, you grant {SITE_NAME} a non-exclusive, worldwide, royalty-free license to use, store, display, and distribute your content.</p>
        <p>You are responsible for the content you create and share.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>3. Account Registration and Security</h2>
        <p>You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>4. Privacy</h2>
        <p>
          Our collection and use of personal data are governed by our{' '}
          <a href="/docs/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>5. Intellectual Property</h2>
        <p>All rights in the Service (excluding user content) belong to {SITE_NAME} and its licensors.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>6. Termination</h2>
        <p>We may suspend or terminate your access to the Service at any time for any reason.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>7. Changes to the Terms</h2>
        <p>We may update these Terms at any time. Continued use of the Service after changes become effective constitutes acceptance of the new Terms.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>8. Reporting and Moderation</h2>
        <p>{SITE_NAME} has zero tolerance for objectionable content, including but not limited to hate speech, harassment, pornography, or any illegal activity.

          Users can report inappropriate content directly in the app. We review all reports within 24 hours and take appropriate actions, such as removing the content or blocking the user responsible.

          By using {SITE_NAME}, you agree to behave respectfully and follow these guidelines at all times..</p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us:</p>
        <p><strong>Email:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </section>
    </div>
  );
};

export default TermsOfUse;
