import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

export default class MessageText extends React.Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  onUrlPress(url) {
    Linking.openURL(url);
  }

  onPhonePress(phone) {
    const options = [
      'Text',
      'Call',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          Communications.phonecall(phone, true);
          break;
        case 1:
          Communications.text(phone);
          break;
      }
    });
  }

  onEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }

  renderBoldText(matchingString) {
    let pattern = /<bold>(.*)<\/bold>/;
    let match =  matchingString.match(pattern);
    return (<Text style={styles.bold}>{match[1]}</Text>);
  }

  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <ParsedText
          style={[styles[this.props.position].text, this.props.textStyle[this.props.position], this.props.customStyles(`ParsedText.${this.props.position}.text`)]}
          parse={[
            {
              type: 'url',
              style: StyleSheet.flatten([
                styles[this.props.position].link,
                this.props.linkStyle[this.props.position],
                this.props.customStyles(`ParsedText.${this.position}.link`)
              ]),
              onPress: this.onUrlPress
            },
            {
              type: 'phone',
              style: StyleSheet.flatten([
                styles[this.props.position].link,
                this.props.linkStyle[this.props.position],
                this.props.customStyles(`ParsedText.${this.position}.link`)
              ]),
              onPress: this.onPhonePress
            },
            {
              type: 'email',
              style: StyleSheet.flatten([
                styles[this.props.position].link,
                this.props.linkStyle[this.props.position],
                this.props.customStyles(`ParsedText.${this.position}.link`)
              ]),
              onPress: this.onEmailPress
            },
            {pattern: /<bold>(.*)<\/bold>/,  style: styles.bold, renderText: this.renderBoldText},
          ]}
        >
          {this.props.currentMessage.text}
        </ParsedText>
      </View>
    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {
    },
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
  bold: {
    fontWeight: 'bold',
  },
};

MessageText.contextTypes = {
  actionSheet: React.PropTypes.func,
};

MessageText.defaultProps = {
  containerStyle: {},
  position: 'left',
  textStyle: {},
  linkStyle: {},
  currentMessage: {
    text: '',
  },
};

MessageText.propTypes = {
  containerStyle: React.PropTypes.object,
  customStyles: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  textStyle: React.PropTypes.object,
  linkStyle: React.PropTypes.object,
  currentMessage: React.PropTypes.object,
};
