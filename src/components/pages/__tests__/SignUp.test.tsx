import 'react-native';

import * as fbService from '../../../services/firebase';

import React, {ReactElement} from 'react';
import {RenderAPI, render} from '@testing-library/react-native';
import {createTestElement, createTestProps} from '../../../../test/testUtils';

import Page from '../SignUp';

let props: any;
let component: ReactElement;
let testingLib: RenderAPI;

jest.mock('../../../services/firebase', () => {
  return {
    currentUser: {
      displayName: 'testDisplayName',
      email: 'test@test.com',
      emailVerified: true,
    },
  };
});

describe('Rendering', () => {
  beforeEach(() => {
    props = createTestProps({
      navigation: {
        setOptions: jest.fn(),
      },
    });

    component = createTestElement(<Page {...props} />);
    testingLib = render(component);
  });

  it('renders without crashing', () => {
    const baseElement = testingLib.toJSON();

    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

describe('Interaction', () => {
  beforeEach(() => {
    props = createTestProps({
      navigation: {
        setOptions: jest.fn(),
      },
    });

    component = createTestElement(<Page {...props} />);
    testingLib = render(component);
  });

  it('should simulate onClick', () => {
    expect(testingLib.toJSON()).toMatchSnapshot();
    // const btn = testingLib.queryByTestId('btn');
    // act(() => {
    //   fireEvent.press(btn);
    //   fireEvent.press(btn);
    // });
    // expect(cnt).toBe(3);
  });
});