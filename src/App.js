import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TokenMaster from './abis/TokenMaster.json'

// Config
import config from './config.json'
import { use } from 'react'

function App() {
  const [account, setAccount] = useState(null)

  const loadBlchainData = async () => {
    // refresh account on change
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(ethers.utils.getAddress(accounts[0]))
    })
  }


  useEffect(() => {
    loadBlchainData()
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

    </div>
  );
}

export default App;