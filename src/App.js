import logo from './logo.svg';
import './App.css';
import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from 'ethers/lib/utils';
import {useHolders} from './api/hook';

export default function App() {
  const { activateBrowserWallet, account } = useEthers()
  const etherBalance = useEtherBalance(account)
  const holders = useHolders();
  const airdrop = () => {

  }

  return (
    <div>
      <div>
        <button onClick={() => activateBrowserWallet()}>Connect</button>
        <button onClick={() => airdrop()}>AirDrop</button>
      </div>
      {account && <p>Account: {account}</p>}
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}

    </div>
  )
}