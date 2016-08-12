import React, { Component, PropTypes } from 'react';
import {
  Animated,
  View,
  InteractionManager,
  ScrollView,
} from 'react-native';

import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import moment from 'moment/min/moment-with-locales.min';

import Actions from './components/Actions';
import Answers from './components/Answers';
import Avatar from './components/Avatar';
import Bubble from './components/Bubble';
import BubbleImage from './components/BubbleImage';
import ParsedText from './components/ParsedText';
import Composer from './components/Composer';
import Day from './components/Day';
import InputToolbar from './components/InputToolbar';
import LoadEarlier from './components/LoadEarlier';
import Location from './components/Location';
import Message from './components/Message';
import Send from './components/Send';
import Time from './components/Time';
import DefaultStyles from './DefaultStyles';

// TODO
// onPressUrl
// onPressPhone
// onPressEmail

class GiftedMessenger extends Component {
  constructor(props) {
    super(props);

    // default values
    this._actionsBarHeight = this.props.actionsBarHeight;
    this._statusBarHeight = this.props.statusBarHeight;
    this._keyboardHeight = 0;
    this._maxHeight = null;
    this._touchStarted = false;

    this.state = {
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
    };
  }

  // required by @exponent/react-native-action-sheet
  static childContextTypes = {
    actionSheet: PropTypes.func,
  };

