import React from 'react';
import {
  Scene,
  Stack,
  Router,
  Actions,
  ActionConst
} from 'react-native-router-flux';
import Game from './components/Game';

const RouterComponent = () => {
  return (
    <Router showNavigationBar={false}>
      <Stack key="root" hideNavBar>
        <Stack key="main" hideNavBar>
          <Scene key="game" component={Game} hideNavBar title="Game" />
        </Stack>
      </Stack>
    </Router>
  );
};

export default RouterComponent;