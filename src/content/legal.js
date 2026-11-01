import { BRAND } from '../brand.js';

const B = BRAND.name;
const UPDATED = 'November 1, 2026';

export const LEGAL_PAGES = {
  '/terms': {
    title: 'Terms of Service',
    updated: UPDATED,
    intro: `These Terms of Service ("Terms") govern your use of ${B} (the "Service"). By creating an account or using the Service you agree to these Terms. If you do not agree, do not use the Service.`,
    sections: [
      {
        heading: '1. The Service is free and provided as is',
        body: [
          `${B} is a free personal net worth tracking tool. We do not charge for it, and we make no promise that it will remain free, available, or unchanged. We may modify, suspend, or discontinue any part of the Service, or delete accounts, at any time and without notice.`,
          'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF ACCURACY, RELIABILITY, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        ],
      },
      {
        heading: '2. Not financial advice',
        body: [
          `${B} is an informational tool only. Nothing in the Service is investment, financial, tax, legal, or accounting advice, and we are not a broker, dealer, bank, investment adviser, or financial planner. Balances, holdings, prices, net worth figures, and charts may be delayed, incomplete, or wrong. Always verify figures with your financial institution before relying on them, and consult a qualified professional before making financial decisions.`,
        ],
      },
      {
        heading: '3. Read-only access to your accounts',
        body: [
          `When you connect a financial institution you provide an API token that you generate with that institution. ${B} uses it only to read account, balance, holding, and transaction data. The Service cannot place trades or move money. You are responsible for creating the token with the narrowest permissions available, keeping it confidential, and revoking it with your institution if you stop using the Service or suspect misuse.`,
          'Connections depend on third-party institutions and their APIs, which can change, fail, or reject your token at any time. We do not guarantee that any connection will work or stay in sync.',
        ],
      },
      {
        heading: '4. Your responsibilities',
        body: [
          'You are solely responsible for your account, your password, all activity under your account, the accuracy of data you enter manually, and any decisions you make using the Service.',
          'You agree that you will: be at least 18 years old; provide accurate information; only connect accounts that belong to you or that you are authorized to access; and comply with the terms of the financial institutions you connect.',
        ],
      },
      {
        heading: '5. Acceptable use',
        body: [
          'You agree not to: attempt to access other users\' data; probe, scan, or test the vulnerability of the Service; overload or disrupt it; use bots or scrapers without permission; reverse engineer it except where the law allows; or use it for any unlawful purpose.',
          'We may suspend or terminate your access if you violate these Terms or if we believe your use poses a risk to the Service or other users.',
        ],
      },
      {
        heading: '6. Assumption of risk and limitation of liability',
        body: [
          'You use the Service entirely at your own risk. To the maximum extent permitted by law, neither we nor our owners, operators, contributors, or service providers will be liable for any direct, indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of money, profits, data, or opportunity, arising out of or related to your use of (or inability to use) the Service. This includes losses caused by inaccurate or delayed data, sync failures, outages, security incidents, unauthorized access to your account or connected tokens, or decisions you make based on the Service.',
          'Because the Service is free, to the extent any liability cannot be excluded, our total aggregate liability to you for all claims is limited to USD $0 or the minimum amount required by applicable law, whichever is greater. Some jurisdictions do not allow certain exclusions, so parts of this section may not apply to you.',
        ],
      },
      {
        heading: '7. Indemnification',
        body: [
          `You agree to defend, indemnify, and hold harmless ${B} and its owners, operators, and contributors from any claims, damages, losses, and expenses (including reasonable legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any law or third-party right.`,
        ],
      },
      {
        heading: '8. Your data and content',
        body: [
          'You keep ownership of the data you enter or import. You give us a limited license to store, process, and display it solely to operate the Service for you. You can delete connections, accounts, and your data at any time from within the app or by contacting us. See our Privacy Policy for details.',
        ],
      },
      {
        heading: '9. Intellectual property',
        body: [
          `The Service, including its software, design, and branding, belongs to ${B} and its licensors. These Terms do not grant you any rights to it other than the limited right to use the Service as offered. Third-party names (such as financial institutions) belong to their owners and do not imply endorsement or affiliation.`,
        ],
      },
      {
        heading: '10. Termination',
        body: [
          'You may stop using the Service and delete your account at any time. We may suspend or end the Service or your access at any time. Sections that by their nature should survive termination (including 1, 2, 6, 7, and 11) will survive.',
        ],
      },
      {
        heading: '11. Governing law and disputes',
        body: [
          'These Terms are governed by the laws of the jurisdiction in which the Service\'s operator resides, without regard to conflict-of-law rules. Any dispute will be brought in the courts of that jurisdiction, and you agree to its jurisdiction, except where mandatory consumer protection laws give you the right to bring a claim elsewhere. To the extent permitted by law, you agree to bring claims only in your individual capacity and not as part of a class action.',
        ],
      },
      {
        heading: '12. Changes to these Terms',
        body: [
          'We may update these Terms from time to time. The "Last updated" date above shows the latest version. If you keep using the Service after a change, you accept the new Terms.',
        ],
      },
      {
        heading: '13. Contact',
        body: [`Questions about these Terms: ${BRAND.email}.`],
      },
    ],
  },

  '/privacy-policy': {
    title: 'Privacy Policy',
    updated: UPDATED,
    intro: `This Privacy Policy explains what information ${B} collects, how it is used, and the choices you have. We do not sell your personal information, and we do not show advertising.`,
    sections: [
      {
        heading: '1. Information we collect',
        body: [
          'Account information: your name, email address, and a hashed (never plain text) password.',
          'Financial information you provide or connect: account names, balances, holdings, positions, and transactions that you enter manually or that we import from institutions you connect, plus groups and labels you create.',
          'Institution API tokens: when you connect an institution, we store the token you provide, encrypted at rest, so we can sync your data.',
          'Messages you send us through the contact form, including your name, email, and message.',
          'Technical information: standard server logs such as IP address, browser type, and request times, used for security and troubleshooting.',
        ],
      },
      {
        heading: '2. How we use information',
        body: [
          'To provide the Service: authenticate you, sync and display your accounts and net worth, and keep your history.',
          'To keep the Service secure, prevent abuse, enforce rate limits, and troubleshoot problems.',
          'To respond to your messages and requests.',
          'To comply with legal obligations.',
          'We do not use your financial data for advertising, and we do not sell, rent, or trade it.',
        ],
      },
      {
        heading: '3. Read-only access',
        body: [
          'Connections are used to read data only. The Service cannot trade or move money. We access your institution only to import your balances, holdings, and transactions, and we sync on a schedule and when you ask.',
        ],
      },
      {
        heading: '4. How we share information',
        body: [
          'We share information only with service providers that help us run the Service (for example hosting and database providers), and the financial institutions you choose to connect. These providers may only use data to serve us.',
          'We may disclose information if required by law, legal process, or to protect the rights, safety, or security of users or the Service. If the Service is transferred or reorganized, information may transfer to the new operator.',
        ],
      },
      {
        heading: '5. Security',
        body: [
          'We use measures such as encrypted connections (TLS), hashed passwords, encrypted storage of institution tokens, secure session cookies, and rate limiting. No system is perfectly secure, and we cannot guarantee absolute security. You are responsible for choosing a strong, unique password and for revoking institution tokens you no longer want to be active.',
        ],
      },
      {
        heading: '6. Retention and deletion',
        body: [
          `We keep your information while your account is active. Disconnecting an institution removes its imported accounts, holdings, and transactions. To delete your account and remaining data, contact ${BRAND.email}. Backups and logs may persist for a limited time afterward.`,
        ],
      },
      {
        heading: '7. Your rights',
        body: [
          'Depending on where you live (for example under GDPR, UK GDPR, PIPEDA, or CCPA/CPRA), you may have the right to access, correct, delete, or export your personal information, to object to or restrict certain processing, and to withdraw consent. To exercise these rights, contact us at the address below. We will not discriminate against you for doing so.',
        ],
      },
      {
        heading: '8. Cookies',
        body: ['See our Cookie Policy for how we use cookies.'],
      },
      {
        heading: '9. Children',
        body: ['The Service is not intended for anyone under 18, and we do not knowingly collect information from children. If you believe a child has given us information, contact us and we will delete it.'],
      },
      {
        heading: '10. International transfers',
        body: ['Our providers may process data in countries other than your own. By using the Service you understand your information may be transferred to and processed in those countries.'],
      },
      {
        heading: '11. Changes',
        body: ['We may update this policy. The "Last updated" date shows the latest version. Material changes will be reflected here.'],
      },
      {
        heading: '12. Contact',
        body: [`Privacy questions or requests: ${BRAND.email}. Security issues: ${BRAND.securityEmail}.`],
      },
    ],
  },

  '/cookie-policy': {
    title: 'Cookie Policy',
    updated: UPDATED,
    intro: `This policy explains how ${B} uses cookies and similar technologies.`,
    sections: [
      {
        heading: '1. What we use',
        body: [
          'Essential session cookie: when you log in, we set a secure, HTTP-only cookie that keeps you signed in. It is necessary for the Service to work, and is removed when you log out or it expires.',
          'We do not use advertising cookies, and we do not use third-party tracking or analytics cookies.',
        ],
      },
      {
        heading: '2. Your choices',
        body: [
          'You can block or delete cookies in your browser settings, but you will not be able to stay logged in to the Service if you block the essential session cookie.',
        ],
      },
      {
        heading: '3. Contact',
        body: [`Questions: ${BRAND.email}.`],
      },
    ],
  },
};
