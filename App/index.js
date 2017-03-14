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

const API_ENDPOINT = 'http://node-hnapi.herokuapp.com/';

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

async function fetchTopStories(page = 1) {
  try {
    let response = await fetch(API_ENDPOINT + 'news?page=' + page);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function fetchItem(id) {
  try {
    let response = await fetch(API_ENDPOINT + 'item/' + id);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function flattenComments(item) {
  const list = [];
  item.comments.map(it => traverse(it, list));

  return list;
}

function traverse(item, list) {
  list.push(item);
  item.comments.map(it => traverse(it, list));
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

    fetchTopStories()
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
                <Text style={styles.details}>{rowData.points} points by {rowData.user} {rowData.time_ago} | {rowData.comments_count || 0} comments</Text>
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
          enableEmptySections={true}
        />
      </View>
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    fetchTopStories()
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

    fetchItem(props.navigation.state.params.post.id)
      .then(item => {
        this.setState({
          dataSource: this.ds.cloneWithRows(flattenComments(item))
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
            <View style={{ paddingLeft: rowData.level * 10 + 10 }}>
              <View style={{ paddingBottom: 0 }}>
                <Text style={{ fontWeight: 'bold', color: '#888888' }}>{rowData.user}, {rowData.time_ago}</Text>
              </View>
              <View>
                <Text>{transformCommentText(rowData.content)}</Text>
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
          enableEmptySections={true}
        />
      </View >
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    fetchItem(this.props.navigation.state.params.post.id)
      .then(item => {
        this.setState({
          refreshing: false,
          dataSource: this.ds.cloneWithRows(flattenComments(item))
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
