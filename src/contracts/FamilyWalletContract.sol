// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract FamilyWallet {

    uint constant shift = 1;

    string public walletName;
    address public walletOwner;
    uint256 public dayLimit;
    uint256 public deployDate;
    mapping(address => uint256) public parents;
    mapping(address => uint256) public children;
    address[] public parentList;
    address[] public childList;

    constructor(string memory _name, uint256 _dayLimit) {
        walletName = _name;
        walletOwner = msg.sender;
        deployDate = block.timestamp;
        dayLimit = _dayLimit;
    }

    function addMoney() public payable {
        require(msg.value != 0, "You need to deposit some amount of money!");
        require(parents[msg.sender] > 0, "You need to be in the list of parents");
    }

    function setDayLimitParent(uint256 _limit) external {
        require(msg.sender == walletOwner, "You must be the owner");
        dayLimit = _limit;
    }

    function addParent(address _parent) external {
        require(msg.sender == walletOwner, "You must be the owner to add parent");
        require(parents[_parent] == 0, "Parent is already in the list of parents");
        require(children[_parent] == 0, "Address is already in the list of children");
        parents[_parent] = shift;
        parentList.push(_parent);
    }

    function addChild(address _child) external {
        require(msg.sender == walletOwner, "You must be the owner to add parent");
        require(children[_child] == 0, "Child is already in the list of children");
        require(parents[_child] == 0, "Address is already in the list of parents");
        children[_child] = dayLimit + shift;
        childList.push(_child);
    }

    function withdrawMoney(address payable _to, uint256 _total) public payable {
        uint amount = _getWithdrawAmount();
        require(amount > 0, "Daily spending exceeded");
        require(amount >= _total, "Not enough money to withdraw");
        require(_total <= address(this).balance, "Not enough money in wallet");
        children[msg.sender] += _total;
        _to.transfer(_total);
    }

    function getWithdrawAmount() public view returns (uint256) {
        uint amount = _getWithdrawAmount();
        uint total = address(this).balance;
        return amount <= total ? amount : total;
    }

    function getWalletBalance() public view returns (uint256) {
        require(children[msg.sender] > 0 || parents[msg.sender] > 0 , "You are not from this family");
        return address(this).balance;
    }

    function getParents() public view returns (address[] memory) {
        return parentList;
    }

    function getChildren() public view returns (address[] memory) {
        return childList;
    }

    function _getWithdrawAmount() private view returns (uint256) {
        require(children[msg.sender] > 0, "Address isn't in children list");
        uint daysDiff = (block.timestamp - deployDate) / (60 * 60 * 24);
        return daysDiff * dayLimit - children[msg.sender] - shift;
    }
}
