import React from 'react';
import {
  Scene,
  Stack,
  Router,
  Actions,
  ActionConst
} from 'react-native-router-flux';

import Home from './components/Home';
import Game from './components/Game';

const RouterComponent = () => {
  return (
    <Router showNavigationBar={false}>
      <Stack key="root" hideNavBar>
        <Stack key="game" hideNavBar>
          <Scene key="game" component={Game} hideNavBar title="Game" />
        </Stack>
        <Stack key="main">
          <Scene key="home" component={Home} />
        </Stack>
      </Stack>
    </Router>
  );
};

export default RouterComponent;