import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeApiResponse } from '../lib/api';

function Leaderboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      try {
        const response = await fetch(buildApiUrl('leaderboard'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(normalizeApiResponse(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load leaderboard.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-light">Loading leaderboard…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card bg-dark text-light border-secondary shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    No leaderboard entries found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id || item.userId || item.name}>
                    <td>#{item.rank ?? '—'}</td>
                    <td>{item.name}</td>
                    <td>{item.score ?? '—'}</td>
                    <td>{item.streak ?? 0} days</td>
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

export default Leaderboard;
