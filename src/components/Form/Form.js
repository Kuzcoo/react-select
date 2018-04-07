import React, {Component} from 'react';
import {Select} from '../Select/Select';
import './Form.css';

const MOCK_URL = './mocks/fruits.json';

const DEFAULT_VALUE = 'Choose a fruit';

export class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fruitValue: DEFAULT_VALUE,
      fruits: []
    }

    this.updateFruitValue = this.updateFruitValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch(MOCK_URL)
      .then(response => response.json())
      .then(json => {
        setTimeout(() => {
          this.setState({
            fruits: json.fruits
          })
        }, 1000);
      });
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
        {this.state.fruits.length > 0
          ? <Select
            onChooseItem={this.updateFruitValue}
            selectedValue={this.state.fruitValue}
            options={this.state.fruits} />
          : <div>Load data...</div>
        }

        <input type='submit' value='Submit!' />
      </form>
    );
  }
}