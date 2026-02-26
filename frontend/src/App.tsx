import { useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
  name?: string | null;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data as User[]))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ol>
        {users.map((u) => (
          <li key={u.id}>
            {u.email} ({u.name})
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
