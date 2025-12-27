import React from 'react';
import Content from '@theme-original/Navbar/Content';
import { AuthWidget } from '../../../components/AuthWidget';
import { PersonalizationButton } from '../../../components/PersonalizationButton';
import styles from './styles.module.css';

export default function ContentWrapper(props) {
  return (
    <>
      <Content {...props} />
      <div className={styles.customNavbarItems}>
        <PersonalizationButton />
        <AuthWidget />
      </div>
    </>
  );
}
