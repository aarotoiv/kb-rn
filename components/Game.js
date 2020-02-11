import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { connect } from 'react-redux';
import { testIt } from '../actions';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            screenWidth: 0,
            screenPixelWidth: 0,
            screenHeight: 0,
            screenPixelHeight: 0
        }
    }
    componentDidMount() {
        const {width, height} = Dimensions.get('window');
        this.setState({
            screenWidth: width,
            screenPixelWidth: PixelRatio.getPixelSizeForLayoutSize(width),
            screenHeight: height,
            screenPixelHeight: PixelRatio.getPixelSizeForLayoutSize(height)
        }, () => {
            console.log(this.state);
        });
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