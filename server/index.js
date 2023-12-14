const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0314574d28f76293d0abf3b8fbd558c631cacc5500658307ea3e64fdb177a8f961": 100, // 1 - a6798d13e5c3ba3251b5fb93875d1d84d3de1e4836f204fe1b8969589522ac63
  "03d6708561325e9d5432418cb965bf41e2d14e3380f3a0055e0d15e0682052d98e": 50, // 2 - fe7eb8eccbd637ae5317550646c03f29296805711c391bbfde2e2c7fa9a5efa8
  "026358092beccb5f7e35b07eee5495ca5b5f369c7e1bcc5c25e6e686ca0e6378b6": 75, // 3 - 77eb9e70453ef0503cb84c51255b5a211f9971c0749377fd9182563665d1c063
};

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
