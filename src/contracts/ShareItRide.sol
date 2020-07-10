// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
import "./Token.sol";

contract ShareItRide {
    string public name;
    uint public ridesCount = 0;
    Token public token;
    mapping(uint => Ride) public rides;

    struct Ride {
        uint id;
        address requester;
        address payable rider;
        string start;
        string end;
        uint price;
        bool booked;
        bool paid;
    }

    event RideCreated (
         uint id,
        address requester,
        address payable rider,
        string start,
        string end,
        uint price,
        bool booked,
        bool paid
    );

    event RideBooked (
        uint id,
        address requester,
        address payable rider,
        string start,
        string end,
        uint price,
        bool booked,
        bool paid
    );

    event RidePaid (
        uint id,
        address requester,
        address payable rider,
        string start,
        string end,
        uint price,
        bool booked,
        bool paid
    );

    constructor(Token _token) public {
        name = "ShareIt Ride Contract";
        token = _token;
    }

    function createRide(string memory _start, string memory _end,uint _price) public {
        ridesCount++;
        rides[ridesCount] = Ride(ridesCount, msg.sender, address(0), _start, _end, _price, false, false);
        require(token.balanceOf(msg.sender) >= _price, "You do not have enough token to create this ride");
        emit RideCreated(ridesCount, msg.sender, address(0), _start, _end, _price, false, false);
    }

    function giveRide(uint _id) public payable{
        Ride memory _ride = rides[_id];
        require(_ride.id > 0 && _ride.id < ridesCount, "Ride not found");
        require(!_ride.booked, "Ride already fulfilled");
        require(_ride.requester != msg.sender, "Same user cannot fulfill the ride");
        require(token.approve(_ride.requester,_ride.price), "The requester does not have enough coins to pay");
        _ride.rider = msg.sender;
        _ride.booked = true;
        rides[_id] = _ride;
        emit RideBooked(_id,_ride.requester, msg.sender, _ride.start, _ride.end, _ride.price, true, false);
    }

    function payRide(uint _id) public payable {
        Ride memory _ride = rides[_id];
        require(_ride.id > 0 && _ride.id < ridesCount, "Ride not found");
        require(!_ride.paid, "Ride already Paid");
        require(_ride.rider != msg.sender, "Rider cannot pay for the ride");
        require(_ride.requester == msg.sender, "Only the requester can pay for the ride");
        _ride.paid = true;
        token.transferFrom(_ride.requester, _ride.rider, _ride.price);
        rides[_id] = _ride;
        emit RidePaid(_id,_ride.requester, msg.sender, _ride.start, _ride.end, _ride.price, true, false);
    }
}