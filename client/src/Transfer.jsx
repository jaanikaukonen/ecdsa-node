import { useState } from "react";
import server from "./server";
import "./Transfer.scss"
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex } from "ethereum-cryptography/utils"

function Transfer({ users, activeUser, setUsers }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = `Send ${sendAmount} to address: ${recipient}`

      const response = await server.post(`sign`, {
        message: message,
        user: activeUser,
      })

      if (!response.data.isValidSignature) {
        throw new Error ('Not authorized to make a transaction.')
      } else {
        const response = await server.post(`send`, {
        amount: parseInt(sendAmount),
        recipientAddress: recipient,
        senderAddress: activeUser.address,
        });

        setUsers(response.data.users)
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Copy and paste address down below"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <div className="contacts">
        <h3>Your contacts</h3>
        {users.map((user, idx) => {
          if (activeUser && user.address !== activeUser.address) {
            return <p key={idx} className="contact">{user.name}: {user.address}</p>
          }
        })}
      </div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
