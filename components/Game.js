import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { testIt } from '../actions';

class Game extends Component {
    componentDidMount() {
        this.props.testIt();
    }
    render() {
        return (
            <View>
                <Text>
                    asdfasdf
                    {this.props.testText}
                </Text>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        testText: state.game.kysta
    };
};

export default connect(mapStateToProps, { testIt })(Game);