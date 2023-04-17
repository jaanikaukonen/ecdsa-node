const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const users = [
    {
      name: 'Alice',
      balance: 100,
      address: undefined,
    },
    {
      name: 'Bob',
      balance: 50,
      address: undefined,
    },
    {
      name: 'Leroy',
      balance: 75,
      address: undefined,
    },
]

const privateKeys = []

generateKeys = () => {
  for (let i = 0; i < users.length; i++) {
    const privateKey = secp.utils.randomPrivateKey()
    const publicKey = secp.getPublicKey(privateKey)
    const keccak = toHex(keccak256(publicKey.slice(1)).slice(-20))

    users[i].address = keccak
    privateKeys.push({ address: users[i].address, privateKey: privateKey })
  }
}

generateKeys()

app.get("/users", (req, res) => {
  res.send(users)
})

app.post("/sign", async (req, res) => {
  const {message, user} = req.body;

  const messageHash = toHex(keccak256(Uint8Array.from(message)));
  const privateKey = privateKeys.find(key => key.address === user.address).privateKey;

  const signature = await secp.sign(messageHash, privateKey);

  res.send(
    {
      signature: signature,
      messageHash: messageHash,
    }
  );
})

app.post("/send", (req, res) => {
  const { senderAddress, amount, recipientAddress } = req.body;
  const sender = users.findIndex(user => user.address === senderAddress);
  const recipient = users.findIndex(user => user.address === recipientAddress);
    if (users[sender].balance < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      users[sender].balance -= amount;
      users[recipient].balance += amount;
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
