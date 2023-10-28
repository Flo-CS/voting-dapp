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
        uint[] votedProposalIds;
        address addr;
    }

    event VoterRegistered(address voterAddress);
    event VoterUnregistered(address voterAddress);
    event Voted(address voter, uint proposalId);
    event CancelledVote(address voter, uint proposalId);

    mapping(address => uint) addressToVoterId;
    Voter[] voters;

    uint public numberOfAdditionalVotesAllowed = 0;

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

    /* ------------------------------ Vote subject ------------------------------ */

    string public voteSubject;

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

            uint[] memory votedProposalIds;
            voters.push(Voter(true, false, votedProposalIds, _voterAddress));

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

    function restart() public onlyOwner {
        WorkflowStatus _newStatus = WorkflowStatus.RegisteringVoters;
        WorkflowStatus _previousStatus = currentStatus;
        currentStatus = _newStatus;

        delete proposals;

        for (uint i = 0; i < voters.length; i++) {
            voters[i].hasVoted = false;
            delete voters[i].votedProposalIds;
        }

        emit WorkflowStatusChange(_previousStatus, _newStatus);
    }

    function setVoteSubject(
        string memory _voteSubject
    )
        public
        onlyOwner
        onlyDuringWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        voteSubject = _voteSubject;
    }

    function setNumberOfAdditionalVotesAllowed(
        uint _numberOfAdditionalVotesAllowed
    )
        public
        onlyOwner
        onlyDuringWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        numberOfAdditionalVotesAllowed = _numberOfAdditionalVotesAllowed;
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

        Voter storage voter = voters[addressToVoterId[msg.sender]];

        require(
            voter.votedProposalIds.length < numberOfAdditionalVotesAllowed + 1,
            "You have already used all your additional votes"
        );
        require(
            !hasVotedFor(msg.sender, _proposalId),
            "You have already voted for this proposal"
        );

        voter.votedProposalIds.push(_proposalId);
        voter.hasVoted = true;
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
        Voter storage voter = voters[addressToVoterId[msg.sender]];

        require(voter.hasVoted, "You have not voted yet");
        require(
            hasVotedFor(msg.sender, _proposalId),
            "You have not voted for this proposal"
        );

        removeVotedProposalId(msg.sender, _proposalId);
        if (voter.votedProposalIds.length == 0) {
            voter.hasVoted = false;
        }
        proposals[_proposalId].votesCount--;

        emit CancelledVote(msg.sender, _proposalId);
    }

    function removeVotedProposalId(
        address _voterAddress,
        uint _proposalId
    )
        private
        onlyRegisteredVoter
        onlyDuringWorkflowStatus(WorkflowStatus.VotingSessionStarted)
    {
        Voter storage voter = voters[addressToVoterId[_voterAddress]];

        uint proposalIndex = 0;
        for (uint i = 0; i < voter.votedProposalIds.length; i++) {
            if (voter.votedProposalIds[i] == _proposalId) {
                proposalIndex = i;
                break;
            }
        }

        require(
            proposalIndex < voter.votedProposalIds.length,
            "Proposal id does not exist"
        );

        voter.votedProposalIds[proposalIndex] = voter.votedProposalIds[
            voter.votedProposalIds.length - 1
        ];
        voter.votedProposalIds.pop();
    }

    function hasVotedFor(
        address _voterAddress,
        uint _proposalId
    ) private view onlyRegisteredVoter returns (bool) {
        Voter memory voter = voters[addressToVoterId[_voterAddress]];

        for (uint i = 0; i < voter.votedProposalIds.length; i++) {
            if (voter.votedProposalIds[i] == _proposalId) {
                return true;
            }
        }

        return false;
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
            uint[] memory additionalVotedProposalIds;
            return
                Voter(false, false, additionalVotedProposalIds, _voterAddress);
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
        require(proposals.length > 0, "No proposals");

        uint winningProposalId = 0;
        uint winningVotesCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].votesCount > winningVotesCount) {
                winningProposalId = i;
                winningVotesCount = proposals[i].votesCount;
            }
        }

        return (proposals[winningProposalId], winningProposalId);
    }
}
