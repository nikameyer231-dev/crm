import React, { useEffect, useState } from 'react';
import { loadLocalAddons, Addon } from '../../infra/addons';

export const AddonsPage: React.FC = () => {
  const [addons, setAddons] = useState<Addon[] | null>(null);

  useEffect(() => {
    let mounted = true;
    loadLocalAddons()
      .then(list => {
        if (mounted) setAddons(list);
      })
      .catch(() => {
        if (mounted) setAddons([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (addons === null) return <div>Loading add-ons...</div>;

  if (addons.length === 0) {
    return (
      <div>
        <h2>Add-ons</h2>
        <p>No local add-ons found. Add a file at <code>src/addons/index.ts</code> to register local add-ons for development.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Add-ons</h2>
      <ul>
        {addons.map(a => (
          <li key={a.id} style={{ marginBottom: 12 }}>
            <strong>{a.name}</strong>
            {a.description ? <div>{a.description}</div> : null}
            <div style={{ marginTop: 6 }}>
              <button
                onClick={() => {
                  try {
                    a.init && a.init();
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error('Addon init failed', e);
                  }
                }}
              >
                Initialize
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddonsPage;
