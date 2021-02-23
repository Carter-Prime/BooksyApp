import React from 'react';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

const App = () => {
  return (
    <SafeAreaProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <MainProvider>
          <Navigator />
        </MainProvider>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
};

export default App;
