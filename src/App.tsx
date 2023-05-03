import { useState, useEffect } from 'react';
import Header from './components/containers/Header';
import MainSidebar from './components/containers/MainSidebar';
import Page from './components/containers/Page';
import LoginForm from './components/containers/LoginForm';
import UserSchema from './schemas/user';

type Props = {
  pageType: string,
  user: UserSchema | undefined,
  setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>,
}

export default function App({pageType, user, setUser}: Props) {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [canLogin, setCanLogin] = useState<boolean>(false);
  const toggleLoginForm = () => setShowLogin(!showLogin);
  const toggleCanLogin = () => setCanLogin(!canLogin);

  useEffect(() => {
    if(window.localStorage.getItem('emailForSignIn') && !user) {
      toggleLoginForm();
      toggleCanLogin();
    }
    /*eslint-disable-next-line*/
  }, []);

  return (
    <div className="App">
      <Header
        user={user}
        toggleLoginForm={toggleLoginForm}
      />
      <MainSidebar />
      <Page 
        pageType={pageType} 
        user={user}
      />
      {showLogin
      && 
      <LoginForm 
        toggleLoginForm={toggleLoginForm}
        canLogin={canLogin}
        toggleCanLogin={toggleCanLogin}
        setUser={setUser}
      />
      }
    </div>
  );
}
