import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import server from "./server";

function App() {
  const [activeUser, setActiveUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const users = await server.get(`users`)
      setUsers(users.data)
    })()
  }, [])

  return (
    <div className="app">
      <Wallet
        users={users}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
      />
      <Transfer
        users={users}
        activeUser={activeUser}
        setUsers={setUsers}
      />
    </div>
  );
}

export default App;
