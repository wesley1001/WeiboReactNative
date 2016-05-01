/**
 * 一简微博
 *
 * @author FantasyShao <fantasyshao@icloud.com>
 */

// Module dependencies
const React = require('react-native');
const url = require('url');

const config = require('./app/config');
const api = require('./app/api');
const common = require('./app/common');
const HomeView = require('./app/Home');

const {
  AppRegistry,
  View,
  WebView,
  AsyncStorage
} = React;

const OAUTH_URL = [
  'https://api.weibo.com/oauth2/authorize',
  '?client_id=' + config.app_key,
  '&response_type=code',
  '&redirect_uri=' + config.redirect_uri
].join('');

const Yijian = React.createClass({

  async _loadInitialState () {
    try {
      let status = await AsyncStorage.getItem(config.login_status_store_key);
      let token = await AsyncStorage.getItem(config.token_store_key);

      let GET_TOKEN_INFO = `https://api.weibo.com/oauth2/get_token_info?access_token=${token}`;

      if (status !== null) {
        fetch(GET_TOKEN_INFO, {
          method: 'POST'
        }).then(response => response.json())
          .then(res => {
              if (res.error_code) {
                this.setState({
                  login: false
                });
              } else {
                this.setState({
                  login: res.expire_in < 60 * 60 * 1000 ? false : status
                });
              }
          })
          .done();
      }
    } catch (e) {
      console.log(err);
    }
  },

  getInitialState () {
    return {
      login: false
    }
  },

  componentDidMount () {
    this._loadInitialState().done();
  },

  render () {
    if (this.state.login) {
      return (
        <HomeView />
      );
    }

    return (
      <View style={{flex: 1, marginTop: 20 }}>
        <WebView
          ref={'webview'}
          source={{uri: OAUTH_URL}}
          automaticallyAdjustContentInsets={false}
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState={true}
          scalesPageToFit={true} />
      </View>);
  },

  onNavigationStateChange (navState) {
    var urlObj = url.parse(navState.url, true);

    if (urlObj.pathname === url.parse(config.redirect_uri).pathname && navState.loading) {
      // 获取code
      var code = urlObj.query.code;
      var auth_url = [config.auth_uri,
        '?client_id=' + config.app_key,
        '&client_secret=' + config.app_secret,
        '&grant_type=authorization_code',
        '&redirect_uri=' + config.redirect_uri,
        '&code=' + code
      ].join('');

      // 获取access_token
      fetch(auth_url, {
        method: 'post'
      }).then((response) => response.json())
        .then((responseData) => {
          this.setState({
            login: true
          });
          // 存储登录状态
          common.storeItem(config.login_status_store_key, 'true');
          // 存储access_token
          common.storeItem(config.token_store_key, responseData.access_token);
          // 获取登录用户的uid
          fetch(api.account.getUid + '?access_token=' + responseData.access_token)
            .then(res => res.json())
            .then(data => {
              common.storeItem(config.uid_store_key, data.uid + '');
            })
            .done();
        })
        .catch((err) => console.log(err))
        .done();
    }
  }
});

AppRegistry.registerComponent('Yijian', () => Yijian);
