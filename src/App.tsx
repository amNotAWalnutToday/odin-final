import { useState, useEffect } from 'react';
import Header from './components/containers/Header';
import MainSidebar from './components/containers/MainSidebar';
import Page from './components/containers/Page';
import LoginForm from './components/popups/LoginForm';
import SetNameForm from './components/popups/SetNameForm';
import CreateCommunityForm from './components/popups/CreateCommunityForm';
import UserSchema from './schemas/user';

type Props = {
  pageType: string,
  user: UserSchema | undefined,
  setUser: React.Dispatch<React.SetStateAction<UserSchema | undefined>>,
}

export default function App({pageType, user, setUser}: Props) {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSetName, setShowSetName] = useState<boolean>(false);
  const [showCreateSub, setShowCreateSub] = useState<boolean>(false);
  const toggleLoginForm = () => setShowLogin(!showLogin);
  const toggleShowSetName = () => setShowSetName(!showSetName);
  const toggleShowCreateSub = () => setShowCreateSub(!showCreateSub);

  const [canLogin, setCanLogin] = useState<boolean>(false);
  const toggleCanLogin = () => setCanLogin(!canLogin);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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

  useEffect(() => {
    if(window.localStorage.getItem("darkmode")) {
      setIsDarkMode(() => true);
    }
  }, [isDarkMode]);

  return (
    <div className={`App ${isDarkMode ? 'dark' : ''}`}>
      <Header
        user={user}
        setUser={setUser}
        toggleLoginForm={toggleLoginForm}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <MainSidebar />
      <Page 
        pageType={pageType} 
        user={user}
        toggleShowCreateSub={toggleShowCreateSub}
        toggleLoginForm={toggleLoginForm}
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
      {showCreateSub
      &&
      <CreateCommunityForm 
        toggleShowCreateSub={toggleShowCreateSub}
      />
      }
    </div>
  );
}
