import { Link } from 'react-router-dom';
import HeroArt from '../components/HeroArt.jsx';
import Blocks from '../components/Blocks.jsx';
import { BRAND } from '../brand.js';
import { FREE_BLOCK } from '../content/pages.js';

const B = BRAND.name;

const HOME_BLOCKS = [
  { type: 'features', title: 'Designed for the financially-minded of every kind' },
  { type: 'split', eyebrow: 'Complete', title: 'Not Just Investments', body: ['"Worth Grid has absolutely revolutionized my approach to how I track my money and financial life."', `${B} keeps a historical view of how your net worth evolved over time and allows you to easily focus on the big picture while tracking your progress towards your financial, net worth or retirement goals.`] },
  { type: 'split', flip: true, eyebrow: 'Delightful', title: 'Best Portfolio Tracker', body: ['"All holdings, across various accounts and institutions on one screen. It\'s financial wizardry."', 'Track stocks, ETFs, funds, cryptocurrency, private investments and more. Keep track of your portfolio without the hassle. It makes it simple and automated.'] },
  { type: 'split', eyebrow: 'Personalized', title: 'Powerful Power Ups', body: ['"The multiple free and few paying power ups are priceless in my opinion!"', 'Create a budget, export to Google Spreadsheet, Excel or Yahoo! Portfolio, rebalance using Passiv, report on Capital Gains, Income or Fees. These are a few of the available Power Ups.'] },
  { type: 'checklist', title: 'Do Your Budget — master your financial health', body: ['"Easily follow all your expenses and set your budget goals"'], items: [
    'Connect Questrade with a read-only API token',
    'Add real estate, cash and other assets manually',
    'Automatically updated data without manual intervention',
  ] },
  { type: 'logos', title: 'Connect the institutions you already use', items: ['Questrade'] },
  FREE_BLOCK,
  { type: 'cta', title: 'Simplify your financial life today', label: 'Get Started', to: '/signup' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="review">
            <span className="stars">★★★★★</span> “Incredible, amazing and useful!”
          </p>
          <h1>
            <span className="light">All your Financial Accounts in One Place</span>
            <span className="bold">Simplify your Financial Life</span>
          </h1>
          <Link to="/signup" className="btn-primary">Get Started ›</Link>
        </div>
        <HeroArt />
      </section>
      <p className="eyebrow center">No Advertising, Transparent Privacy and Bank-Level Security</p>
      <h2 className="center-title">We Run the Most Powerful Investment Financial Tracker and Budgeting Tool Including Advanced Analysis and Reporting</h2>
      <Blocks blocks={HOME_BLOCKS} />
    </>
  );
}
