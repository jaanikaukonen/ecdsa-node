import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import server from "./server";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
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
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        users={users}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
      />
      <Transfer 
        setBalance={setBalance} 
        address={address}
        users={users}
        activeUser={activeUser}
      />
    </div>
  );
}

export default App;
