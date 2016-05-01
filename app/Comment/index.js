// Module dependencies
const React = require('react-native');
const CommonListView = require('../components/CommonListView');
const WeiboCell = require('../components/WeiboCell');

const config = require('../config');
const api = require('../api');

const {
  AsyncStorage,
} = React;

module.exports = React.createClass({

  async onFetch (page = 1, callback, options) {
    let accessToken = await AsyncStorage.getItem(config.token_store_key);
    let url = `${api.comments.toMe}?access_token=${accessToken}&page=${page}`;

    fetch(url)
      .then(resData => resData.json())
      .then(res => {
         callback(res.comments);
      })
      .catch(err => console.error(err))
      .done();
  },

  render () {
    return <CommonListView cell={WeiboCell} onFetch={this.onFetch} />;
  }
});