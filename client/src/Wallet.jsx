import server from "./server";
import "./Wallet.scss";
import { useEffect } from "react";


function Wallet({ users, activeUser, setActiveUser }) {

  const handleUserButtonClick = (user) => {
    setActiveUser(user);
  }

  const loadBalance = () => {
    const user = users.find(user => user.address === activeUser.address)
    return user ? user.balance : ''
  }

  return (
    <div className="container wallet">
      <h1>Choose wallet user</h1>

      <div className="buttons">
        {users.map((user, idx) => {
          return <button key={idx} className={activeUser === user ? 'active' : ''} onClick={() => handleUserButtonClick(user)}>{user.name}</button>
        })}
      </div>
      <div className="balance">Your balance: {loadBalance()}</div>
    </div>
  );
}

export default Wallet;
