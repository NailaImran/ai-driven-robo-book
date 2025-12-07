import React from 'react';
import { useHistory } from '@docusaurus/router';
import { AuthGateway } from '../../components/Auth/AuthGateway';
import Layout from '@theme/Layout';

export default function SignupPage() {
  const history = useHistory();

  const handleAuthSuccess = () => {
    history.push('/');
  };

  return (
    <Layout
      title="Sign Up"
      description="Create your Physical AI Textbook account"
    >
      <AuthGateway onAuthSuccess={handleAuthSuccess} redirectTo="/" />
    </Layout>
  );
}
