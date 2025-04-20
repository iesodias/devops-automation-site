import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import CustomFooter from '../../components/CustomFooter';

export default function Layout(props) {
  return (
    <>
      <OriginalLayout {...props} />
      <CustomFooter />
    </>
  );
}
