import React, { Component } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  WebView,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import Comment from './Comment';
import StoriesListView from './StoriesListView';

const API_ENDPOINT = 'http://node-hnapi.herokuapp.com/';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FF6600',
  },
});

async function fetchTopStories(page = 1) {
  try {
    const stories = [];

    for (let i = 1; i <= page; i++) {
      let response = await fetch(API_ENDPOINT + 'news?page=' + i);
      let json = await response.json();
      stories = stories.concat(json);
    }

    return stories;
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

export function flattenComments(item) {
  function traverse(item, list) {
    list.push(item);
    item.comments.map(it => traverse(it, list));
  }

  const list = [];
  item.comments.map(it => traverse(it, list));

  return list;
}

export function transformCommentText(text) {
  return String(text)
    .replace(/^<p>/, '')
    .replace(/<p>/g, '\n\n')
    .replace(/<pre>/g, '')
    .replace(/<\/pre>/g, '')
    .replace(/<code>/g, '')
    .replace(/<\/code>/g, '')
    .replace(/&#x27;/g, '\'')
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<i>/, '')
    .replace(/<\/i>/, '')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
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
      refreshing: true,
      page: 1,
      stories: {},
      dataSource: this.ds.cloneWithRows([]),
      readStories: new Set(),
    };

    fetchTopStories(this.state.page)
      .then(stories => {
        this.setState({
          refreshing: false,
          stories: stories,
          dataSource: this.ds.cloneWithRows(stories.map(story => ({ ...story, read: this.state.readStories.has(story.id) }))),
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StoriesListView
          dataSource={this.state.dataSource}
          onStoryPress={(story) => {
            const readStories = new Set(this.state.readStories).add(story.id);
            this.setState({
              readStories: readStories,
              dataSource: this.ds.cloneWithRows(this.state.stories.map(story => ({ ...story, read: readStories.has(story.id) }))),
            });
            navigate('CommentsArticle', { post: story });
          }}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
          loadMore={() => {
            const nextPage = this.state.page + 1;
            this.setState({ page: nextPage });
            fetchTopStories(nextPage)
              .then(stories => {
                this.setState({
                  dataSource: this.ds.cloneWithRows(stories)
                });
              });
          }}
        />
      </View>
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    fetchTopStories(this.state.page)
      .then(stories => {
        this.setState({
          refreshing: false,
          stories: stories,
          dataSource: this.ds.cloneWithRows(stories.map(story => ({ ...story, read: this.state.readStories.has(story.id) }))),
        });
      });
  }
}

class CommentsScreen extends React.Component {
  static navigationOptions = {
    title: ({ state }) => `${state.params.post.title}`,
    header: {
      tintColor: '#FFFFFF',
      style: styles.toolbar,
    },
    tabBar: {
      label: 'Comments',
    }
  };

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      refreshing: true,
      dataSource: this.ds.cloneWithRows([]),
    };

    fetchItem(props.navigation.state.params.post.id)
      .then(item => {
        this.setState({
          refreshing: false,
          dataSource: this.ds.cloneWithRows(flattenComments(item)),
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => (
            <Comment level={rowData.level} content={transformCommentText(rowData.content)} user={rowData.user} timeAgo={rowData.time_ago} key={rowID} />
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
      </View >
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    fetchItem(this.props.navigation.state.params.post.id)
      .then(item => {
        this.setState({
          refreshing: false,
          dataSource: this.ds.cloneWithRows(flattenComments(item)),
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
    header: {
      tintColor: '#FFFFFF',
      style: styles.toolbar,
    },
    tabBar: {
      label: 'Article',
    }
  };

  render() {
    const { params } = this.props.navigation.state;

    let url = params.post.url;

    if (params.post.type === 'ask') {
      url = 'https://news.ycombinator.com/' + url;
    }

    return (
      <WebView
        source={{ uri: url }}
      />
    );
  }
}

const CommentsArticle = TabNavigator(
  {
    Comments: { screen: CommentsScreen },
    Article: { screen: ArticleScreen },
  },
  {
    tabBarOptions: {
      activeTintColor: '#000000',
      style: {
        backgroundColor: '#ff983f',
      },
    }
  }
);

export default HackerNews = StackNavigator({
  Home: { screen: HomeScreen },
  CommentsArticle: { screen: CommentsArticle },
});
