import { useState } from "react";
import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  const signTransfer = () => {
    console.log(sendAmount, privateKey)
    return secp256k1.sign(Uint8Array.from(sendAmount), privateKey);
  } 

  const replacer = (key, value) =>
  typeof value === "bigint" ? value.toString() : value;

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const signature = signTransfer();
      console.log(signature)

      const { data: { balance } } = await server.post(`send`, 
        {
          sender: address,
          amount: sendAmount,
          signature: JSON.stringify(signature, replacer),
          recipient,
        }
      );

      setBalance(balance);
    } catch (ex) {
      alert(ex.message);
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
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
