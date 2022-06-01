import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { ABI_TOKEN_CONTRACT, TOKEN_CONTRACT_ADDRESS } from './sol/config/voting_erc20_config'
import { ABI_VOTING_CONTRACT, VOTING_CONTRACT_ADDRESS, } from './sol/config/votingv2_config'
const BigNumber = require('bignumber.js');

function App() {

  const [accounts, setAccounts] = useState({ status: false, account: '0x0' });
  const [votingTokenSC, setVotingTokenSC] = useState();
  const [votingSC, setVotingSC] = useState();
  const [votesByCandidate, setVotesByCandidate] = useState({ status: false, votes: new Map() });
  const [balanceToken, setBalanceToken] = useState(0);


  const web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    // Set up account
    web3.eth.requestAccounts().then(accounts => {
      setAccounts({ status: true, account: accounts[0] });
    });
  }, []);

  useEffect(() => {

    async function load() {
      if (accounts.status) {
        const votingTokenSC = new web3.eth.Contract(ABI_TOKEN_CONTRACT, TOKEN_CONTRACT_ADDRESS);
        setVotingTokenSC(votingTokenSC);

        const votingSC = new web3.eth.Contract(ABI_VOTING_CONTRACT, VOTING_CONTRACT_ADDRESS);
        setVotingSC(votingSC);

        // Call balance of voting token contract
        if (accounts.account != '0x0')
          votingTokenSC.methods.balanceOf(accounts.account).call().then(balance => {
            setBalanceToken(new BigNumber(balance).shiftedBy(-18).toNumber());
          });

        // Call list of candidates and their votes
        if (!setVotesByCandidate.status) {
          let candidates = await votingSC.methods.allCandidates().call();
          const votes = new Map();
          candidates.forEach(async (candidate) => {
            votes.set(candidate, (await votingSC.methods.totalVotesFor(candidate).call()));
            setVotesByCandidate({ status: true, votes });
          });
        }
      }
    }
    load();

  }, [accounts]);

  const voteForCandidate = (i) => {
    // balanceof votingTokenSC
    if (balanceToken > 0) {
      votingSC.methods.voteForCandidate(i, balanceToken).send({ from: accounts.account })
        .on("receipt", receipt => {
          console.log(receipt);
        })
        .on("error", error => {
          console.log(error);
        });
    } else {
      alert('You need more tokens to vote');
    }
  }

  return (
    <>
      <h1>Voting Application</h1>
      <h4>My Account: {accounts.account}</h4>
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
              votesByCandidate.votes.size > 0 && Array.from(votesByCandidate.votes.entries()).map(([candidate, votes], i) => (
                <tr key={i}>
                  <td>{candidate}</td>
                  <td>{votes}</td>
                  <td>
                    <button onClick={() => voteForCandidate(i)}>Vote</button>
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
