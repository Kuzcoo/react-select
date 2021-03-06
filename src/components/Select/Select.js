import React, {Component} from 'react';
import propTypes from 'prop-types';
import './Select.css';

const CLASS_OPEN = 'is-open';
const CLASS_FOCUS = 'is-focus';
const KEY = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  SPACE: 32
};

export class Select extends Component {

  static propTypes = {
    defaultValue: propTypes.string.isRequired,
    options: propTypes.arrayOf(propTypes.shape({
      id: propTypes.number.isRequired,
      name: propTypes.string.isRequired
    }))
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      focusIndex: -1,
      selectedValue: this.props.defaultValue
    }

    this.toggleSelect = this.toggleSelect.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
    this.chooseItem = this.chooseItem.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.getOptionIdByIndex = this.getOptionIdByIndex.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  handleKey(e) {
    switch (e.keyCode) {
      case KEY.ENTER:
      case KEY.SPACE:
        if (this.state.isOpen && this.state.focusIndex >= 0) {
          this.chooseItem(
            this.getOptionNameByIndex(this.state.focusIndex)
          );
        }
      break;
      case KEY.ESC:
        this.closeSelect();
      break;
      case KEY.UP:
        this.setState(prevState => ({
          focusIndex: this.getPrevIndex(prevState.focusIndex)
        }));
      break;
      case KEY.DOWN:
        if (!this.state.isOpen) return this.toggleSelect(e);

        this.setState(prevState => ({
          focusIndex: this.getNextIndex(prevState.focusIndex)
        }));
      break;
    }
  }

  handleOptionClick(e, optionName) {
    this.chooseItem(optionName);
    this.toggleSelect(e);
  }

  chooseItem(optionName) {
    this.setState({
      selectedValue: optionName
    });
  }

  toggleSelect(e) {
    e.preventDefault();

    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
      focusIndex: -1
    }));
  }

  closeSelect() {
    this.setState({
      isOpen: false,
      focusIndex: -1
    });
  }

  getClassState() {
    return this.state.isOpen ? CLASS_OPEN : '';
  }

  getOptionClassState(optionId) {
    return this.state.focusIndex === optionId ?
      CLASS_FOCUS : '';
  }

  getOptionIdByIndex(index) {
    if (index === -1) return null;
    return `select-option-${index}`;
  }

  getPrevIndex(focusIndex) {
    return Math.max(focusIndex - 1, 0);
  }

  getNextIndex(focusIndex) {
    return Math.min(focusIndex + 1, this.props.options.length - 1);
  }

  getOptionNameByIndex(index) {
    return this.props.options[index].name;
  }

  render() {
    return (
      <div 
        className={`select ${this.getClassState()}`}
        onKeyDown={this.handleKey}>
        <button
          ref={this.props.value}
          value={this.state.selectedValue}
          aria-controls='select-list'
          aria-owns='select-list'
          aria-expanded={this.state.isOpen}
          aria-activedescendant={this.getOptionIdByIndex(this.state.focusIndex)}
          className='select__toggle'
          onClick={this.toggleSelect}
          onBlur={this.closeSelect}>
          {this.state.selectedValue}
        </button>
        <ul
          role='listbox'
          id='select-list'
          className='select__list'>
          {this.props.options.map(option => (
            <li
            key={'option-' + option.id}
            id={'select-option-' + option.id}
            className={`select__option ${this.getOptionClassState(option.id)}`}
            role='option'
            onMouseDown={e => this.handleOptionClick(e, option.name)}>
              {option.name}
            </li>
          ))}
        </ul>
      </div>
    );        
  }
}