import React, { Component } from 'react';
import {
  View,
  Image,
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

  renderIcon(image) {
    return <Image source={image} style={styles.icon} />;
  }

  renderAnswers() {
    if (this.props.currentMessage.answers) {
      return this.props.currentMessage.answers.map((answer, index) => {
        return (
          <TouchableHighlight
            key={`answer-${index}`}
            underlayColor="transparent"
            onPress={() => this.onPress(answer)}
            style={this.props.customStyles('Answers.answer')}
          >
            <View style={styles.answerContainer}>
              <Text style={this.props.customStyles('Answers.text')}>{answer.text}</Text>
              {answer.icon ? this.renderIcon(answer.icon) : null}
            </View>
          </TouchableHighlight>
        );
      });
    }
    return null;
  }

  render() {
    return (
      <View
        style={[this.props.customStyles('Answers.container')]}
      >
        {this.renderAnswers()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});

Answers.propTypes = {
  customStyles: React.PropTypes.func.isRequired,
  customOnAnswerPress: React.PropTypes.func,
  onAnswerPress: React.PropTypes.func,
  currentMessage: React.PropTypes.object,
}

Answers.defaultProps = {
  onPress: () => {},
};

export default Answers;
