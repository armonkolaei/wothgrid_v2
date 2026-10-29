import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Blocks from '../components/Blocks.jsx';
import { PAGES } from '../content/pages.js';
import { BRAND } from '../brand.js';

export default function ContentPage() {
  const { pathname } = useLocation();
  const page = PAGES[pathname.replace(/\/$/, '')];

  useEffect(() => {
    if (page) document.title = `${page.title} | ${BRAND.name}`;
    return () => { document.title = BRAND.name; };
  }, [page]);

  if (!page) return <Navigate to="/" replace />;
  return <Blocks blocks={page.blocks} />;
}
