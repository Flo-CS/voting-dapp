// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Voting is Ownable {
    constructor() Ownable(msg.sender) {}

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
        address addr;
    }

    struct Proposal {
        string description;
        uint votesCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);
    event CancelledVote(address voter, uint proposalId);

    mapping(address => uint) addressToVoterId;
    Voter[] voters;
    Proposal[] proposals;
    WorkflowStatus public currentStatus = WorkflowStatus.RegisteringVoters;

    /** MODIFIERS */

    modifier onlyRegistered() {
        require(
            voters[addressToVoterId[msg.sender]].isRegistered,
            "You are not registered to vote"
        );
        _;
    }

    modifier onlyDuringWorkflowStatus(WorkflowStatus _status) {
        require(currentStatus == _status, "Can't do this right now");
        _;
    }

    modifier notDuringWorkflowStatus(WorkflowStatus _status) {
        require(currentStatus != _status, "Can't do this right now");
        _;
    }

    /** OWNER ACTIONS */

    function registerVoter(
        address _voterAddress
    )
        public
        onlyOwner
        onlyDuringWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        uint newId = voters.length;
        uint potentialCurrentVoterId = addressToVoterId[_voterAddress];
        if (potentialCurrentVoterId < newId) {
            // We need to do this check because when potentualCurrentVoterId is 0 (ie: voter never enregistred or voter is the first one), we need to verify that we speak of the same voter
            if (_voterAddress == voters[potentialCurrentVoterId].addr) {
                require(
                    !voters[potentialCurrentVoterId].isRegistered,
                    "Voter already registered"
                );
            }
        }
        voters.push(Voter(true, false, 0, _voterAddress));
        addressToVoterId[_voterAddress] = newId;

        emit VoterRegistered(_voterAddress);
    }

    function goNextWorkflowStatus()
        public
        onlyOwner
        notDuringWorkflowStatus(type(WorkflowStatus).max)
    {
        WorkflowStatus _newStatus = WorkflowStatus(uint(currentStatus) + 1);
        WorkflowStatus _previousStatus = currentStatus;
        currentStatus = _newStatus;

        emit WorkflowStatusChange(_previousStatus, _newStatus);
    }

    function goNextAndSkipEndWorkflowStatus()
        public
        onlyOwner
        notDuringWorkflowStatus(type(WorkflowStatus).max)
        notDuringWorkflowStatus(WorkflowStatus.RegisteringVoters)
        notDuringWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded)
        notDuringWorkflowStatus(WorkflowStatus.VotingSessionEnded)
    {
        WorkflowStatus _newStatus = WorkflowStatus(uint(currentStatus) + 2);
        WorkflowStatus _previousStatus = currentStatus;
        currentStatus = _newStatus;

        emit WorkflowStatusChange(_previousStatus, _newStatus);
    }

    /** VOTERS ACTIONS */

    function registerProposal(
        string memory _description
    )
        public
        onlyRegistered
        onlyDuringWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        proposals.push(Proposal(_description, 0));

        emit ProposalRegistered(proposals.length - 1);
    }

    function vote(
        uint _proposalId
    )
        public
        onlyRegistered
        onlyDuringWorkflowStatus(WorkflowStatus.VotingSessionStarted)
    {
        require(_proposalId < proposals.length, "Proposal id does not exist");

        if (voters[addressToVoterId[msg.sender]].hasVoted) {
            removeVote(voters[addressToVoterId[msg.sender]].votedProposalId);
        }

        voters[addressToVoterId[msg.sender]].hasVoted = true;
        voters[addressToVoterId[msg.sender]].votedProposalId = _proposalId;
        proposals[_proposalId].votesCount++;

        emit Voted(msg.sender, _proposalId);
    }

    function removeVote(
        uint _proposalId
    )
        public
        onlyRegistered
        onlyDuringWorkflowStatus(WorkflowStatus.VotingSessionStarted)
    {
        require(
            voters[addressToVoterId[msg.sender]].hasVoted,
            "You have not voted yet"
        );
        require(
            voters[addressToVoterId[msg.sender]].votedProposalId == _proposalId,
            "You have not voted for this proposal"
        );

        voters[addressToVoterId[msg.sender]].hasVoted = false;
        voters[addressToVoterId[msg.sender]].votedProposalId = 0;
        proposals[_proposalId].votesCount--;

        emit CancelledVote(msg.sender, _proposalId);
    }

    /** ALL ACTIONS */

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getVoter(
        address _voterAddress
    ) public view returns (Voter memory) {
        return voters[addressToVoterId[_voterAddress]];
    }

    function getVoters() public view returns (Voter[] memory) {
        return voters;
    }

    function getWinningProposal()
        public
        view
        onlyDuringWorkflowStatus(WorkflowStatus.VotesTallied)
        returns (Proposal memory, uint)
    {
        uint winningProposalId = 0;
        uint winningvotesCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].votesCount > winningvotesCount) {
                winningProposalId = i;
                winningvotesCount = proposals[i].votesCount;
            }
        }

        return (proposals[winningProposalId], winningProposalId);
    }
}
