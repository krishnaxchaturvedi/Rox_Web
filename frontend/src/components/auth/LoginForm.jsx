import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const data = await login(form);
      const role = data.user.role;
      navigate(role === 'ADMIN' ? '/admin' : role === 'OWNER' ? '/owner' : '/stores', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please check your credentials.');
    }
  };

  return (
    <form className="card auth-card" onSubmit={submit}>
      <div className="auth-brand">
        <div className="auth-logo">R</div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to Rox Store Ratings</p>
      </div>

      {location.state?.message && <p className="success">{location.state.message}</p>}

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <div className="password-field">
        <label className="label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className="input"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
        <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
          {showPassword ? '🙈' : '👁'}
        </button>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <Button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>

      <div className="auth-footer">
        <span className="muted">New to Rox Store Ratings?</span>
        <Link className="auth-link" to="/signup">Create an account</Link>
      </div>

      <p className="auth-note">
        Password reset is not enabled as an unauthenticated feature in the current API. Use Change Password after signing in or contact an administrator.
      </p>
    </form>
  );
}
