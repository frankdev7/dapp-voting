import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { ABI_TOKEN_CONTRACT, TOKEN_CONTRACT_ADDRESS } from './sol/config/voting_erc20_config'
import { ABI_VOTING_CONTRACT, VOTING_CONTRACT_ADDRESS, } from './sol/config/votingv2_config'

function App() {

  const [account, setAccount] = useState('0x0');
  const [votingTokenSC, setVotingTokenSC] = useState();
  const [votingSC, setVotingSC] = useState();
  const [candidates, setCandidates] = useState({ status: false, names: [], votes: [] });
  const [balanceToken, setBalanceToken] = useState(0);
  const web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    // Set up account
    web3.eth.requestAccounts().then(accounts => {
      setAccount(accounts[0]);
    });
  }, []);

  useEffect(() => {
    const votingTokenSC = new web3.eth.Contract(ABI_TOKEN_CONTRACT, TOKEN_CONTRACT_ADDRESS);
    setVotingTokenSC(votingTokenSC);

    const votingSC = new web3.eth.Contract(ABI_VOTING_CONTRACT, VOTING_CONTRACT_ADDRESS);
    setVotingSC(votingSC);

    // Call balance of voting token contract
    if (account != '0x0')
      votingTokenSC.methods.balanceOf(account).call().then(balance => {
        setBalanceToken(balance);
      });

    // Call list of candidates
    if (!candidates.status) {
      votingSC.methods.allCandidates().call().then(candidates => {
        setCandidates({ status: true, names: candidates });
      });
    }

  }, [account]);

  const voteForCandidate = (i) => {
    // balanceof votingTokenSC 

    votingSC.methods.voteForCandidate(i, 10).call().then(result => {
      console.log(result);
    });
  }

  return (
    <>
      <h1>Voting Application</h1>
      <h4>My Account: {account}</h4>
      <h4>My Balance: {balanceToken}</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {
              candidates.names.map((candidate, i) => (
                <tr key={i}>
                  <td>{candidate}</td>
                  <td id="candidate-1"></td>
                  <td id="candidate-1">
                    <button onClick={() => voteForCandidate(i)} className="btn btn-primary">Vote</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

    </>
  );
}

export default App;
