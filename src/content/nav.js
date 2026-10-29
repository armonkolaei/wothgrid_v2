export const NAV = [
  { label: 'How it Works', to: '/how-it-works' },
  { label: 'Security', to: '/security' },
  {
    label: 'For Professionals',
    items: [
      { title: 'For Family Offices', text: 'Delight Family Members with a Family Finance Dashboard', to: '/family-office' },
      { title: 'For Financial Advisors', text: 'Become the central point of your clients', to: '/advisor' },
      { title: 'For Institutions', text: '360 View for Institutional Partners', to: '/institutional-partner' },
    ],
  },
  {
    label: 'Investment API',
    items: [
      { title: 'Investment API', text: 'Financial Data Aggregation beyond custodians', to: '/investment-api' },
      { heading: 'Use Cases' },
      { title: 'For Account Data Access', text: 'The Single Source for all Financial Institutions', to: '/use-cases/canadian-wealth-data-api' },
      { title: 'For Asset Transfers', text: 'Streamline Asset Transfers. Accelerate AUM Growth.', to: '/use-cases/asset-transfer-onboarding' },
      { title: 'For Loan Approvals', text: 'Accelerate Loan Approvals with Instant Asset Verification', to: '/use-cases/loan-asset-verification' },
      { title: 'For Open Banking', text: 'Bill C-15 Compliant Open Banking API for Canadian Institutions', to: '/use-cases/open-banking-api' },
    ],
  },
  {
    label: 'More',
    items: [
      { title: 'About Us', text: 'Meet the Team', to: '/about-us' },
      { title: 'Pricing', text: 'Find the best plan for you.', to: '/pricing' },
      { title: 'Contact', text: 'Have questions? Have insights?', to: '/contact' },
      { title: 'Blog', text: 'Find the most interesting topics in finance!', to: '/blog' },
    ],
  },
];

export const FOOTER = [
  {
    heading: 'Company',
    links: [
      ['About us', '/about-us'],
      ['Security', '/security'],
      ['How it works', '/how-it-works'],
      ['Pricing', '/pricing'],
      ['API', '/developers'],
      ['Blog', '/blog'],
    ],
  },
  {
    heading: 'Get started',
    links: [
      ['Login to app', '/login'],
      ['Sign up', '/signup'],
    ],
  },
  {
    heading: 'Solutions',
    links: [
      ['Investors', '/'],
      ['Financial Spreadsheets', '/export-to-spreadsheet'],
      ['Advisors', '/advisor'],
      ['Institutional Partners', '/institutional-partner'],
      ['Family office', '/family-office'],
      ['Budgets', '/budget'],
      ['Developers', '/developers'],
      ['Contact', '/contact'],
    ],
  },
  {
    heading: 'Resources',
    links: [
      ['Supported Institutions', '/integrations'],
      ['Knowledge Base', '/knowledge-base'],
      ['Service Status', '/status'],
      ['Product Updates', '/product-updates'],
    ],
  },
  {
    heading: 'Legal',
    links: [
      ['Terms of service', '/terms'],
      ['Privacy Policy', '/privacy-policy'],
      ['Cookie Policy', '/cookie-policy'],
      ['Data Processing Agreement', '/data-processing-agreement'],
      ['Sub-processor List', '/sub-processors'],
    ],
  },
];
