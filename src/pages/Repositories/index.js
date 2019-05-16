import React, { Component } from 'react';
import {
  View, Alert, ActivityIndicator, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import Header from '~/components/Header';
import api from '~/services/api';
import styles from './styles';
import RepositoryItem from './RepositoryItem';

class Repositories extends Component {
  state = {
    data: [],
    loading: true,
    refreshing: false
  };

  componentDidMount() {
    this.loadRepositories();
  }

  loadRepositories = async () => {
    this.setState({ loading: true, refreshing: true });
    try {
      const username = await AsyncStorage.getItem('@githuber:username');
      const { data } = await api.get(`/users/${username}/repos`);
      this.setState({ data });
    } catch (error) {
      Alert.alert('Não foi possível buscar seus repositórios');
    } finally {
      this.setState({ loading: false, refreshing: false });
    }
  };

  renderListItem = ({ item }) => <RepositoryItem repository={item} />;

  renderList = () => {
    const { data, refreshing } = this.state;
    return (
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={this.renderListItem}
        onRefresh={this.loadRepositories}
        refreshing={refreshing}
      />
    );
  };

  render() {
    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <Header title="Repositórios" />
        {loading ? <ActivityIndicator size="large" style={styles.loading} /> : this.renderList()}
      </View>
    );
  }
}
const TabIcon = ({ tintColor }) => <Icon name="list-alt" size={20} color={tintColor} />;

TabIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Repositories.navigationOptions = {
  tabBarIcon: TabIcon,
};

export default Repositories;
