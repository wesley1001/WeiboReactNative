// Module dependencies
const React = require('react-native');
const moment = require('moment');

moment.locale('zh-cn');

const styles = require('./style');

const {
  View,
  Text,
  Image
} = React;

module.exports = React.createClass({
  render () {
    let data = this.props.data;

    return (
      <View style={styles.card}>
        {this.renderCellHeader(data)}
        <Text style={styles.text}>{data.text}</Text>
        {this.renderPics(data.pic_urls)}
        {
          data.retweeted_status ?
          <View style={{ padding: 5, borderLeftWidth: 2, borderColor: '#e2e2e2' }}>
            <Text style={{ color: '#007aff' }}>{`@${data.retweeted_status.user.screen_name}`}</Text>
            <Text style={styles.text}>{data.retweeted_status.text}</Text>
            {this.renderPics(data.retweeted_status.pic_urls)}
          </View> : null
        }
      </View>
    );
  },

  getPicView (row, column, pics) {
    let picViews = [];

    for (let i = 0; i < row; i++) {
      let picView = [];

      for (let j = 0; j < column; j++) {
        if (pics[row * i + j]) {
          picView.push(
            <Image
              key={`${j}`}
              style={{ height: 80, width: 80, marginRight: 5 }}
              source={{uri: pics[row * i + j].thumbnail_pic }} />
          );
        }
      }

      picViews.push(<View key={`${i}`} style={{ flexDirection: 'row', marginTop: 5 }}>{picView}</View>);
    }

    return picViews;
  },

  renderPics (pics) {
    let picViews = [];

    if (pics && pics.length) {
      let l = pics.length;

      switch (l) {
        case 1:
        case 2:
        case 3:
          let picView = [];

          pics.forEach((pic, index) => {
            picView.push(
              <Image
                key={`${index}`}
                style={{ height: 80, width: 80, marginRight: 5 }}
                source={{uri: pic.thumbnail_pic }} />
            );
          });

          picViews.push(picView);
          break;
        case 4:
          picViews = this.getPicView(2, 2, pics);
          break;
        case 5:
        case 6:
          picViews = this.getPicView(2, 3, pics);
          break;
        case 7:
        case 8:
        case 9:
          picViews = this.getPicView(3, 3, pics);
          break;
      }
    }

    return <View style={{ marginTop: 5 }}>{picViews}</View>
  },

  renderCellHeader (data) {
    return (
      <View style={styles.header}>
        <Image style={styles.avatar}
               source={{uri: data.user.profile_image_url}} />
        <View style={styles.headerInfo}>
          <Text style={{color:'#333',fontSize:14}}>{data.user.screen_name}</Text>
          <Text style={{color:'#999',fontSize:12,marginTop:8}}>
            {`${moment(new Date(data.created_at)).format('YYYY-MM-DD')} via ${data.source.replace(/<\/?[^>]+(>|$)/g, '')}`}
          </Text>
        </View>
      </View>
    )
  }
});
