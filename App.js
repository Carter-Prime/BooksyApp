import React from 'react';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';

import {ConfirmProvider} from 'react-native-confirm-dialog';

const App = () => {
  return (
    <ConfirmProvider>
      <MainProvider>
        <Navigator />
      </MainProvider>
    </ConfirmProvider>
  );
};

export default App;
