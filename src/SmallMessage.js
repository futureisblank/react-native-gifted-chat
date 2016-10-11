import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

export default class SmallMessage extends React.Component {
  render() {
    if (this.props.currentMessage.smallText) {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.text, this.props.textStyle]}>
              {moment(this.props.currentMessage.createdAt).format('dddd DD MMMM YYYY [at] HH[h]mm')}
            </Text>
            <Text style={[styles.text, this.props.customStyles('SmallMessage.message')]}>
              {this.props.currentMessage.smallText}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  wrapper: {
    // backgroundColor: '#ccc',
    // borderRadius: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 5,
    // paddingBottom: 5,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#b2b2b2',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

SmallMessage.defaultProps = {
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  smallText: '',
  currentMessage: {
    // TODO test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
};

SmallMessage.propTypes = {
  containerStyle: React.PropTypes.object,
  wrapperStyle: React.PropTypes.object,
  textStyle: React.PropTypes.object,
  smallText: React.PropTypes.string,
  currentMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
};
