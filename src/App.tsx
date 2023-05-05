import { useState, useEffect } from 'react';
import Header from './components/containers/Header';
import MainSidebar from './components/containers/MainSidebar';
import Page from './components/containers/Page';
import LoginForm from './components/popups/LoginForm';
import SetNameForm from './components/popups/SetNameForm';
import UserSchema from './schemas/user';

type Props = {
  pageType: string,
  user: UserSchema | undefined,
  setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>,
}

export default function App({pageType, user, setUser}: Props) {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSetName, setShowSetName] = useState<boolean>(false);
  const [canLogin, setCanLogin] = useState<boolean>(false);
  const toggleLoginForm = () => setShowLogin(!showLogin);
  const toggleShowSetName = () => setShowSetName(!showSetName);
  const toggleCanLogin = () => setCanLogin(!canLogin);

  useEffect(() => {
    if(window.localStorage.getItem('emailForSignIn') && !user) {
      toggleLoginForm();
      toggleCanLogin();
    }
    /*eslint-disable-next-line*/
  }, []);

  useEffect(() => {
    if(user && user.name === 'Anon') {
      toggleShowSetName();
    }
    /*eslint-disable-next-line*/
  }, [user]);

  return (
    <div className="App">
      <Header
        user={user}
        setUser={setUser}
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
      {showSetName
      &&
      <SetNameForm 
        user={user}
        toggleShowSetName={toggleShowSetName}
      />
      }
    </div>
  );
}
