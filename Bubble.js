import React from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

import ParsedText from 'react-native-parsed-text';

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 15,
    paddingTop: 8,
    overflow: "hidden",
  },
  text: {
    color: '#000',
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 10,
  },
  textLeft: {
  },
  textRight: {
    color: '#fff',
  },
  textCenter: {
    textAlign: 'center',
  },
  bubbleLeft: {
    marginRight: 70,
    backgroundColor: '#e6e6eb',
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    marginLeft: 70,
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
  },
  bubbleCenter: {
    backgroundColor: '#007aff',
    alignSelf: 'center',
  },
  bubbleError: {
    backgroundColor: '#e01717',
  },
  answers: {
    marginTop: 8,
    // flex: 1,
    // alignSelf: "stretch",
    backgroundColor: "#f6f6f6",
    width: 212,
  },
  answer: {
    borderTopWidth: 1,
    padding: 6,
    paddingLeft: 14,
    paddingRight: 14,
    borderColor: "black",
    alignSelf: "stretch",
    flex: 1,
  }
});

export default class Bubble extends React.Component {

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderText(text = '', position) {
    if (this.props.renderCustomText && this.props.renderCustomText(this.props) !==false) {
      return this.props.renderCustomText(this.props);
    }

    if (this.props.parseText === true) {
      return (
        <ParsedText
          style={[styles.text, (position === 'left' ? styles.textLeft : position === 'right' ? styles.textRight : styles.textCenter)]}
          parse={
            [
              {
                type: 'url',
                style: {
                  textDecorationLine: 'underline',
                },
                onPress: this.props.handleUrlPress,
              },
              {
                type: 'phone',
                style: {
                  textDecorationLine: 'underline',
                },
                onPress: this.props.handlePhonePress,
              },
              {
                type: 'email',
                style: {
                  textDecorationLine: 'underline',
                },
                onPress: this.props.handleEmailPress,
              },
            ]
          }
        >
          {text}
        </ParsedText>
      );
    }

    return (
      <Text style={[styles.text, (position === 'left' ? styles.textLeft : position === 'right' ? styles.textRight : styles.textCenter)]}>
        {text}
      </Text>
    );
  }

  onAnswerPress(answer) {
    console.log("All the infos about the answer pressed", answer);
  }

  renderAnswers(answers, handleAnswerPress) {
    let answersOutput = answers.map((answer, i) => {
      return (
        <TouchableHighlight
          key={"answer-" + i}
          underlayColor="transparent"
          onPress={() => handleAnswerPress(answer)}
          style={styles.answer}
          >
          <Text>{answer.text}</Text>
        </TouchableHighlight>
      )
    });
    return (
      <View style={styles.answers}>
        {answersOutput}
      </View>
    )
  }

  render() {
    const flexStyle = {};
    const realLength = function(str) {
      return str.replace(/[^\x00-\xff]/g, "**").length; // [^\x00-\xff] - Matching non double byte character
    };
    if (this.props.text) {
      if (realLength(this.props.text) > 40) {
        flexStyle.flex = 1;
      }
    }

    return (
      <View style={[styles.bubble,
        (this.props.position === 'left' ? styles.bubbleLeft : this.props.position === 'right' ? styles.bubbleRight : styles.bubbleCenter),
        (this.props.status === 'ErrorButton' ? styles.bubbleError : null),
        flexStyle]}
      >
        {this.props.name}
        {this.renderText(this.props.text, this.props.position)}
        {this.props.answers ? this.renderAnswers(this.props.answers, this.props.handleAnswerPress) : null}
      </View>
  );
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right', 'center']),
  status: React.PropTypes.string,
  text: React.PropTypes.string,
  renderCustomText: React.PropTypes.func,
  styles: React.PropTypes.object,
  parseText: React.PropTypes.bool,
  name: React.PropTypes.element,
  handleUrlPress: React.PropTypes.func,
  handlePhonePress: React.PropTypes.func,
  handleEmailPress: React.PropTypes.func,
  handleAnswerPress: React.PropTypes.func,
};
