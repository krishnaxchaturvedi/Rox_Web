import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateUserForm } from '../../utils/validators';
import { signup } from '../../services/authService';

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const validationErrors = validateUserForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setBusy(true);
    try {
      await signup(form);
      navigate('/login', { replace: true, state: { message: 'Account created successfully. Please sign in.' } });
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Unable to create the account.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card auth-card signup-card" onSubmit={submit}>
      <div className="auth-brand">
        <div className="auth-logo">R</div>
        <h1>Create your account</h1>
        <p className="muted">Join Rox Store Ratings as a normal user</p>
      </div>

      <Input label="Full name" type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} error={errors.name} placeholder="20–60 characters" autoComplete="name" required />
      <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} error={errors.email} placeholder="you@example.com" autoComplete="email" required />
      <Input label="Address" type="text" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} error={errors.address} placeholder="Up to 400 characters" autoComplete="street-address" required />

      <div className="password-field">
        <label className="label" htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          className="input"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="8–16 chars, uppercase + special"
          autoComplete="new-password"
          required
        />
        <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
          {showPassword ? '🙈' : '👁'}
        </button>
        {errors.password && <div className="error">{errors.password}</div>}
      </div>

      {errors.form && <p className="error" role="alert">{errors.form}</p>}

      <Button disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</Button>

      <div className="auth-footer">
        <span className="muted">Already have an account?</span>
        <Link className="auth-link" to="/login">Sign in</Link>
      </div>
    </form>
  );
}
