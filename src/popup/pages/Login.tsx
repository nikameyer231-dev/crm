import React, { useEffect, useState } from 'react';
import localAuth from '../../infra/localAuth';
import { initializeAddons } from '../../addons/bootloader';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [noAdmin, setNoAdmin] = useState(false);
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    localAuth.adminExists().then(exists => setNoAdmin(!exists)).catch(() => setNoAdmin(false));
  }, []);

  const onLogin = async () => {
    setError(null);
    try {
      const user = await localAuth.authenticate(username, password);
      if (!user) {
        setError('Invalid credentials');
        return;
      }
      // store session simply for popup lifetime; adapt to app's session management
      localStorage.setItem('session', JSON.stringify({ username: user.username }));
      // initialize addons after successful login
      try {
        await initializeAddons();
      } catch (e) {
        console.warn('failed to init addons after login', e);
      }
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    }
  };

  const onCreateAdmin = async () => {
    setError(null);
    setCreatingAdmin(true);
    try {
      if (!newAdminUser || !newAdminPass) {
        setError('username and password required');
        setCreatingAdmin(false);
        return;
      }
      await localAuth.createAdmin(newAdminUser, newAdminPass);
      setNoAdmin(false);
      // auto-login newly created admin
      localStorage.setItem('session', JSON.stringify({ username: newAdminUser }));
      try {
        await initializeAddons();
      } catch (e) {
        console.warn('failed to init addons after admin creation', e);
      }
    } catch (e: any) {
      setError(e?.message || 'failed to create admin');
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={onLogin}>Login</button>
      </div>

      {noAdmin && (
        <div style={{ marginTop: 24, borderTop: '1px solid #ddd', paddingTop: 12 }}>
          <h3>Create Admin</h3>
          <div>
            <input placeholder="admin username" value={newAdminUser} onChange={e => setNewAdminUser(e.target.value)} />
          </div>
          <div>
            <input placeholder="admin password" type="password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} />
          </div>
          <div>
            <button onClick={onCreateAdmin} disabled={creatingAdmin}>{creatingAdmin ? 'Creating...' : 'Create Admin'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
