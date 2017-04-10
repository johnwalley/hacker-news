import React from 'react';
import {
  ListView,
  RefreshControl,
  View
} from 'react-native';

import Footer from './Footer';
import Story from './Story';

const renderSeparator = (sectionID, rowID, adjacentRowHighlighted) =>
  <View
    key={`${sectionID}-${rowID}`}
    style={{
      height: adjacentRowHighlighted ? 4 : 1,
      backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
    }}
  />

export default StoriesListView = ({ dataSource, onStoryPress, refreshing, onRefresh, loadMore }) =>
  <ListView
    dataSource={dataSource}
    renderRow={(rowData, sectionID, rowID) => (
      <Story
        onPress={() => {
          console.log(rowData);
          onStoryPress(rowData);
        }}
        title={rowData.title}
        points={rowData.points}
        user={rowData.user}
        timeAgo={rowData.time_ago}
        commentsCount={rowData.comments_count}
        key={rowID} />
    )}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
    renderFooter={() => dataSource.getRowCount() > 0 ? <Footer loadMore={loadMore} key="footer" /> : null}
    renderSeparator={renderSeparator}
    enableEmptySections={true}
    pageSize={30}
  />