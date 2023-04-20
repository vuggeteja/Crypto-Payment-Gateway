import React, { Component } from "react";
// import "./styles.css";

class Header extends Component {
  state = {
    dropdownOpen: false
  };

  handleToggleClick = () => {
    // code to handle click on the toggle button
  };

  handleDropdownClick = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    return (
      <nav>
        
        <div className="toggle" onClick={this.handleToggleClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="dropdown" onClick={this.handleDropdownClick}>
          Dropdown
          {this.state.dropdownOpen && (
            <div className="dropdown-content">
              <a href="#">Settings</a>
              <a href="#">Logout</a>
              
            </div>
          )}
        </div>
      </nav>
    );
  }
}

export default Header;
