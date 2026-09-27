import { useEffect, useState } from 'react';
import { getApiHost, normalizeApiResponse } from '../lib/api';

const apiEndpoint = '/api/teams/';

function Teams() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      try {
        const response = await fetch(`${getApiHost()}${apiEndpoint}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(normalizeApiResponse(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load teams.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-light">Loading teams…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row g-3">
      {items.length === 0 ? (
        <div className="col-12">
          <div className="alert alert-secondary">No teams available.</div>
        </div>
      ) : (
        items.map((team) => (
          <div key={team._id || team.id || team.name} className="col-md-6">
            <div className="card bg-dark text-light border-secondary h-100 shadow-sm">
              <div className="card-body">
                <h3 className="h5 text-warning">{team.name}</h3>
                <p className="text-secondary mb-3">{team.description || 'No description available.'}</p>
                <div>
                  <strong>Members:</strong>
                  <ul className="mb-0 mt-2">
                    {(team.members || []).map((member, index) => (
                      <li key={`${team.name}-${index}`}>{member}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Teams;
