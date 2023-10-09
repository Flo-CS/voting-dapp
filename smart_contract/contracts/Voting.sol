// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

// Don't know why, but solidity can't resolve the import without node_modules
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
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

    mapping(address => Voter) voters;
    Proposal[] public proposals;
    WorkflowStatus public workflowStatus = WorkflowStatus.RegisteringVoters;
    uint private winningProposalId;

    /** MODIFIERS */

    modifier onlyRegistered() {
        require(
            voters[msg.sender].isRegistered,
            "You are not registered to vote"
        );
        _;
    }

    modifier onlyDuringWorkflowStatus(WorkflowStatus _status) {
        require(workflowStatus == _status, "You can't do this right now");
        _;
    }

    /** ADMINISTRATOR ACTIONS */

    function registerVoter(address _voterAddress) public onlyOwner {
        voters[_voterAddress] = Voter(true, false, 0);
        emit VoterRegistered(_voterAddress);
    }

    function startProposalsRegistration() public onlyOwner {
        changeWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted);
    }

    function endProposalsRegistration() public onlyOwner {
        changeWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVotingSession() public onlyOwner {
        changeWorkflowStatus(WorkflowStatus.VotingSessionStarted);
    }

    function changeWorkflowStatus(WorkflowStatus _newStatus) private {
        require(
            _newStatus > workflowStatus,
            "New status must be after the current status"
        );
        WorkflowStatus _previousStatus = workflowStatus;
        workflowStatus = _newStatus;

        emit WorkflowStatusChange(_previousStatus, _newStatus);
    }

    /** VOTERS ACTIONS */

    function getWinningProposal()
        public
        view
        onlyDuringWorkflowStatus(WorkflowStatus.VotesTallied)
        returns (Proposal memory)
    {
        return proposals[winningProposalId];
    }

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
        require(!voters[msg.sender].hasVoted, "You have already voted");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        updateWinningProposalId(_proposalId);

        emit Voted(msg.sender, _proposalId);
    }

    /** UTILS */

    function updateWinningProposalId(uint _newVotedProposalId) private {
        uint winningProposalVoteCount = proposals[winningProposalId].voteCount;
        if (
            proposals[_newVotedProposalId].voteCount > winningProposalVoteCount
        ) {
            winningProposalId = _newVotedProposalId;
        }
    }
}
