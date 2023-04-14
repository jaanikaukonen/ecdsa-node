const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

const users = [
    {
      id: 1,
      name: 'Alice',
      balance: 100,
      publicKey: undefined,
    },
    {
      id: 2,
      name: 'Bob',
      balance: 50,
      publicKey: undefined,
    },
    {
      id: 3,
      name: 'Leroy',
      balance: 75,
      publicKey: undefined,
    },
]

const privateKeys = []

generateKeys = () => {
  for (let i = 0; i < users.length; i++) {
    const privateKey = secp.utils.randomPrivateKey()
    const publicKey = secp.getPublicKey(privateKey)
    const keccak = toHex(keccak256(publicKey.slice(1)).slice(-20))

    users[i].publicKey = keccak
    privateKeys.push({ id: users[i].id, privateKey: privateKey })
  }
}

generateKeys()

app.get("/users", (req, res) => {
  res.send(users)
})

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
