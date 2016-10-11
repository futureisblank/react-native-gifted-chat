import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';

class Summary extends Component {
  constructor(props) {
    super(props);
  }

  listMissions(missions) {
    if (!missions) {
      return null;
    }
    return missions.map((mission, id) => {
      return (
        <Text key={`mission-${id}`} style={[this.props.customStyles('Summary.section.value')]}>{mission}</Text>
      );
    });
  }

  listLanguages(languages) {
    if (!languages) {
      return null;
    }
    return languages.map((language, id) => {
      return (
        <Text key={`language-${id}`} style={[this.props.customStyles('Summary.section.value')]}> {language} </Text>
      );
    });
  }

  render() {
    if (!this.props.currentMessage.summary) {
      return null;
    }
    const summary = this.props.currentMessage.summary;
    const dateBegin = moment(summary.dateBegin).format('dddd DD MMM YYYY [at] HH[h]mm');
    return (
      <View style={[this.props.customStyles('Summary.container')]}>
        <View style={[styles.header, this.props.customStyles('Summary.header.container')]}>
          <Text style={[this.props.customStyles('Summary.header.surtitle')]}>RÉSERVATION</Text>
          <Text style={[this.props.customStyles('Summary.header.title')]}>#{summary.prestationId}</Text>
        </View>
        <View style={this.props.customStyles('Summary.corpus')}>
          <View style={[this.props.customStyles('Summary.section.container')]}>
            <Text style={[this.props.customStyles('Summary.section.title')]}>LOGEMENT</Text>
            <Text style={[this.props.customStyles('Summary.section.value')]}>{summary.housing.address}, {summary.housing.zipCode} {summary.housing.city}</Text>
          </View>
          <View style={[this.props.customStyles('Summary.section.container')]}>
            <Text style={[this.props.customStyles('Summary.section.title')]}>DATE & HEURE</Text>
            <Text style={[this.props.customStyles('Summary.section.value')]}>{dateBegin}</Text>
          </View>
          <View style={[this.props.customStyles('Summary.section.container')]}>
            <Text style={[this.props.customStyles('Summary.section.title')]}>SERVICES</Text>
            {this.listMissions(summary.missions)}
          </View>
          <View style={[this.props.customStyles('Summary.section.container'), this.props.customStyles('Summary.section.containerHorizontal')]}>
            <Text style={[this.props.customStyles('Summary.section.title'), this.props.customStyles('Summary.section.alignLeft'), this.props.customStyles('Summary.section.titlePrice')]}>Total</Text>
            <Text style={[this.props.customStyles('Summary.section.value'), this.props.customStyles('Summary.section.alignRight')]}>{summary.price}</Text>
          </View>
          <View style={[this.props.customStyles('Summary.section.container'), this.props.customStyles('Summary.section.containerLast')]}>
            <Text style={[this.props.customStyles('Summary.section.title')]}>SITTER</Text>
            <View style={[this.props.customStyles('Summary.section.containerHorizontal')]}>
              <View style={[this.props.customStyles('Summary.section.alignLeft')]}>
                <Text style={[this.props.customStyles('Summary.section.value')]}>{summary.provider.name} {summary.provider.missionsCount} missions</Text>
                <Text style={[this.props.customStyles('Summary.section.containerHorizontal')]}>{this.listLanguages(summary.provider.languages)}</Text>
              </View>
              <View style={[this.props.customStyles('Summary.section.alignRight')]}>
                <Image source={{ uri: summary.provider.pictureUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
              </View>
            </View>
          </View>
        </View>
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
  header: {

  },
  icon: {
    marginLeft: 10,
  },
});

Summary.propTypes = {
  customStyles: React.PropTypes.func.isRequired,
  customOnAnswerPress: React.PropTypes.func,
  onAnswerPress: React.PropTypes.func,
  currentMessage: React.PropTypes.object,
}

Summary.defaultProps = {
  onPress: () => {},
};

export default Summary;
