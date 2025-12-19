// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint256 public totalOccasions = 0;
    uint256 public totalTickets = 0;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTakenPerOccasion;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;

        occasions[totalOccasions] = Occasion({
            id: totalOccasions,
            name: _name,
            cost: _cost,
            tickets: _maxTickets,
            maxTickets: _maxTickets,
            date: _date,
            time: _time,
            location: _location
        });
    }

    function buyTicket(uint256 _id, uint256 _seatNumber) public payable {
        require(totalOccasions > 0, "No occasions available");
        require(_id > 0 && _id <= totalOccasions, "Invalid occasion ID");
        require(occasions[_id].tickets > 0, "No tickets available for this occasion");
        require(msg.value >= occasions[_id].cost, "Insufficient funds to buy ticket");
        require(seatTaken[_id][_seatNumber] == address(0), "Seat already taken");
        require(_seatNumber <= occasions[_id].maxTickets, "Invalid seat number");

        occasions[_id].tickets--;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seatNumber] = msg.sender; // Assign seat to buyer
        seatsTakenPerOccasion[_id].push(_seatNumber);

        totalTickets++;

        _safeMint(msg.sender, totalTickets);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTakenPerOccasion[_id];
    }

    function withdraw() public onlyOwner {
        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
