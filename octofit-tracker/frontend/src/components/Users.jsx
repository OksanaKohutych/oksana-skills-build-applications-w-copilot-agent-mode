import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeApiResponse } from '../lib/api';

function Users() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch(buildApiUrl('users'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(normalizeApiResponse(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load users.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-light">Loading users…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card bg-dark text-light border-secondary shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Fitness</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    No users found.
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <tr key={user._id || user.id || user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.fitnessLevel || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
