// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IERC8004IdentityRegistry
 * @dev Interface for ERC-8004 Identity Registry
 * Each agent is represented as an ERC-721 token
 */
interface IERC8004IdentityRegistry {
    /**
     * @dev Returns the AgentID (tokenId) for a given agent
     * @param agentId The unique identifier of the agent
     * @return tokenId The token ID representing the agent
     */
    function getAgentId(uint256 agentId) external view returns (uint256);

    /**
     * @dev Returns the metadata URI for an agent
     * @param tokenId The token ID representing the agent
     * @return metadataURI The URI pointing to the agent's metadata
     */
    function getAgentMetadataURI(uint256 tokenId) external view returns (string memory metadataURI);

    /**
     * @dev Checks if a token ID represents a valid agent
     * @param tokenId The token ID to check
     * @return bool True if the token represents a valid agent
     */
    function isValidAgent(uint256 tokenId) external view returns (bool);

    /**
     * @dev Event emitted when a new agent is registered
     * @param tokenId The token ID of the registered agent
     * @param agentOwner The address that owns the agent
     */
    event AgentRegistered(uint256 indexed tokenId, address indexed agentOwner);
}
