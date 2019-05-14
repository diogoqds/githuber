import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import api from '~/services/api';
import { colors } from '~/styles';

class Welcome extends Component {
  state = {
    username: '',
    loading: false,
    error: false,
  };

  checkUserExists = async (username) => {
    const user = await api.get(`/users/${username}`);
    return user;
  };

  saveUser = async (username) => {
    try {
      await AsyncStorage.setItem('@githuber:username', username);
    } catch (error) {
      console.tron.log('Não foi possivel salvar');
    }
  };

  signIn = async () => {
    const { username } = this.state;
    // eslint-disable-next-line react/prop-types
    const { navigation } = this.props;
    this.setState({ loading: true, error: null });
    try {
      await this.checkUserExists(username);
      await this.saveUser(username);

      navigation.navigate('Repositories');
    } catch (err) {
      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const { username, loading, error } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.text}>
          Para continuar precisamos que você informe o seu usuário no Github.
        </Text>

        {error && <Text style={styles.error}>Usuário inexistente</Text>}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Digite seu usuário"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ username: text })}
          />

          <TouchableOpacity style={styles.button} onPress={this.signIn}>
            {loading ? (
              <ActivityIndicator style={styles.loadingIcon} color={colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Prosseguir</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Welcome;
