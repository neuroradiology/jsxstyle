import React from 'react';
import Helmet from 'react-helmet';

import Header from '../components/header';
import './index.css';
import { Block } from 'jsxstyle';

// eslint-disable-next-line react/prop-types
const Layout = ({ children, data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Header siteTitle={data.site.siteMetadata.title} />
    <Block
      margin="0 auto"
      maxWidth={960}
      padding="0px 1.0875rem 1.45rem"
      paddingTop={0}
    >
      {children()}
    </Block>
  </div>
);

export default Layout;

// eslint-disable-next-line no-undef
export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
