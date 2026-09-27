import { useEffect, useState } from 'react';
import { getApiHost, normalizeApiResponse } from '../lib/api';

const apiEndpoint = '/api/activities/';

function Activities() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        const response = await fetch(`${getApiHost()}${apiEndpoint}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(normalizeApiResponse(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load activities.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-light">Loading activities…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card bg-dark text-light border-secondary shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    No activities found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id || item.id || `${item.type}-${item.date}`}>
                    <td>{item.type}</td>
                    <td>{item.durationMinutes ?? item.duration ?? '—'} min</td>
                    <td>{item.caloriesBurned ?? item.calories ?? '—'}</td>
                    <td>{item.date}</td>
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

export default Activities;
