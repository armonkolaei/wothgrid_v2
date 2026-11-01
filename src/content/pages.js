import { BRAND } from '../brand.js';
import { LEGAL_PAGES } from './legal.js';

const B = BRAND.name;

const SECURITY_FOOTER = {
  type: 'cards',
  icon: '🛡️',
  title: 'Security is Paramount',
  cols: 3,
  items: [
    {
      title: 'SOC 2 Type II Compliant',
      text: 'Our SOC 2 Type II report covers controls relevant to security and availability. We undergo regular third-party audits to maintain this standard.',
    },
    {
      title: 'Data Secured With AES-256 Encryption',
      text: "We encrypt all in-transit data using TLS 1.2 or higher. Database administrators don't have access to the encryption keys used.",
    },
    {
      title: 'Industry-Leading Cloud Providers',
      text: 'Our secure infrastructure is hardened against the most sophisticated types of attacks. We perform regular automated and manual application security testing.',
    },
  ],
};

const apiCta = (label = 'Talk to our Team') => ({
  type: 'cta',
  title: 'Get access to the strongest API for financial aggregation.',
  label,
  to: '/contact?product=api',
});

const techFoundation = (items) => ({
  type: 'cards',
  title: 'Technical Foundation',
  subtitle: 'Enterprise-grade infrastructure for modern finance.',
  cols: 3,
  items,
});

const advantage = (title, items) => ({ type: 'cards', eyebrow: `The ${B} Advantage`, title, cols: 2, items });

export const FREE_BLOCK = {
  type: 'text',
  eyebrow: 'Free, as is',
  title: 'Use it at your own risk',
  body: [
    `${B} is provided free of charge and "as is", with no warranty. It is an informational tool, not financial advice, and figures may be delayed or inaccurate. You are responsible for how you use it and for any decisions you make. See the Terms of Service for details.`,
  ],
};

const plansCta = {
  type: 'cta',
  title: `Questions about ${B}?`,
  label: 'Talk to our Team',
};

