import React from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import { UserMenu } from '../../components/Auth/UserMenu';
import TranslationToggle from '../../components/TranslationToggle';
import styles from './styles.module.css';

export default function Navbar(props) {
  return (
    <div className={styles.navbarWrapper}>
      <OriginalNavbar {...props} />
      <div className={styles.userMenuWrapper}>
        <TranslationToggle />
        <UserMenu />
      </div>
    </div>
  );
}
