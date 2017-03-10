import React, { Component } from 'react';
import {
  AppRegistry,
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  WebView,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import moment from 'moment';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FF6600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
  },
  details: {
    fontSize: 10,
    textAlign: 'left',
    margin: 10,
  },
});

async function getTopStoriesFromApi() {
  try {
    let response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    let responseJson = await response.json();
    let stories = await getStoriesFromIds(responseJson, 50);
    return stories;
  } catch (error) {
    console.error(error);
  }
}

function getStoriesFromIds(ids, numStories) {
  return Promise.all(ids.slice(0, numStories).map(id => fetch('https://hacker-news.firebaseio.com/v0/item/' + id + '.json').then(resp => resp.json())));
}

function getCommentsFromItem(item, list, level) {
  if (!item.hasOwnProperty('kids')) {
    item.kids = [];
  }

  return Promise.all(item.kids
    .map(kid => fetch('https://hacker-news.firebaseio.com/v0/item/' + kid + '.json')
      .then(resp => resp.json())
      .then(i => { i.level = level + 1; list.push(i); return getCommentsFromItem(i, list, level + 1) })));
}

function transformCommentText(text) {
  return String(text)
    .replace(/<p>/g, '\n\n')
    .replace(/&#x27;/g, '\'')
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)" rel="nofollow">(.*)?<\/a>/g, "$1");
}

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Top Stories',
    header: {
      tintColor: '#FFFFFF',
      style: styles.toolbar,
    },
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      refreshing: false,
      dataSource: this.ds.cloneWithRows([])
    };

    getTopStoriesFromApi()
      .then(stories => {
        this.setState({
          dataSource: this.ds.cloneWithRows(stories)
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableHighlight
              onPress={() => navigate('Comments', { post: rowData })}>
              <View>
                <Text style={styles.title}>{rowData.title}</Text>
                <Text style={styles.details}>{rowData.score} points by {rowData.by} {moment(+rowData.time * 1000).fromNow()} | {rowData.descendants || 0} comments</Text>
              </View>
            </TouchableHighlight>
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderSeparator={this._renderSeparator}
        />
      </View>
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    getTopStoriesFromApi()
      .then(stories => {
        this.setState({
          refreshing: false,
          dataSource: this.ds.cloneWithRows(stories)
        });
      });
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }
}

class CommentsScreen extends React.Component {
  static navigationOptions = {
    title: ({ state }) => `${state.params.post.title}`,
    header: {
      tintColor: '#FFFFFF',
      style: styles.toolbar,
    },
  };

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      refreshing: false,
      dataSource: this.ds.cloneWithRows([])
    };

    const list = [];

    getCommentsFromItem(props.navigation.state.params.post, list, 0)
      .then(stories => {
        this.setState({
          dataSource: this.ds.cloneWithRows(list)
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={{ margin: 20 }}>
          <TouchableHighlight
            onPress={() => navigate('Article', { post: params.post })}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>Article</Text>
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <View style={{ paddingLeft: rowData.level * 20 }}>
              <View style={{ paddingBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#888888' }}>{rowData.by}, {moment(+rowData.time * 1000).fromNow()}</Text>
              </View>
              <View>
                <Text>{transformCommentText(rowData.text)}</Text>
              </View>
            </View>
          )
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderSeparator={this._renderSeparator}
        />
      </View >
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    getStoriesFromIds(this.props.navigation.state.params.post.kids)
      .then(stories => {
        this.setState({
          refreshing: false,
          dataSource: this.ds.cloneWithRows(stories)
        });
      });
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }
}

class ArticleScreen extends React.Component {
  static navigationOptions = {
    title: ({ state }) => `${state.params.post.title}`,
  };

  render() {
    const { params } = this.props.navigation.state;

    return (
      <WebView
        source={{ uri: params.post.url }}
      />
    );
  }
}

const HackerNews = StackNavigator({
  Home: { screen: HomeScreen },
  Comments: { screen: CommentsScreen },
  Article: { screen: ArticleScreen },
});

AppRegistry.registerComponent('HackerNews', () => HackerNews);
