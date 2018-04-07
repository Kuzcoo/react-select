import React, {Component} from 'react';
import {Select} from '../Select/Select';
import './Form.css';

const options = [
  {id: 0, name: 'strawberry'},
  {id: 1, name: 'banana'},
  {id: 2, name: 'apple'},
  {id: 3, name: 'cherry'},
  {id: 4, name: 'orange'}
];

const DEFAULT_VALUE = 'Choose a fruit';

export class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fruitValue: DEFAULT_VALUE
    }

    this.updateFruitValue = this.updateFruitValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateFruitValue(name) {
    this.setState({
      fruitValue: name
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    console.info(`[info] - Enjoy your ${this.state.fruitValue}!`);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>React Select Poc</h2>
        <Select 
          onChooseItem={this.updateFruitValue}
          selectedValue={this.state.fruitValue}
          options={options} />

        <input type='submit' value='Submit!' />
      </form>
    );
  }
}