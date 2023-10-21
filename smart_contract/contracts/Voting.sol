// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Voting is Ownable {
    constructor() Ownable(msg.sender) {}

    /* --------------------------------- Voters --------------------------------- */
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
        address addr;
    }

    event VoterRegistered(address voterAddress);
    event VoterUnregistered(address voterAddress);
    event Voted(address voter, uint proposalId);
    event CancelledVote(address voter, uint proposalId);

    mapping(address => uint) addressToVoterId;
    Voter[] voters;

    /* -------------------------------- Proposals ------------------------------- */
    struct Proposal {
        string description;
        uint votesCount;
    }

    event ProposalRegistered(uint proposalId);

    Proposal[] proposals;

    /* -------------------------------- Workflow -------------------------------- */
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    WorkflowStatus public currentStatus = WorkflowStatus.RegisteringVoters;

    /* ========================================================================== */
    /*                                  MODIFIERS                                 */
    /* ========================================================================== */

    modifier onlyRegisteredVoter() {
        require(
            isRegisteredVoter(msg.sender),
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

    /* ========================================================================== */
    /*                                OWNER ACTIONS                               */
    /* ========================================================================== */

    function registerVoter(
        address _voterAddress
    )
        public
        onlyOwner
        onlyDuringWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        if (isExistingVoter(_voterAddress)) {
            voters[addressToVoterId[_voterAddress]].isRegistered = true;
        } else {
            uint newId = voters.length;
            voters.push(Voter(true, false, 0, _voterAddress));
            addressToVoterId[_voterAddress] = newId;
        }

        emit VoterRegistered(_voterAddress);
    }

    function registerVoters(
        address[] memory _votersAddresses
    )
        public
        onlyOwner
        onlyDuringWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        for (uint i = 0; i < _votersAddresses.length; i++) {
            registerVoter(_votersAddresses[i]);
        }
    }

    function unregisterVoter(
        address _voterAddress
    )
        public
        onlyOwner
        onlyDuringWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        require(isExistingVoter(_voterAddress), "Voter does not exist");

        voters[addressToVoterId[_voterAddress]].isRegistered = false;

        emit VoterUnregistered(_voterAddress);
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

    /* ========================================================================== */
    /*                               VOTERS ACTIONS                               */
    /* ========================================================================== */

    function registerProposal(
        string memory _description
    )
        public
        onlyRegisteredVoter
        onlyDuringWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        proposals.push(Proposal(_description, 0));

        emit ProposalRegistered(proposals.length - 1);
    }

    function registerProposals(
        string[] memory _descriptions
    )
        public
        onlyRegisteredVoter
        onlyDuringWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        for (uint i = 0; i < _descriptions.length; i++) {
            registerProposal(_descriptions[i]);
        }
    }

    function vote(
        uint _proposalId
    )
        public
        onlyRegisteredVoter
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
        onlyRegisteredVoter
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

    /* ========================================================================== */
    /*                              EVERYONE ACTIONS                              */
    /* ========================================================================== */

    function isRegisteredVoter(
        address _voterAddress
    ) public view returns (bool) {
        uint voterId = addressToVoterId[_voterAddress];
        return isExistingVoter(_voterAddress) && voters[voterId].isRegistered;
    }

    function isExistingVoter(address _voterAddress) public view returns (bool) {
        uint voterId = addressToVoterId[_voterAddress];
        return voterId < voters.length && voters[voterId].addr == _voterAddress;
    }

    function getVoter(
        address _voterAddress
    ) public view returns (Voter memory) {
        if (!isExistingVoter(_voterAddress)) {
            return Voter(false, false, 0, _voterAddress);
        }
        return voters[addressToVoterId[_voterAddress]];
    }

    function getVoters() public view returns (Voter[] memory) {
        return voters;
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
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
