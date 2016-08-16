import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

class Answers extends Component {
  constructor(props) {
    super(props);
  }

  onPress(answer) {
    if (this.props.customOnAnswerPress) {
      this.props.customOnAnswerPress(answer);
    }
    return this.props.onAnswerPress(answer);
  }

  renderAnswers() {
    if (this.props.currentMessage.answers) {
      return this.props.currentMessage.answers.map((answer, index) => {
        return (
          <TouchableHighlight
            key={`answer-${index}`}
            underlayColor="transparent"
            onPress={() => this.onPress(answer)}
            style={[styles.answer]}
          >
            <Text style={styles.text}>{answer.text}</Text>
          </TouchableHighlight>
        );
      });
    }
    return null;
  }

  render() {
    return (
      <View
        style={[styles.container]}
      >
        {this.renderAnswers()}
      </View>
    );
  }
}

Answers.defaultProps = {
  onPress: (answer) => {},
  customStyles: {},
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: '#f6f6f6',
  },
  answer: {
    borderTopWidth: 1,
    borderColor: '#ECEAF5',
    padding: 20,
  },
  text: {
    textAlign: 'center',
  }
});

export default Answers;
