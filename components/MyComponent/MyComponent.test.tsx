import React from 'react';
import { render } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { container } = render(<MyComponent myProp="foo" />);
    expect(container).toMatchSnapshot();
  });
});