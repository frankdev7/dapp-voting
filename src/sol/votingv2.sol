// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Voting {

  struct voter {
    uint tokensUsed;
    string votedFor; 
  }

  mapping (address => voter) voterInfo; ["0x1": {tokensUsed: 10, votedFor: "Rama"}, "0x2": {tokensUsed: 50, votedFor: "Nick"}, "0x3": {tokensUsed: 0, votedFor: "Jose"}}}]
  mapping (string => uint) votesReceived; ["Rama": 10, "pedro": 0, "jose": 10]
  string[] candidateList; ["Rama", "Nick", "Jose"]

 constructor(string[] memory candidateNames) {
    candidateList = candidateNames;
  }

  function totalVotesFor(string memory candidate) view public returns (uint) {
    return votesReceived[candidate];
  }

  function voteForCandidate(uint index, uint votesInTokens) public {
    require(voterInfo[msg.sender].tokensUsed == uint(0), "you have already voted");
    votesReceived[candidateList[index]] = votesInTokens;
    voterInfo[msg.sender].tokensUsed = votesInTokens;
    voterInfo[msg.sender].votedFor = candidateList[index];
  }

  function voterDetails(address user) view public returns (uint, string memory) {
    return (voterInfo[user].tokensUsed, voterInfo[user].votedFor);
  }

  function allCandidates() view public returns (string[] memory) {
    return candidateList;
  }

}