export const PAGES = {
  '/how-it-works': {
    title: 'How it Works',
    blocks: [
      { type: 'hero', title: 'Say Goodbye to Data Entry', subtitle: 'We simplify your financial life.' },
      {
        type: 'steps',
        items: [
          { title: 'Sign Up Free', text: "First, sign up. You'll be ready to go in no time." },
          { title: 'Link your Accounts', text: `${B} automatically imports your data from linked accounts. You can add valuable assets manually.` },
          { title: 'It syncs daily', text: `Each day, ${B} connects to your financial institution and syncs your balances, holdings and transactions.` },
        ],
      },
      { type: 'text', title: 'Relax, sit back and let us do all the hard work while you grow your wealth.' },
      { type: 'text', eyebrow: 'Dashboard', title: 'See All Accounts in One Place', body: ['“All holdings, across various accounts and institutions on one screen. It’s financial wizardry.”'] },
      {
        type: 'split',
        title: 'Your net worth with you, wherever you are',
        body: [`${B} is an app that makes it easy to track your net worth and keep a historical view of how it evolved. It allows you to easily focus on the big picture while enabling you to track your progress towards your financial or retirement goals. The ${B} Mobile App is the perfect companion to ${B}’s web dashboard.`],
      },
      {
        type: 'split',
        flip: true,
        title: 'An up-to-date balance sheet for the whole family',
        body: ['Get an overall snapshot of your wealth at a specific period in time. Create groups or family members and automatically generate your personal and family balance sheet. Assign accounts and assets to family members and track the whole family’s net worth easily.'],
      },
      {
        type: 'split',
        title: 'Measure your progress to reach your financial goals',
        body: [`With historical data and event annotations, ${B} allows you to see how your net worth and investment portfolio evolves over weeks, months and years. ${B} saves and archives your transaction and balance history forever even when you switch or transfer to a new bank or brokerage.`],
      },
      {
        type: 'split',
        flip: true,
        title: 'Export your consolidated data for enhanced reporting or taxes',
        body: ['Export your transactions, holdings and balances to your own Google Sheet or Excel Spreadsheet in one click and build your own enhanced reports. Export your portfolio holdings to CSV and import it back into Yahoo! Portfolio or your preferred portfolio tracker for real time portfolio tracking.'],
      },
      {
        type: 'split',
        title: 'Analyze your portfolio and accurately assess fees',
        body: [`Investment fees quickly add up. Management fees, transaction fees, custodian fees. ${B} allows you to analyze and track how fees will affect your portfolio performance over time. Review the strengths and weaknesses of your current investments one account at a time, or group accounts together for a big picture analysis. Compare your accounts performance and fees across your different financial institutions.`],
      },
      {
        type: 'split',
        flip: true,
        title: 'Track your expenses, build a simple budget',
        body: ['You can track your monthly income and spendings, categorize these spendings and income transactions, control your budget and set goals for each category. Know how you spend your money to more effectively control your personal finance and plan for regular savings or debt repayments.'],
      },
      { type: 'cta', title: 'Ready to simplify your financial life?', label: 'Get Started', to: '/signup' },
    ],
  },

  '/security': {
    title: 'Security',
    blocks: [
      { type: 'hero', title: 'We know that security is paramount', subtitle: 'We are committed to protecting your data and privacy' },
      {
        type: 'cards',
        cols: 3,
        items: [
          { icon: '🛡️', title: 'Protecting your Data', text: `${B} reads and saves your banking and investing data to build a visual dashboard of all your financial investment. ${B} is strictly read-only. Trading, fund withdrawals, money transfers or other transactions are not possible through the platform to keep your money safe.` },
          { icon: '🔒', title: 'Safe and Secure Technology', text: 'We use cloud services provided by Amazon Web Services (AWS) and managed by a team with over 20 years of experience in the web hosting industry. AWS’ data centres are certified ISO 27001, SOC 2 (Type II), PCI DSS (Level 1), FISMA.' },
          { icon: '📡', title: 'Constant Security Testing', text: 'We monitor continuously and run daily vulnerability scans on our website and apps to ensure continuous security.' },
        ],
      },
      { type: 'split', number: 1, title: 'Bank-Level Security', body: [`We secure your data with AES-256 encryption, the same rigorous standards used by banks. We also encrypt all in-transit data using the latest TLS 1.2 technology. The credentials you entrust us are encrypted, and none of our employees can access them. Our database administrators don't have access to the encryption keys used. You can always get in touch with our security team at ${BRAND.securityEmail} to report any issue, concern or ask security related questions.`] },
      { type: 'split', number: 2, flip: true, title: 'Secure Authentication', body: [`We support two factor authentication in your ${B} account for enhanced security. When enabled, a security PIN is sent to your smartphone or authentication app to authorize login from a new device. That way, with your ${B} credentials alone, it's impossible to access your financial information.`] },
      { type: 'split', number: 3, title: 'No one will see your data', body: [`No one on the ${B} team will see your private data unless you specifically choose to share data with the support team. To protect your privacy further, when enabled, private mode prevents over-shoulder snooping by hiding all numbers and just shows changes in percentages.`] },
      { type: 'split', number: 4, flip: true, title: 'Committed to your privacy', body: [`${B} will never sell, publish or share any identifiable personal information to third parties. ${B} maintains compliance with privacy laws like the California Consumer Privacy Act (CCPA), the Canadian PIPEDA and the European GDPR. We enforce many documented policies to support our commitment towards data privacy.`] },
      { type: 'split', number: 5, title: 'Industry-leading security', body: [`SOC for Service Organizations are internal control reports on the services provided by a service organization, providing valuable information that users need to assess and address the risks associated with an outsourced service. ${B} is SOC2 Type 2 compliant and goes under regular audits.`] },
      { type: 'split', number: 6, flip: true, title: 'Control in your hands', body: [`After connecting your investment accounts to ${B}, you can easily review new transactions across all your accounts. You can choose to receive (or not) a daily review of new transactions by email or by using the app, making it easy to detect any suspicious activity and monitor your accounts. You will always receive a notification whenever there is a login from a new location. Finally, you can delete your account in one click from preferences. It’s unrecoverable and all your data will be completely deleted from our systems.`] },
      {
        type: 'faq',
        title: 'How do you collect my financial data?',
        intro: `${B} is a strictly read-only platform. You cannot trade, withdraw funds, transfer money or conduct any other transactions through it. We establish a secure connection between ${B} and your financial institution, using API authorization or your credentials to retrieve your investment portfolio and collect your financial data.`,
        items: [
          { q: `${B} will always favor API authentication`, a: "When available, we favor API authentication to connect to your financial accounts since you don't have to share your account credentials. It is considered, by industry standards, to be the best and most secure method." },
          { q: 'Security questions, 2-factor authentication and transaction PINs protect you further', a: 'In most cases, your credentials are needed to establish a secure connection with your financial institution. We never store the answers to your security questions and never ask for transaction PINs. Someone stealing your credentials and attempting to login from a new device won’t be able to login without your security answers and 2-factor auth code.' },
          { q: 'Partnering with industry leaders to protect your data', a: 'We partner with top security firms to offer you high-grade protection for your data, including aggregation leaders like Yodlee/Envestnet and Plaid, which are used by hundreds of financial institutions and fintech applications worldwide.' },
          { q: 'Why do you need my brokerage credentials?', a: `Your credentials are needed to establish a secure connection between ${B} and your financial institution. This allows us to collect your financial data and build your dashboard and reports.` },
          { q: 'Do you sell my personal information?', a: 'No. Your security and the protection of your personal information are our priority. We never sell, publish or share identifiable personal information.' },
        ],
      },
      { type: 'text', title: 'Report Security Issues or Questions', body: [`You can get in touch with our security team at ${BRAND.securityEmail} to report any issues, concerns or ask security related questions.`] },
    ],
  },

  '/family-office': {
    title: 'Family Office Edition',
    blocks: [
      { type: 'hero', quote: 'Incredible, amazing and useful!', title: `${B} Family Office Edition`, subtitle: 'A Unified View of Your Families Wealth', cta: { label: 'Get Started', to: '/contact?product=family' } },
      { type: 'features', title: 'Delight Family Members with a Family Finance Dashboard' },
      { type: 'split', eyebrow: 'Reports', title: 'Effortless consolidated reporting for your family.', body: [`Effortlessly view your family’s total net worth online. ${B} automatically aggregates and updates your data daily from multiple custodians or investment managers, including private investments, family businesses, and valuable assets—perfect whether you manage wealth yourself or with advisors.`] },
      { type: 'split', flip: true, eyebrow: 'Inventory', title: 'Easily inventory assets and simplify generational wealth transfer.', body: [`Track and value all your assets—from investments, real estate, vehicles, and collectibles to life insurance, retirement plans, and business ownership. ${B} helps you inventory assets, track holders, and share wealth knowledge, making family succession planning smooth, easy, and engaging. Nothing is overlooked.`] },
      { type: 'text', title: '“Owning and managing significant wealth does not have to be difficult.”' },
      { type: 'split', eyebrow: 'Tools', title: 'One tool to report, share, and archive.', body: [`Simplify generational wealth management and reporting. ${B} consolidates transactions, providing easy, transparent financial data exports to Excel or Quickbooks Online.`] },
      { type: 'split', flip: true, eyebrow: 'Communication', title: 'Ensure clear, regular communication.', body: [`${B} clearly communicates your family’s net worth, investment allocation, income, and expenses, transforming your family office reporting.`] },
      { type: 'text', body: ['Gathering, reconciling, and updating asset holdings and transactions data manually can consume a significant amount of time and resources.', `${B} automatically retrieves and updates financial data from multiple sources, eliminating the need for manual intervention, reducing the risk of errors and ensuring data integrity.`] },
      { type: 'checklist', items: ['Support for More Than 20,000+ Financial Institutions Worldwide', 'Connect 19,000+ with Yodlee', 'Connect 100+ Crypto Currency wallets with Vezgo', 'Connect instantly to 6,000+ apps across 150+ chains with WalletConnect'] },
      { type: 'split', eyebrow: 'For Professionals', title: 'A Foundational Tool', body: [`${B} is emerging as an integral component for Family Offices, because consolidating information into a unified view provides Family Offices with an intimate and comprehensive overview of their wealth holdings.`] },
      plansCta,
    ],
  },

  '/advisor': {
    title: 'For Financial Advisors',
    blocks: [
      { type: 'hero', quote: 'Incredible, amazing and useful!', title: 'Become your clients’ go-to hub', subtitle: 'Deliver transparent, modern experience.', cta: { label: 'Get Started', to: '/contact?product=advisor' } },
      { type: 'split', eyebrow: 'Collaboration', title: 'From Advisor to Wealth Partner', body: ['Your clients can share a 360-degree view of all their assets and liabilities. Having access to a client’s entire financial profile – what they have, where it is, how one account relates to another – provides invaluable insight and allows an advisor to leverage that knowledge to deliver comprehensive financial advice.', 'You’re invited: let your clients empower you with their full financial picture. They can send you an invitation, and you will be able to access your client\'s dashboard to have a view of their complete net worth, investment portfolio and valuable assets.'] },
      { type: 'split', flip: true, eyebrow: 'Collaboration', title: 'Give your clients a friendly dashboard with your branding and logo', body: [`Give your clients access to a complete and user friendly dashboard integrating all of their financial accounts. Get your own whitelabeled version of the Web and/or Mobile ${B} dashboard apps, customized for you.`] },
      { type: 'split', eyebrow: 'Tools', title: 'A Wealth of Insights', body: [`Access comprehensive client reports—from income and risk to holdings, performance, and gains. ${B} helps you quickly spot underperforming assets, managed or not.`] },
      { type: 'split', flip: true, eyebrow: 'Communication', title: 'Give better advice', body: [`Get a complete view of your client's net worth to deliver smarter, personalized advice. ${B} helps you plan strategically, improve transparency, and reach goals faster.`] },
      { type: 'checklist', title: 'Everything in Basic plus:', items: ['Custom Connectivity and Features', 'Enhancements to Report', 'Personalised follow ups', 'And more!'] },
      { type: 'cta', title: `Questions about ${B}?`, label: 'Talk to our Team', to: '/contact?product=advisor' },
    ],
  },

  '/institutional-partner': {
    title: 'For Institutions',
    blocks: [
      { type: 'hero', eyebrow: `${B} for financial institutions`, title: 'Fully Integrated Dashboard and 360 View for Institutional Partners', cta: { label: 'Get in touch with sales', to: '/contact?product=whitelabel' } },
      { type: 'split', title: 'Drop our whitelabeled module into your app or banking portal', body: ['We deliver a customized dashboard that fits your brand, focussed on your own brands’ divisions or consolidating hundreds of investment or bank accounts. Your users will be able to connect their accounts and add their assets to build their own 360° personal finance dashboard.', `${B}'s white label solution offers a customized dashboard and 360 View branded with your logo and fully integrated into your platform.`] },
      { type: 'text', title: 'Become a primary financial hub with a complete dashboard integrating all of your clients financial accounts', body: ['Because our dashboard enables individuals to see all of their financial accounts in one place, it\'s among the best methods an institution can use to become a primary financial hub.'] },
      { type: 'split', flip: true, title: 'A Wealth of Insights', body: ['We aggregate every ownable asset giving your clients a true 360 view of their financial lives — from income sources and risk exposure to distribution of holdings, consolidated performance and realized gains.'] },
      { type: 'split', title: 'Empower the wealth management process', body: [`Gain access to a holistic view of your client's net worth to provide personalized and strategic advice and to deliver impactful financial planning. ${B} empowers you to give better advice, establish a better mix of assets and set appropriate goals. That’s not all, you’ll offer better transparency and reach your clients’ benchmarks faster.`] },
      { type: 'checklist', title: 'Everything in Basic plus:', items: ['Custom Connectivity and Features', 'Enhancements to Report', 'Personalised follow ups', 'And more!'] },
      { type: 'cta', title: `Questions about ${B}?`, label: 'Talk to our Team', to: '/contact?product=whitelabel' },
    ],
  },

  '/investment-api': {
    title: 'Investment API',
    blocks: [
      { type: 'hero', eyebrow: `${B} Business`, title: 'Connect to over 150 Canadian financial institutions with the Worth Grid Investment API', subtitle: 'The Most Solid API for Canadian Financial Aggregation. One API - All Canadian Financial Institutions, Brokerages and Investment Platforms. SOC 2 Type II Compliant. Trusted by Canadian institutions and FinTechs.', cta: { label: 'Schedule a Demo', to: '/contact?product=api' } },
      { type: 'split', eyebrow: 'For FinTechs & Financial Institutions', title: 'Access 150+ Canadian Financial institutions & Brokerages', body: ['Allow your clients to connect their financial accounts to your app to obtain a 360-degree view of their financial lives. See the full list of supported institutions.', 'Retrieve investment positions, balances, securities, and transactions.'], link: { label: 'Supported institutions', to: '/integrations' } },
      { type: 'split', flip: true, eyebrow: 'For Financial Institutions', title: 'Streamline the Registered Asset Transfers for your clients', body: ['Make it easy for clients to bring in their investments from other financial institutions.', 'Collect all the information to fill out the T2033/ATON forms.'] },
      { type: 'cards', eyebrow: 'Seamless Integration', title: 'Integrate in Just 7 Days with Developer-Ready APIs & SDK', subtitle: `Our SDK provides plug-and-play access to ${B}, enabling fast, seamless financial data aggregation.`, cols: 3, items: [
        { icon: '🔌', title: 'Unified API', text: 'One API with 150+ Canadian financial Institutions, brokerages, wealth and investment platforms.' },
        { icon: '🟩', title: 'Node.js SDK', text: `Easily integrate ${B}'s APIs into your applications and access to financial accounts with minimal setup.` },
        { icon: '🧩', title: 'Drop-In Widget', text: 'Plug in our Connect Widget, skip custom integration development.' },
      ] },
      SECURITY_FOOTER,
      apiCta('Talk to our Team'),
    ],
  },

  '/use-cases/canadian-wealth-data-api': {
    title: 'Account Data Access',
    blocks: [
      { type: 'hero', eyebrow: `${B} Business`, title: 'The Single Source of Truth for Canadian Wealth', subtitle: 'Power your platform with the most comprehensive investment data engine in Canada. The API bridges the gap between siloed bank accounts and complex portfolios, delivering the structured, high-fidelity data required to build institutional-grade wealth experiences.', cta: { label: 'Talk to our Team', to: '/contact?product=api' } },
      { type: 'cards', eyebrow: 'High-Impact Use Cases', title: 'One API. Every Vertical.', subtitle: "Our data doesn't just show a balance—it powers the core logic of your application.", cols: 2, items: [
        { title: 'Unified Wealth Dashboards (360° View)', text: 'Build the "Single Pane of Glass." Aggregate net worth across multiple brokerages, banks, and private holdings to become your user\'s primary financial command center.' },
        { title: 'Portfolio & Risk Analytics', text: 'Run institutional-grade performance and risk modeling. Pull real-time holdings (tickers and quantities) to provide automated stress testing, Sharpe ratios, and asset allocation benchmarks.' },
        { title: 'Tax & Cost Basis Automation (ACB Tracking)', text: 'Solve the most painful part of Canadian investing. Automate the tracking of every transaction to accurately calculate Adjusted Cost Base for non-registered accounts.' },
        { title: 'Compliance Monitoring', text: 'For RegTech and institutional compliance, automate the monitoring of employee personal trading accounts. Replace manual statement uploads with a direct feed to flag conflicts of interest instantly.' },
        { title: 'Fee Transparency', text: 'Show users what they are actually paying. Identify hidden MERs and management costs across their entire portfolio to prove the value of your lower-cost alternatives.' },
        { title: 'Alternative Assets & Private Equity', text: 'Bridge the gap between public and private markets. Track "un-bankable" assets—Private Equity, Real Estate, and Venture Capital—alongside liquid stocks.' },
        { title: 'KYC Refresh & Investor Profiling', text: 'Instead of asking clients to self-report, use aggregated data to verify current holdings and streamline the annual KYC refresh process automatically.' },
        { title: 'Estate Planning & Digital Vaults', text: 'Enable the "Digital Will." Maintain a live, up-to-date inventory of all financial assets for executors and beneficiaries across all 150+ institutions.' },
      ] },
      advantage('Built for the Canadian Financial Landscape', [
        { title: 'Unrivaled Canadian Depth', text: 'Covers all the main brokerages of the Big Five FIs and major independent wealth firms where the vast majority of Canadian assets are actually held.' },
        { title: 'Deep Metadata Fidelity', text: "Doesn't just \"cleanse\" transaction strings. It retrieves the DNA of the account: tickers, quantities, book values, and specific security identifiers." },
        { title: 'Hybrid Sync Architecture', text: 'Our engine balances automated daily syncs with client-triggered manual refreshes to ensure your data is as fresh as your users require.' },
        { title: 'Permanent Data Sovereignty', text: 'Transaction history is archived indefinitely. Your app maintains a continuous record even if the user closes an account or the bank purges its online history.' },
      ]),
      techFoundation([
        { title: 'White-Label Connect Widget', text: "A drop-in module that handles the complex MFA of Canadian banks so you don't have to." },
        { title: 'Institutional Security', text: 'SOC 2 Type II Compliant with a Privacy by Design policy.' },
        { title: 'Structured JSON', text: 'Normalized data across all supported institutions.' },
      ]),
      SECURITY_FOOTER,
      apiCta(),
    ],
  },

  '/use-cases/asset-transfer-onboarding': {
    title: 'Asset Transfers',
    blocks: [
      { type: 'hero', eyebrow: `${B} Business`, title: 'Streamline Asset Transfers. Accelerate AUM Growth.', subtitle: 'Optimize your institutional onboarding workflow. The API automates the data collection required to pre-populate T2033 and ATON forms, reducing the friction that leads to abandoned transfers and administrative errors. Move your clients from intent to invested by eliminating the manual data entry that causes operational delays.', cta: { label: 'Talk to our Team', to: '/contact?product=api' } },
      { type: 'cards', eyebrow: 'High-Fidelity Data for Institutional Transfers', title: 'Precision-Engineered for the Canadian Regulatory Landscape', cols: 3, items: [
        { title: 'Automated Form Pre-Filling', text: 'Retrieve account numbers and institution codes directly from the source to generate transfer documents efficiently.' },
        { title: 'Account Type Recognition', text: 'Instantly identify TFSA, RRSP, LIRA, or FHSA plan types to ensure funds are directed to the correct tax-sheltered destination.' },
        { title: 'Security-Level Verification', text: 'Access position-level data including tickers and quantities before the move begins to verify holdings.' },
      ] },
      advantage('Built for the sophisticated requirements of Canadian brokerages.', [
        { title: 'Comprehensive Market Access', text: 'Connectivity to 150+ institutions, including the Big Five banks and boutique wealth firms where the vast majority of Canadian assets are held.' },
        { title: 'Data Accuracy at the Source', text: 'By fetching data directly from the bank portal, you eliminate the manual typos that lead to transfer rejections.' },
        { title: 'Institutional Privacy Standards', text: 'Once a transfer is confirmed, the connection can be removed to satisfy stringent compliance requirements.' },
        { title: 'Trusted Industry Infrastructure', text: 'Replace the manual "upload and wait" period with a 90-second verification.' },
      ]),
      techFoundation([
        { title: 'Verified Account Metadata', text: 'Feed high-fidelity details—including positions, balances, and transaction history—directly into your onboarding suite.' },
        { title: 'SOC 2 Type II Compliant', text: 'An "Investment-First" data engine designed specifically for the security standards of Canadian financial institutions.' },
        { title: 'Rapid Integration', text: "Deploy a white-label \"Connect Widget\" that manages complex MFA requirements while maintaining your firm's branded experience." },
      ]),
      SECURITY_FOOTER,
      apiCta(),
    ],
  },

  '/use-cases/loan-asset-verification': {
    title: 'Loan Approvals',
    blocks: [
      { type: 'hero', eyebrow: `${B} Business`, title: 'Accelerate Loan Approvals with Instant Asset Verification', subtitle: 'Eliminate the "statement chase" from your lending workflow. The API provides lenders with real-time, verified data on a borrower’s investment accounts, savings, and total net worth. Reduce time-to-close by replacing manual document collection with a secure, digital handshake.', cta: { label: 'Talk to our Team', to: '/contact?product=api' } },
      { type: 'cards', eyebrow: 'High-Fidelity Data for Mortgage & Loan Underwriting', title: 'Precision-engineered for modern credit risk assessment.', cols: 2, items: [
        { title: 'Instant Down Payment Verification', text: 'Securely confirm the presence and source of funds for down payments across 150+ Canadian institutions.' },
        { title: 'Real-Time Account Balances', text: "Access current, verified balances for investment accounts, savings, and GICs to assess a borrower's liquidity instantly." },
        { title: 'Verified Holding Analysis', text: "Review position-level data, including tickers and quantities, to understand the volatility and quality of a borrower's underlying assets." },
        { title: 'Historical Transaction Flow', text: 'Audit investment transactions and dividends to verify consistent income streams and wealth accumulation patterns.' },
        { title: 'Consolidated Net Worth View', text: "View a borrower's total financial picture—including \"held-away\" assets at boutique brokerages—to improve debt-to-equity ratio accuracy." },
        { title: 'Ownership Authentication', text: 'Instantly verify that account holder names match the loan application, reducing the risk of fraudulent documentation.' },
        { title: 'Automated Data Refresh', text: "Maintain a continuous connection to the borrower’s accounts to verify that funds remain in place until the loan or mortgage closes." },
      ] },
      advantage('Built for the rigorous standards of Canadian lending.', [
        { title: 'Comprehensive Canadian Coverage', text: 'Connectivity to all Big Five banks and the independent wealth firms where high-net-worth borrowers hold their capital.' },
        { title: 'Superior Data Integrity', text: 'By pulling data directly from the financial institution, you eliminate the risk of altered or forged PDF statements.' },
        { title: 'Enhanced Borrower Experience', text: 'Offer your clients a modern, digital onboarding process that replaces days of manual document gathering with a 90-second connection.' },
        { title: 'Institutional Security & Privacy', text: 'SOC 2 Type II compliance and policies ensure that sensitive borrower information is handled with institutional-grade oversight.' },
      ]),
      techFoundation([
        { title: 'Verified Asset Metadata', text: 'Feed structured JSON data—including balances, securities, and transactions—directly into your underwriting or CRM system.' },
        { title: 'White-Label Connect Widget', text: 'Deploy a branded interface that manages complex MFA requirements while maintaining a seamless user experience.' },
        { title: 'Hybrid Sync Architecture', text: 'Automated daily updates and the ability to trigger a manual refresh for final pre-closing verification.' },
      ]),
      SECURITY_FOOTER,
      apiCta(),
    ],
  },

  '/use-cases/open-banking-api': {
    title: 'Open Banking',
    blocks: [
      { type: 'hero', eyebrow: `${B} Business`, title: "Canada's Open Banking Law Is Here. Is Your Institution Ready?", subtitle: `Open Banking in Canada: the Canadian Senate has passed Bill C-15. Financial institutions must now open their data APIs to consumers and third-party providers. Those who don't act risk being left behind. ${B} is your fastest, safest path to compliance.`, cta: { label: 'Talk to our Team', to: '/contact?product=api' } },
      { type: 'text', eyebrow: 'Government of Canada, Bill C-15, 2026', quote: '“Completing the consumer-driven banking legislative framework to allow Canadians and businesses to securely share their financial data with third-party providers and give consumers clearer choices and better tools to manage their finances.”' },
      { type: 'stats', items: [
        { value: '100+', label: 'Canadian financial institutions already connected' },
        { value: '$49B+', label: 'In aggregated assets on platform' },
        { value: 'FDX', label: 'API standards compliant' },
        { value: 'SOC2', label: 'Type II audited & enterprise-grade security' },
      ] },
      { type: 'faq', eyebrow: 'Open Banking in Canada', title: 'What Is Open Banking and What Does Bill C-15 Require?', intro: "A plain-language overview of Canada's consumer-driven banking framework and what it means for financial institutions of every size.", items: [
        { q: 'What is open banking?', a: 'A framework that gives consumers the legal right to share their financial data with authorised third parties through secure, standardised APIs.' },
        { q: 'What is Bill C-15 and what did it change?', a: 'Passed by the Canadian Senate in March 2026, Bill C-15 gives Canada its first statutory foundation for consumer-driven banking, empowering the Bank of Canada to begin implementing open finance rules.' },
        { q: 'What does compliance look like in practice?', a: 'Institutions need a secure, FDX-aligned API that lets customers consent to and control their own data sharing. OAuth 2.0 authentication and consumer consent flows are the baseline requirements.' },
        { q: 'Do institutions have to build this themselves?', a: 'No. The legislation requires the outcome, not the method. A compliant third-party open banking API meets the obligation without the multi-year internal build.' },
      ] },
      { type: 'checklist', eyebrow: 'The Challenge', title: 'Open Banking Compliance Is Not Optional.', body: ['Bill C-15 establishes a legal framework for consumer-driven finance in Canada. For financial institutions of every size, that means one thing: you now need a secure, standards-compliant API that allows your customers to share their financial data.', 'For large banks with deep engineering teams, this is a years-long project. For credit unions, community banks, brokerages, and fintechs, it can feel like a mountain with no clear path up.'], items: [
        'Building a compliant open banking API in Canada takes 12 to 24 months and significant engineering investment',
        "Navigating FDX standards, OAuth flows, and security requirements demands specialized expertise most institutions don't have in-house",
        "Siloed systems mean your customers can't get the consolidated financial view they're now legally entitled to",
        'Falling behind on open banking doesn\'t just mean non-compliance. It means losing customers to institutions that get there first',
      ] },
      { type: 'checklist', title: 'The institutions that move first will', items: ['Become a primary financial hub for their customers', 'Unlock data partnerships with 100+ connected institutions', 'Offer customers a true 360° view of their financial lives', 'Differentiate in a market where loyalty is up for grabs'] },
      { type: 'text', eyebrow: `The ${B} Solution`, title: "Don't Build an API. Use Ours.", body: [`${B} has already done the heavy lifting. We are Canada's most connected open banking API, FDX-compliant and already plugged into over 100 financial institutions. Instead of starting from zero, plug into the network that's already built.`, "Your Open Banking API, deployed in weeks: skip the years-long build. Our SDK delivers a plug-and-play integration."] },
      SECURITY_FOOTER,
      apiCta(),
    ],
  },

  '/about-us': {
    title: 'About Us',
    blocks: [
      { type: 'hero', title: `Hello from ${B}` },
      { type: 'text', body: [`We started ${B} to challenge the status quo of financial institutions and portfolio advisors. With the dream of simple consolidated investment reports, ${B} was born.`, 'Today, we run the most powerful Investment Financial Tracker and Budgeting tool including advanced analysis and reporting to master all the dimensions of your financial life.', `We’re a team of Fintech passionate that sincerely hope you’ll love ${B} as much as we do!`] },
      { type: 'text', title: `${B} empowers investors to make better financial decisions`, body: [`${B} provides innovative financial apps and services to empower consumers to make better financial decisions, and to take fuller control over their financial lives.`] },
      { type: 'text', title: 'Any question? Contact us!', body: [`Email us at ${BRAND.email} or send us a message from the contact page.`] },
      { type: 'cta', title: 'We would love to hear from you', label: 'Contact us', to: '/contact' },
    ],
  },

  '/budget': {
    title: 'Budgets',
    blocks: [
      { type: 'hero', eyebrow: `Do Your Budget with ${B}`, title: 'Optimize your spending to focus on savings', cta: { label: 'Get Started', to: '/signup' } },
      { type: 'split', title: 'The Budget Wizard', body: [`${B}’s Budget Wizard is a free personal finance tool that lets you instantly track your expenses. You can track your monthly income and spendings, categorize these spendings and income transactions, control your budget and set goals for each category. Know how you spend your money to more effectively control your personal finance. It’s just one click away after you login to ${B}.`] },
      { type: 'split', flip: true, title: 'The Budget Spreadsheet', body: [`You have your own budget spreadsheet and you like your finance tools to be customizable? ${B} makes it easier for you to maintain your personal finance spreadsheet with automated synchronization with your bank. ${B} eliminates data entry so you can manage your budget or personal finance in a spreadsheet 100X faster.`] },
      { type: 'split', title: 'The Budget Templates', body: [`Automate your preferred budget templates like magic. Using the Google Spreadsheet Export Power Up or Microsoft Excel Export Power Up or App, ${B} will work with all the most popular budget spreadsheet templates you can find online. You just need to link your transactions export to your preferred spreadsheet template and everything will update automatically.`] },
      { type: 'cta', title: "You'll fall in love with spreadsheets all over again", label: 'Get Started', to: '/signup' },
    ],
  },

  '/export-to-spreadsheet': {
    title: 'Financial Spreadsheets',
    blocks: [
      { type: 'hero', eyebrow: `${B} for your financial spreadsheet`, title: 'Your investments, transactions and holdings in a spreadsheet, automatically updated each day.', cta: { label: 'Get Started', to: '/signup' } },
      { type: 'split', title: `${B} syncs with Google Sheets or Microsoft Excel. It’s your choice!`, body: ['“The Google Sheet Export allows me to update my spreadsheet countless times, error free and I then use pivot tables for my own dashboard.”'] },
      { type: 'split', flip: true, title: 'Eliminate data entry and save time with automated updates, each day', body: [`Once all your banking and investment accounts are connected to ${B}, you can get a full overview of your financial positions and easily compare the performance across different investment portfolios. All the data is updated each day after ${B} is done syncing with your financial institutions.`] },
      { type: 'text', title: 'You’ll Fall in Love with Spreadsheets All Over Again', body: ['Whether you need to update your Financial Spreadsheet, track your transactions in a Budget Spreadsheet or keep your Stock Portfolio Spreadsheet in sync with your brokerage, we’ve got you covered.'] },
      { type: 'steps', items: [
        { title: `Sign Up for ${B}`, text: 'Create your free account in minutes.' },
        { title: 'Link your accounts', text: 'Connect your banks and brokerages.' },
        { title: 'Sync to your spreadsheet', text: 'Pick Google Sheets or Excel and your data updates automatically.' },
      ] },
      { type: 'cta', title: 'Start syncing today', label: 'Get Started', to: '/signup' },
    ],
  },

  '/developers': {
    title: 'Developers',
    blocks: [
      { type: 'hero', title: `${B} for Developers and Fintech Apps`, subtitle: `Open Source Library, ${B} Connect or full API integration.`, cta: { label: 'Get in Touch', to: '/contact?product=api' } },
      { type: 'split', title: `Build your own Power Ups using the ${B} JS library`, body: [`The easiest way to get going is by having a look at our JavaScript library which allows you to extend the ${B} web app and develop your own features for the ${B} user base. Extending ${B} or building custom reports and add-ons is available for free. After review, we can also make your add-on available under the Power-Up section.`] },
      { type: 'cards', title: 'Power-Up examples', cols: 3, items: [
        { title: 'Portfolio analytics', text: 'Powerful analytics to help you better manage your investment portfolios' },
        { title: 'P/L Timeline Tracker', text: 'Compare your portfolio value against the deposits made by you…' },
        { title: 'Yahoo Finance Export', text: 'Export your stock positions to Yahoo Finance.' },
        { title: 'Portfolio rebalancing', text: 'Helps you keep your investments balanced. Just set a target…' },
        { title: 'Microsoft Excel Export', text: 'Export your data directly to Microsoft Excel.' },
        { title: 'Paper Growth', text: 'A simple tool to help keep your portfolio balanced.' },
      ] },
      { type: 'split', flip: true, eyebrow: `${B} Connect`, title: 'Empower your apps with aggregated financial data', body: [`${B} collects and aggregates the user’s financial data, holdings and transactions and provides a complete data toolkit so you can focus on your app features, not collecting the user data. Once the user connects their account and authorizes access, you can use the API to manipulate the user data within your own app.`] },
      { type: 'text', eyebrow: `${B} API`, title: 'Full API Access to all Canadian Wealth Institutions', body: ['Let users directly connect their investment accounts from over 150 platforms. Gain an overview of their accounts, positions, securities and more.', `Get in touch with the team at ${BRAND.salesEmail} for pricing and details.`] },
      { type: 'cta', title: 'Ready to build?', label: 'Contact sales', to: '/contact?product=api' },
    ],
  },

  '/pricing': {
    title: 'Pricing',
    blocks: [
      { type: 'hero', eyebrow: 'Free to use', title: `${B} is free`, subtitle: 'No subscription, no trial, no credit card.' },
      FREE_BLOCK,
      { type: 'cta', title: 'Create your free account', label: 'Get Started', to: '/signup' },
    ],
  },

  '/integrations': {
    title: 'Supported Institutions',
    blocks: [
      { type: 'hero', title: 'Supported Institutions', subtitle: `${B} currently connects to Questrade with a read-only API token. More institutions may be added over time.` },
      { type: 'logos', title: 'Available now', items: ['Questrade'] },
      { type: 'cta', title: "Don't see your institution?", label: 'Contact us', to: '/contact' },
    ],
  },
};

for (const [path, { title, updated, intro, sections }] of Object.entries(LEGAL_PAGES)) {
  PAGES[path] = {
    title,
    blocks: [
      { type: 'hero', title, subtitle: `Last updated ${updated}` },
      { type: 'legal', intro, sections },
    ],
  };
}

export const HOME_FEATURES = [
  'Unlimited Transaction History',
  'Your Family’s One Page Report Card',
  'Export to Excel, Google Sheets or Yahoo Finance',
  'Share With Your Trusted Advisor',
  'Accurately Assess Fees',
  'Unbiased Portfolio Analysis',
  'Secure Your Financial Life',
  'Capital Gains (ACB) and Income',
];
