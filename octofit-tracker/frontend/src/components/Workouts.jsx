import { useEffect, useState } from 'react';
import { getApiHost, normalizeApiResponse } from '../lib/api';

const apiEndpoint = '/api/workouts/';

function Workouts() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      try {
        const response = await fetch(`${getApiHost()}${apiEndpoint}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(normalizeApiResponse(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load workouts.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-light">Loading workouts…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row g-3">
      {items.length === 0 ? (
        <div className="col-12">
          <div className="alert alert-secondary">No workouts available.</div>
        </div>
      ) : (
        items.map((workout) => (
          <div key={workout._id || workout.name} className="col-md-6">
            <div className="card bg-dark text-light border-secondary h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="h5 mb-0 text-info">{workout.name}</h3>
                  <span className="badge bg-info text-dark">{workout.category}</span>
                </div>
                <p className="mb-1"><strong>Difficulty:</strong> {workout.difficulty}</p>
                <p className="mb-1"><strong>Duration:</strong> {workout.durationMinutes} min</p>
                <p className="mb-0"><strong>Focus:</strong> {workout.focusArea}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Workouts;
