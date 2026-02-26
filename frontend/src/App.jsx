import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ol>
        {users.map((u) => (
          <li key={u.id}>{u.email} ({u.name})</li>
        ))}
      </ol>
    </div>
  );
}

export default App;
