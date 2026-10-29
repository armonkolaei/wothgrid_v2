import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../auth.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="navbar">
        <Logo />
        <div className="nav-actions">
          <span className="who">{user.name}</span>
          <button
            className="btn-primary small"
            onClick={async () => {
              await logout();
              navigate('/', { replace: true });
            }}
          >
            Log out
          </button>
        </div>
      </header>
      <main className="section">
        <h2>Welcome, {user.name}</h2>
        <p>Your dashboard will appear here.</p>
      </main>
    </>
  );
}
