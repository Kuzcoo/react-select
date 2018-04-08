import React from 'react';
import {Select} from './Select';
import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

const KEY = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  SPACE: 32
};

const options = [
  {id: 0, name: 'banana'},
  {id: 1, name: 'cherry'},
  {id: 2, name: 'orange'},
  {id: 3, name: 'strawberry'}
];

const DEFAULT_VALUE = 'Choose a fruit';

const click = (element, shouldPreventDefault) => {
  element.simulate(
    'click', 
    shouldPreventDefault ? {preventDefault() {}} : null);
};

const triggerKey = (element, keyCode) => {
  element.simulate(
    'keyDown',
    {preventDefault() {}, keyCode: keyCode}
  );
};

let component;
let toggleBtn;
let optionItems;
let selectParentEl;

beforeEach(() => {
  component = shallow(
    <Select
      defaultValue={DEFAULT_VALUE}
      options={options} />
  );

  toggleBtn = component.find('button');
  optionItems = component.find('li');
  selectParentEl = component.find('div');
})

describe('methods', () => {
  describe('getClassState()', () => {
    it('should return an empty string when select closed', () => {
      expect(component.instance().getClassState()).toBe('');
    })
    it('should return "is-open" string when select opened', () => {
      click(toggleBtn, true);
      expect(component.instance().getClassState()).toBe('is-open');
    })
  });

  describe('getOptionClassState()', () => {
    it('should return an empty string when optionId param does not match focusIndex value', () => {
      const optionId = 1;
      click(toggleBtn, true);
      triggerKey(selectParentEl, KEY.DOWN);
      expect(component.instance().getOptionClassState(optionId))
        .toBe('');
    });

    it('should return "is-focus" string when optionId does match focusIndex value', () => {
      const optionId = 1;
      click(toggleBtn, true);
      triggerKey(selectParentEl, KEY.DOWN);
      triggerKey(selectParentEl, KEY.DOWN);
      expect(component.instance().getOptionClassState(optionId))
        .toBe('is-focus');
    });
  });

  describe('getOptionIdByIndex()', () => {
    it('should return null when focusIndex is not set', () => {
      expect(component.instance().getOptionIdByIndex(-1)).toBeNull();
    });
    it('should return option dom id when focusIndex is set', () => {
      expect(component.instance().getOptionIdByIndex(1))
        .toBe('select-option-1');
    });
  });

  describe('getPrevIndex()', () => {
    it('should return the previous index without going under 0', () => {
      expect(component.instance().getPrevIndex(0))
        .toBe(0);
      expect(component.instance().getPrevIndex(1))
        .toBe(0);
      expect(component.instance().getPrevIndex(7))
        .toBe(6);
    });
  });

  describe('getNextIndex()', () => {
    it('should return the next index wihtout overflows options length', () => {
      expect(component.instance().getNextIndex(0))
        .toBe(1);
      expect(component.instance().getNextIndex(2))
        .toBe(3);
      expect(component.instance().getNextIndex(3))
        .toBe(3);
    });
  });

  describe('getOptionNameByIndex()', () => {
    it('should return an option name value from a given index', () => {
      const index = 2;
      expect(component.instance().getOptionNameByIndex(index))
        .toBe(options[index].name);
    });
  });
});

describe('select structure', () => {
  it('should have a toggle btn', () => {
    expect(toggleBtn.length).toBe(1);
  });

  it('should have a default value', () => {
    expect(toggleBtn.text()).toBe(DEFAULT_VALUE);
    expect(toggleBtn.get(0).props.value).toBe(DEFAULT_VALUE);
  });

  it('should have a list of options', () => {
    expect(component.find('.select__option').length).toBe(4);
  });
});

describe('click interaction', () => {
  it('shoud be closed by default', () => {
    expect(component.instance().state.isOpen).toBe(false);
  });

  it('should open when toggle button is clicked', () => {
    click(toggleBtn, true);
    expect(component.instance().state.isOpen).toBe(true);
  });

  it('should close when an option is clicked', () => {
    click(toggleBtn, true);
    optionItems.at(1).simulate('mousedown', {preventDefault(){}});
    expect(component.instance().state.isOpen).toBe(false);
  });

  it('should update toggle btn text value when option clicked', () => {
    const optionIndex = 1;

    click(toggleBtn, true);
    optionItems.at(optionIndex)
      .simulate('mousedown', {preventDefault(){}});

    expect(component.find('button').text()).toBe(options[optionIndex].name); 
  });

  it('should close select when clicked outside', () => {
    click(toggleBtn, true);
    expect(component.instance().state.isOpen).toBe(true);
    toggleBtn.simulate('blur');
    expect(component.instance().state.isOpen).toBe(false);
  });
});

describe('keyboard navigation', () => {
  it('should open select when DOWN ARROW key is pressed', () => {
    expect(component.instance().state.isOpen).toBe(false);
    triggerKey(selectParentEl, KEY.DOWN);
    expect(component.instance().state.isOpen).toBe(true);  
  });

  it('should update pseudo focus on selected item when DOWN/UP arrow key is pressed', () => {
    triggerKey(selectParentEl, KEY.DOWN);
    expect(component.instance().state.isOpen).toBe(true);  
    expect(optionItems.at(0).hasClass('is-focus')).toBe(false);
    triggerKey(selectParentEl, KEY.DOWN);
    expect(component.instance().state.focusIndex).toBe(0);
    triggerKey(selectParentEl, KEY.DOWN);
    expect(component.instance().state.focusIndex).toBe(1);
    triggerKey(selectParentEl, KEY.UP);
    expect(component.instance().state.focusIndex).toBe(0);
  });

  it('should close select when ESCAPE key is pressed', () => {
    triggerKey(selectParentEl, KEY.DOWN);
    expect(component.instance().state.isOpen).toBe(true);
    triggerKey(selectParentEl, KEY.ESC);
    expect(component.instance().state.isOpen).toBe(false);
  });

  it('should update selected value when ENTER key is pressed', () => {
    const optionIndex = 2;

    click(toggleBtn, true);
    // focusIndex starts at -1
    for (let i = -1; i < optionIndex; i++) {
      triggerKey(selectParentEl, KEY.DOWN);    
    }
    triggerKey(selectParentEl, KEY.ENTER);
    expect(component.instance().state.selectedValue)
      .toBe(options[optionIndex].name);
  });

  it('should update selected value when SPACE key is pressed', () => {
    const optionIndex = 2;

    click(toggleBtn, true);
    // focusIndex starts at -1
    for (let i = -1; i < optionIndex; i++) {
      triggerKey(selectParentEl, KEY.DOWN);    
    }
    triggerKey(selectParentEl, KEY.SPACE);
    expect(component.instance().state.selectedValue)
      .toBe(options[optionIndex].name);
  });
});
