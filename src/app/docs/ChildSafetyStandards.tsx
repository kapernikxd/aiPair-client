import { EMAIL, SITE_NAME } from '@/helpers/http';
import React from 'react';

const ChildSafetyStandards = () => {
  return (
    <div style={{ 
      maxWidth: '960px', 
      margin: '0 auto', 
      padding: '60px 20px', 
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
      lineHeight: '1.6', 
      color: '#333' 
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>Child Safety Standards</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}><strong>Effective Date:</strong> April 1, 2024</p>

      <section style={{ marginBottom: '40px' }}>
        <p>
          At &quot;{SITE_NAME}&quot;, the safety and well-being of children are our highest
          priority.
        </p>
        <p>We strictly prohibit any content that depicts, promotes, or facilitates the sexual exploitation or abuse of minors.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>1. Our Commitments</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Prohibit any content involving the sexual exploitation or abuse of children.</li>
          <li>Immediately remove any content that violates these standards.</li>
          <li>Report any illegal activities involving minors to the appropriate law enforcement authorities.</li>
          <li>Actively moderate and monitor user-generated content for violations.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2. Reporting Violations</h2>
        <p>Users can report violations directly within the {SITE_NAME} application through the built-in reporting tools.</p>
        <p>Reports are reviewed promptly, and appropriate action will be taken according to our policies and applicable laws.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>3. Cooperation with Authorities</h2>
        <p>We fully cooperate with regional and national law enforcement agencies to address any incidents involving the safety of minors.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>4. Contact Information</h2>
        <p>If you have any questions or concerns regarding child safety on {SITE_NAME}, please contact us:</p>
        <p><strong>Email:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </section>
    </div>
  );
};

export default ChildSafetyStandards;
