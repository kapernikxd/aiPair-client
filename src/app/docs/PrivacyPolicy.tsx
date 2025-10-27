import { EMAIL, SITE_NAME } from '@/helpers/http';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ 
      maxWidth: '960px', 
      margin: '0 auto', 
      padding: '60px 20px', 
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
      lineHeight: '1.6', 
      color: '#333' 
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>Privacy Policy</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}><strong>Effective Date:</strong> April 1, 2024</p>

      <section style={{ marginBottom: '40px' }}>
        <p>
          This Privacy Policy explains how the website{' '}
          <a href={process.env.DOMAIN} target="_blank" rel="noopener noreferrer">{process.env.DOMAIN}</a>{' '}
          and the mobile application &quot;{SITE_NAME}&quot; (hereinafter referred to as &quot;{SITE_NAME}&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our service&quot;)
          collect, use, process, and protect users&apos; personal data.
        </p>
        <p>
          By using our website or mobile application, you agree to the terms of this Privacy Policy.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>1. Terms and Definitions</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>
            <strong>Operator:</strong> the administration of the {SITE_NAME} service that determines the purposes and means of
            processing users&apos; personal data.
          </li>
          <li><strong>User:</strong> an individual who uses the {SITE_NAME} website or mobile application.</li>
          <li><strong>Personal Data:</strong> any information relating to an identified or identifiable user.</li>
          <li><strong>Personal Data Processing:</strong> any operation performed with personal data (collection, recording, storage, use, transfer, deletion, etc.).</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2. Data We Collect</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>First and last name</li>
          <li>Email address</li>
          <li>Phone number (optional, provided by the user)</li>
          <li>Approximate location data (if permission is granted)</li>
          <li>User-generated content (e.g., events)</li>
          <li>Photos (e.g., for events)</li>
          <li>Device identifiers and technical usage information</li>
          <li>Cookies and IP addresses to enhance website and app functionality</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>3. Purposes of Data Processing</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Registration and authentication</li>
          <li>Creation and publication of events</li>
          <li>Communication with users (e.g., notifications)</li>
          <li>Analytics to improve service performance</li>
          <li>Fraud prevention and security enhancement</li>
          <li>Providing personalized content (e.g., events based on interests)</li>
          <li>Compliance with legal obligations</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>4. Data Sharing with Third Parties</h2>
        <p>We may share your personal data:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>With contractors and partners supporting our service (e.g., hosting, analytics, notifications)</li>
          <li>With law enforcement authorities upon legal request</li>
          <li>Only as necessary to achieve the purposes outlined in this policy</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>5. Data Protection</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Data transmission through secure protocols (HTTPS, WSS)</li>
          <li>Restricted access to data within the company</li>
          <li>Continuous security system monitoring</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>6. User Consent</h2>
        <p>
          By using the {SITE_NAME} website or mobile application, you:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Agree to the terms of this Privacy Policy</li>
          <li>Consent to the collection and processing of your personal data</li>
          <li>Can withdraw your consent by contacting us</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>7. User Rights</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Request access to your personal data</li>
          <li>Request correction or deletion of your data</li>
          <li>Object to the processing of specific types of data (e.g., location data)</li>
          <li>Contact us regarding personal data issues</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>8. Contact Information</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <p><strong>Email:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </section>

      <section>
        <h2>9. Changes to the Policy</h2>
        <p>
          We may update this Privacy Policy periodically.
          All updates will be published on this page.
          We encourage users to review this page regularly for any changes.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
