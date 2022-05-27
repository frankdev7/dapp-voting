// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Voting {

  // We use the struct datatype to store the voter information.
  struct voter {
    address voterAddress; // The address of the voter
    uint tokensBought;    // The total no. of tokens this voter owns
    uint[] tokensUsedPerCandidate; // Array to keep track of votes per candidate.
    /* We have an array of candidates initialized below.
     Every time this voter votes with her tokens, the value at that
     index is incremented. Example, if candidateList array declared
     below has ["Rama", "Nick", "Jose"] and this
     voter votes 10 tokens to Nick, the tokensUsedPerCandidate[1]
     will be incremented by 10.
     */
  }

  /* mapping is equivalent to an associate array or hash
   The key of the mapping is candidate name stored as type bytes32 and value is
   an unsigned integer which used to store the vote count
   */

  mapping (address => voter) public voterInfo;
  mapping (string => uint) public votesReceived;
  string[] public candidateList;

  /* When the contract is deployed on the blockchain, we will initialize
   the total number of tokens for sale, cost per token and all the candidates
   */
 constructor(string[] memory candidateNames) {
    candidateList = candidateNames;
  }

  function totalVotesFor(string memory candidate) view public returns (uint) {
    return votesReceived[candidate];
  }

  /* Instead of just taking the candidate name as an argument, we now also
   require the no. of tokens this voter wants to vote for the candidate
   */
  function voteForCandidate(uint index, uint votesInTokens) public {

    // msg.sender gives us the address of the account/voter who is trying
    // to call this function
    if (voterInfo[msg.sender].tokensUsedPerCandidate.length == 0) {
      for(uint i = 0; i < candidateList.length; i++) {
        voterInfo[msg.sender].tokensUsedPerCandidate.push(0);
      }
    }

    // Make sure this voter has enough tokens to cast the vote
    uint availableTokens = voterInfo[msg.sender].tokensBought - totalTokensUsed(voterInfo[msg.sender].tokensUsedPerCandidate);
    require(availableTokens >= votesInTokens);

    votesReceived[candidateList[index]] += votesInTokens;

    // Store how many tokens were used for this candidate
    voterInfo[msg.sender].tokensUsedPerCandidate[index] += votesInTokens;
  }

  // Return the sum of all the tokens used by this voter.
  function totalTokensUsed(uint[] memory _tokensUsedPerCandidate) private pure returns (uint) {
    uint totalUsedTokens = 0;
    for(uint i = 0; i < _tokensUsedPerCandidate.length; i++) {
      totalUsedTokens += _tokensUsedPerCandidate[i];
    }
    return totalUsedTokens;
  }

  function voterDetails(address user) view public returns (uint[] memory) {
    return voterInfo[user].tokensUsedPerCandidate;
  }

  /* All the ether sent by voters who purchased the tokens is in this
   contract's account. This method will be used to transfer out all those ethers
   in to another account. *** The way this function is written currently, anyone can call
   this method and transfer the balance in to their account. In reality, you should add
   check to make sure only the owner of this contract can cash out.
   */

  function allCandidates() view public returns (string[] memory) {
    return candidateList;
  }

}