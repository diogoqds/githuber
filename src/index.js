import React, { Component } from 'react';
import { Alert } from 'react-native';
import '~/config/ReactotronConfig';
import AsyncStorage from '@react-native-community/async-storage';
import createNavigator from '~/routes';

class App extends Component {
  state = {
    userChecked: false,
    userLogged: false,
  };

  async componentDidMount() {
    try {
      const username = await AsyncStorage.getItem('@githuber:username');
      this.setState({ userChecked: true, userLogged: !!username });
    } catch (error) {
      Alert.alert('não foi possivel fazer a busca');
    }
  }

  render() {
    const { userChecked, userLogged } = this.state;

    if (!userChecked) return null;

    const Routes = createNavigator(userLogged);
    return <Routes />;
  }
}

export default App;