  // required by @exponent/react-native-action-sheet
  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef,
    };
  }

  static append(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return currentMessages.concat(messages);
  }

  static prepend(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return messages.concat(currentMessages);
  }

  // static update(currentMessages = [], options) {
  //   if (!Array.isArray(options)) {
  //     options = [options];
  //   }
  //
  //   return currentMessages.map((message) => {
  //     for (let i = 0; i < options.length; i++) {
  //       const {find, set} = options;
  //       if () {
  //         return
  //       }
  //     }
  //     return message;
  //   });
  // }

  componentWillMount() {
    this.initLocale();
    this.initCustomStyles();
    this.initMessages(this.props.messages, true);
  }

  componentWillReceiveProps(nextProps) {
    this.initMessages(nextProps.messages, false);
  }

  initLocale() {
    if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
      this.setLocale('en');
    } else {
      this.setLocale(this.props.locale);
    }
  }

  initCustomStyles() {
    if (this.props.customStyles) {
      this.setCustomStyles(this.props.customStyles);
    } else {
      this.setCustomStyles(DefaultStyles);
    }
  }

  initMessages(messages = [], sort = false) {
    if (sort === true) {
      this.setMessages(messages.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
      }));
    } else {
      this.setMessages(messages);
    }
  }

  setLocale(locale) {
    this._locale = locale;
  }

  getLocale() {
    return this._locale;
  }

  setCustomStyles(customStyles) {
    this._customStyles = customStyles;
  }

  getCustomStyles() {
    if (this.props.hideInputToolbar) {
      this._customStyles.minInputToolbarHeight = 0;
    }
    return this._customStyles;
  }

  setMessages(messages) {
    this._messages = messages;
  }

  getMessages() {
    return this._messages;
  }

  setMaxHeight(height) {
    this._maxHeight = height;
  }

  getMaxHeight() {
    return this._maxHeight;
  }

  setKeyboardHeight(height) {
    this._keyboardHeight = height;
    this.recalculateContainerHeight();
  }

  getKeyboardHeight() {
    return this._keyboardHeight;
  }

  setActionsBarHeight(height) {
    this._actionsBarHeight = height;
    this.recalculateContainerHeight();
  }

  getActionsBarHeight() {
    return this._actionsBarHeight;
  }

  setStatusBarHeight(height) {
    this._statusBarHeight = height;
  }

  getStatusBarHeight() {
    return this._statusBarHeight;
  }

  onKeyboardWillShow(e) {
    this.setKeyboardHeight(e.endCoordinates.height);
  }

  onKeyboardWillHide() {
    this.setKeyboardHeight(0);
  }

  getComposerHeight() {
    return Math.max(0, this.getCustomStyles().minInputToolbarHeight - this.getCustomStyles().minComposerHeight);
  }

  recalculateContainerHeight() {
    let messagesContainerHeight = this.getMaxHeight() - this.getKeyboardHeight() - this.getActionsBarHeight() - this.getStatusBarHeight() - this.getComposerHeight();
    Animated.timing(this.state.messagesContainerHeight, {
      toValue: messagesContainerHeight,
      duration: 0,
    }).start();
  }

  scrollToBottom(animated = true) {
    this._scrollViewRef.scrollTo({
      y: 0,
      animated,
    });
  }

  onTouchStart() {
    this._touchStarted = true;
  }

  onTouchMove() {
    this._touchStarted = false;
  }

  // handle Tap event to dismiss keyboard
  // TODO test android
  onTouchEnd() {
    if (this._touchStarted === true) {
      dismissKeyboard();
    }
    this._touchStarted = false;
  }

  renderMessages() {
    return (
      <Animated.View style={{
        height: this.state.messagesContainerHeight,
      }}>
        <ScrollView
          keyboardShouldPersistTaps={true}

          onTouchStart={this.onTouchStart.bind(this)}
          onTouchMove={this.onTouchMove.bind(this)}
          onTouchEnd={this.onTouchEnd.bind(this)}

          onKeyboardWillShow={this.onKeyboardWillShow.bind(this)}
          onKeyboardWillHide={this.onKeyboardWillHide.bind(this)}

          ref={component => this._scrollViewRef = component}

          // Attempt to scroll to the last message on send / receive events
          onLayout={event => {
            // event.nativeEvent.layout.height
            this._scrollViewRef.scrollTo({y: Math.max(0, this._scrollViewRef.contentHeight - this.state.messagesContainerHeight._value), animated: true});
          }}
          onContentSizeChange={(width, height) => {
            this._scrollViewRef.contentHeight = height;
            this._scrollViewRef.scrollTo({y: Math.max(0, this._scrollViewRef.contentHeight - this.state.messagesContainerHeight._value), animated: true})
          }}

          {...this.props.scrollViewProps}
        >
          {this.getMessages().map((message, index) => {
            if (!message.id) {
              console.warn('GiftedMessenger: `id` is missing for message', JSON.stringify(message));
            }

            const messageProps = {
              ...this.props,
              ...message,
              key: message.id,
              previousMessage: this.getMessages()[index - 1] || {},
              nextMessage: this.getMessages()[index + 1] || {},
              customStyles: this.getCustomStyles(),
              locale: this.getLocale(),
              onAnswerPress: this.onAnswerPress,
              position: message.user.id === this.props.user.id ? 'right' : 'left',
            };

            if (this.props.renderMessage) {
              return this.props.renderMessage(messageProps);
            }
            return <Message {...messageProps}/>;
          })}

          {this.renderLoadEarlier()}
        </ScrollView>
      </Animated.View>
    );
  }

  onLoadEarlier() {
    if (this.props.onLoadEarlier) {
      this.props.onLoadEarlier();
    }
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
        customStyles: this.getCustomStyles(),
        locale: this.getLocale(),
        onLoadEarlier: this.onLoadEarlier.bind(this),
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }
    return null;
  }

  onSend(messages = [], shouldResetInputToolbar = false) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    messages = messages.map((message) => {
      return {
        ...message,
        user: this.props.user,
        time: new Date(),
        id: 'temp-id-'+Math.round(Math.random() * 1000000),
      };
    });

    if (shouldResetInputToolbar === true) {
      this.resetInputToolbar();
    }
    this.props.onSend(messages);
    // this.scrollToBottom();
  }

  onAnswerPress(answer) {
    if (!answer.preventSendMessage) {
      this.onSend({
        text: answer.text.trim()
      });
    }
    if (answer.action) {
      if (this.dispatch) {
        this.dispatch({...answer.action, data: answer});
      }
    }
  }

  resetInputToolbar() {
    this.setState({
      text: '',
      composerHeight: this.props.hideInputToolbar ? 0 : this.getCustomStyles().minComposerHeight,
      messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.getCustomStyles().minInputToolbarHeight - this.getKeyboardHeight()),
    });
  }

  calculateInputToolbarHeight(newComposerHeight) {
    return newComposerHeight + (this.getCustomStyles().minInputToolbarHeight - this.getCustomStyles().minComposerHeight);
  }

  onType(e) {
    const newComposerHeight = this.props.hideInputToolbar ? 0 : Math.max(this.getCustomStyles().minComposerHeight, Math.min(this.getCustomStyles().maxComposerHeight, e.nativeEvent.contentSize.height));
    const newMessagesContainerHeight = this.getMaxHeight() - this.calculateInputToolbarHeight(newComposerHeight) - this.getKeyboardHeight();
    this.setState({
      text: e.nativeEvent.text,
      composerHeight: this.props.hideInputToolbar ? 0 : newComposerHeight,
      messagesContainerHeight: new Animated.Value(newMessagesContainerHeight),
    });
  }

  renderActionsbar() {
    if (this.props.renderActionsBar) {
      return this.props.renderActionsBar();
    }
    return null;
  }

  renderInputToolbar() {
    if (this.props.hideInputToolbar) {
      return null;
    }
    const inputToolbarProps = {
      ...this.props,
      text: this.state.text,
      composerHeight: this.props.hideInputToolbar ? 0 : Math.max(this.getCustomStyles().minComposerHeight, this.state.composerHeight),
      onChange: this.onType.bind(this),
      onSend: this.onSend.bind(this),
      customStyles: this.getCustomStyles(),
      locale: this.getLocale(),
    };

    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps);
    }
    return <InputToolbar {...inputToolbarProps}/>;
  }

  render() {
    if (this.state.isInitialized === true) {
      return (
        <ActionSheet ref={component => this._actionSheetRef = component}>
          <View style={{marginTop:this.getStatusBarHeight(), flex: 1}}>
            {this.renderMessages()}
            <View
              onLayout={(event) => {
                var {x, y, width, height} = event.nativeEvent.layout;
                this.setActionsBarHeight(height);
              }}
            >
              {this.renderActionsbar()}
            </View>
            {this.renderInputToolbar()}
          </View>
        </ActionSheet>
      );
    }
    // Initialization
    return (
      <View
        style={{flex: 1}}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          this.setMaxHeight(layout.height);
          InteractionManager.runAfterInteractions(() => {
            this.setState({
              isInitialized: true,
              text: '',
              composerHeight: this.props.hideInputToolbar ? 0 : this.getCustomStyles().minComposerHeight,
              messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.getCustomStyles().minInputToolbarHeight),
            });
          });
        }}
      />
    );
  }
}

GiftedMessenger.defaultProps = {
  messages: [],
  onSend: () => {},
  loadEarlier: false,
  onLoadEarlier: () => {},
  locale: null,
  // TODO TEST:
  // customStyles: {},
  customStyles: null, // initCustomStyles will check null value
  renderActions: null,
  renderActionsBar: null,
  renderAvatar: null,
  renderBubble: null,
  renderParsedText: null,
  renderBubbleImage: null,
  renderComposer: null,
  renderDay: null,
  renderInputToolbar: null,
  renderLocation: null,
  renderMessage: null,
  renderSend: null,
  renderTime: null,
  scrollViewProps: null,
  statusBarHeight: 20,
  user: {},
};

export {
  GiftedMessenger,
  Actions,
  Answers,
  Avatar,
  Bubble,
  BubbleImage,
  ParsedText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Location,
  Message,
  Send,
  Time,
  DefaultStyles,
};
