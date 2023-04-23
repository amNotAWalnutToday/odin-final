import { useState } from 'react';
import Header from './components/Header';
import MainSidebar from './components/MainSidebar';
import Page from './components/Page';
import LoginForm from './components/LoginForm';

type Props = {
  pageType: string,
}

export default function App({pageType}: Props) {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const toggleLoginForm = () => setShowLogin(!showLogin);

  return (
    <div className="App">
      <Header
        toggleLoginForm={toggleLoginForm}
      />
      <MainSidebar />
      <Page pageType={pageType} />
      {showLogin
      && <LoginForm />
      }
    </div>
  );
}
