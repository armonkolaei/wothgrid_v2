import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { BRAND } from '../brand.js';

const PRODUCTS = {
  '': 'General question',
  family: 'Family Office',
  advisor: 'Financial Advisor',
  whitelabel: 'Institutional / White-label',
  api: 'Investment API',
};

export default function Contact() {
  const [params] = useSearchParams();
  const initial = params.get('product');
  const [form, setForm] = useState({
    name: '',
    email: '',
    product: initial in PRODUCTS ? initial : '',
    message: '',
  });
  const [status, setStatus] = useState({ state: 'idle', error: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', error: '' });
    try {
      await api('/contact', { method: 'POST', body: form });
      setStatus({ state: 'sent', error: '' });
    } catch (err) {
      setStatus({ state: 'idle', error: err.message });
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <h1>We are here to help</h1>
          <p className="lead">Email us at {BRAND.email} or send a message below.</p>
        </div>
      </section>
      <section className="block">
        <div className="wrap narrow">
          {status.state === 'sent' ? (
            <p className="success" role="status">Thanks! We received your message and will get back to you soon.</p>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label>Name
                <input value={form.name} onChange={set('name')} maxLength={100} required />
              </label>
              <label>Email
                <input type="email" value={form.email} onChange={set('email')} maxLength={200} required />
              </label>
              <label>I'm interested in
                <select value={form.product} onChange={set('product')}>
                  {Object.entries(PRODUCTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label>Message
                <textarea value={form.message} onChange={set('message')} rows={6} maxLength={2000} required />
              </label>
              {status.error && <p className="error" role="alert">{status.error}</p>}
              <button className="btn-primary" disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
