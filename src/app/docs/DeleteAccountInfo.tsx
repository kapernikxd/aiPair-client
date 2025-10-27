import { EMAIL, SITE_NAME } from '@/helpers/http';
import React from 'react';

const DeleteAccountInfo = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px', fontFamily: 'sans-serif', color: '#fff'  }}>
      <h1>Request to Delete Account - {SITE_NAME} App</h1>

      <p>
        This page provides information on how users can request the deletion of their account and associated data from the &quot;{SITE_NAME}&quot; mobile application.
      </p>

      <p style={{ fontWeight: 'bold' }}>
        Please note: The account deletion process described here applies exclusively to the &quot;{SITE_NAME}&quot; mobile application. It does not apply to any other platforms or services.
      </p>

      <h2>How to Request Account Deletion</h2>
      <ol>
        <li>Open the &quot;{SITE_NAME}&quot; mobile application on your device.</li>
        <li>Go to the <strong>Profile</strong> tab.</li>
        <li>Tap on the <strong>Settings (gear)</strong> icon located in the top right corner.</li>
        <li>
          Select <strong>&quot;Delete Account&quot;</strong> from the menu options.
        </li>
        <li>Confirm your decision to permanently delete your account.</li>
      </ol>

      <h2>Data Deletion Policy</h2>
      <ul>
        <li>All personal information, including profile details, messages, and event participation records, will be permanently deleted within 30 days after the deletion request is made.</li>
        <li>Some non-identifiable data may be retained for legal, analytical, or operational purposes as permitted by law.</li>
      </ul>

      <h2>Developer Information</h2>
      <p>
        Developer: Vadim Stepanov
      </p>

      <p>If you encounter any issues or have further questions, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
    </div>
  );
};

export default DeleteAccountInfo;

