import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
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
            style={this.props.customStyles('Answers.answer')}
          >
            <Text style={this.props.customStyles('Answers.text')}>{answer.text}</Text>
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
