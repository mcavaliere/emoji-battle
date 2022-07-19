import React from 'react';
import { render } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders correctly', () => {
    const { container } = render(<Navbar myProp="foo" />);
    expect(container).toMatchSnapshot();
  });
});