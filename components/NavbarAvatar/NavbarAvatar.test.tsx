import React from 'react';
import { render } from '@testing-library/react';
import { NavbarAvatar } from './NavbarAvatar';

describe('NavbarAvatar', () => {
  it('renders correctly', () => {
    const { container } = render(<NavbarAvatar myProp="foo" />);
    expect(container).toMatchSnapshot();
  });
});