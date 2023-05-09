const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const users = [
    {
      name: 'Alice',
      balance: 100,
      address: undefined,
      publicKey: undefined,
    },
    {
      name: 'Bob',
      balance: 50,
      address: undefined,
      publicKey: undefined,
    },
    {
      name: 'Leroy',
      balance: 75,
      address: undefined,
      publicKey: undefined,
    },
]

const privateKeys = []

generateKeys = () => {
  for (let i = 0; i < users.length; i++) {
    const privateKey = toHex(secp.utils.randomPrivateKey())
    const publicKey = secp.getPublicKey(privateKey)
    const address = toHex(keccak256(publicKey.slice(1)).slice(-20))

    users[i].publicKey = toHex(publicKey)
    users[i].address = address
    privateKeys.push({ publicKey: users[i].publicKey, privateKey: privateKey })
  }
}

generateKeys()

app.get("/users", (req, res) => {
  res.send(users)
})

app.post("/sign", async (req, res) => {
  try {
    const { message, user } = req.body;

    const messageHash = toHex(keccak256(utf8ToBytes(message)));

    const privateKey = privateKeys.find(key => key.publicKey === user.publicKey)?.privateKey;

    if (!privateKey) {
      throw new Error("Private key not found for the provided user address");
    }

    const [signature, recoveryBit] = await secp.sign(messageHash, privateKey, { recovered: true });

    const isValid = secp.verify(signature, messageHash, user.publicKey)

    res.send({
      isValidSignature: isValid,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({ error: error.message });
  }
})

app.post("/send", (req, res) => {
  const { amount, recipientAddress, senderAddress } = req.body;

  const sender = users.findIndex(user => user.address === senderAddress);
  const recipient = users.findIndex(user => user.address === recipientAddress);
    if (users[sender].balance < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      users[sender].balance -= amount;
      users[recipient].balance += amount;
      res.status(200).send({ message: "Transaction complete.", users: users })
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
