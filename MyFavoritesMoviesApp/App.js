import './config/ReactotronConfig';
import React from 'react';
import { StyleSheet, Text, View, Platform, FlatList } from 'react-native';
import { Constants } from 'expo';
import MovieItem from './components/MovieItem';

const isFavorite = (myMoviesFavorites, item) => {
  return myMoviesFavorites.filter(({ id }) => item.id === id).length >= 1;
}

export default class App extends React.Component {
  state = {
    movies: [],
    myMoviesFavorites: [],
  };

  async componentDidMount() {
    const currentYear = new Date().getFullYear();
    const url = "https://api.themoviedb.org/3/discover/movie" +
      `?primary_release_year=${currentYear}` +
      "&page=1" +
      "&include_video=false" +
      "&include_adult=false" +
      "&sort_by=popularity.desc" +
      "&language=pt-BR" +
      "&api_key=0fb146bada56315435ff4e5df46205c5";

    const movieCall = await fetch(url);
    const response = await movieCall.json();

    const movies = response.results;

    this.setState({
      movies: movies
    })
  }

  handleToggleFavorite = (item) => {
    this.setState((currentState) => {
      if (isFavorite(currentState.myMoviesFavorites, item)){
        return {
          myMoviesFavorites: currentState.myMoviesFavorites.filter(({ id }) => {
            return id !== item.id;
          })
        };
      }

      return {
        myMoviesFavorites: currentState.myMoviesFavorites.concat([{ id: item.id }])
      };
    }, () => {
        console.log(this.state.myMoviesFavorites);
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filmes do Ano</Text>
        </View>
        <FlatList
          data={ this.state.movies }
          numColumns={3}
          renderItem={({ item }) => (
            <MovieItem 
              item={item} 
              onToggleFavorite={() => this.handleToggleFavorite(item)} 
              isFavorite={isFavorite(this.state.myMoviesFavorites, item)}
            />
          )}
          keyExtractor={(item) => `${item.id}`}
          extraData={this.state.myMoviesFavorites}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Constants.statusBarHeight + 5,
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",

  }
});
