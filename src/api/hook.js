import { useEthers } from "@usedapp/core"
import { Contract } from "ethers"
import TOKEN_ABI from '../abi/Mind.json';
import {useMemo, useEffect, useState} from 'react'
const TOKEN_ADDRESS = '0x9867cc2419Fb317e986A648E02cF7C35aa87a336';

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getContract(address, ABI, provider, account) {
  return new Contract(address, ABI, provider, getSigner(provider, account));
}

function useContract(address, ABI, library, account, withSignerIfPossible = true) {
  
  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function  useEvents() {
    const {library, account, active} = useEthers();
    const tokenContract = useContract(TOKEN_ADDRESS, TOKEN_ABI, library, account);

    const [events, setEvents] = useState([]);

    useEffect(async () => {

      const getEvents = async () => {
        let eventFilter = tokenContract.filters.Transfer() 
        const txs = await tokenContract.queryFilter(eventFilter, 10841421);
        console.log('txs: ', txs)
        setEvents(txs || []);
      }

      if (tokenContract && active && account) {
        getEvents();
      }
    }, [tokenContract, active, account])

    return events;
}

export function useHolders() {
  const [holders, setHolders] = useState([]);
  const events = useEvents([]);
  console.log('events: ', events)
  useEffect(() => {
    const getHolders = async () => {
      let addresses = [];
      for (let event of events) {
        const {from} = event.args;
        const {to} = event.args;
        if (addresses.indexOf(from) === -1) {
          addresses.push(from);
        }
        if (addresses.indexOf(to) === -1) {
          addresses.push(to);
        }
      }
      console.log('addresses: ', addresses);
      setHolders(addresses);
    }

    getHolders();
  }, [events]) 
  return holders;
}