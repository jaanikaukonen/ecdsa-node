import { useState } from "react";
import server from "./server";
import "./Transfer.scss"
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex } from "ethereum-cryptography/utils"

function Transfer({ users, activeUser }) {
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

      // const isSigned = secp.verify(response.data.signature, response.data.messageHash, activeUser.publicKey)
      // console.log(isSigned)

      console.log(response.data.messageHash, response.data.signature, response.data.recoveryBit)

      // const rpk = secp.recoverPublicKey(response.data.messageHash, response.data.signature, response.data.recoveryBit)

      // console.log(rpk)

      // await server.post(`send`, {
      //   amount: sendAmount,
      //   recipientAddress: recipient,
      //   signature: response.data.signature,
      //   recoveryBit: response.data.recoveryBit,
      //   messageHash: response.data.messageHash,
      //   senderPublicKey: activeUser.publicKey,
      // });
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
