import React from 'react';
import Link from 'gatsby-link';
import { Block } from 'jsxstyle';

// eslint-disable-next-line react/prop-types
const Header = ({ siteTitle }) => (
  <Block background="rebeccapurple" marginBottom="1.45rem">
    <Block margin="0 auto" maxWidth={960} padding="1.45rem 1.0875rem">
      <Block component="h1" margin={0}>
        <Block
          component={Link}
          props={{ to: '/' }}
          color="white"
          textDecoration="none"
        >
          {siteTitle}
        </Block>
      </Block>
    </Block>
  </Block>
);

export default Header;
