import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { connect } from 'react-redux';
import { testIt } from '../actions';
import { graphicMod as gM } from '../util';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            screenWidth: 0,
            screenPixelWidth: 0,
            screenHeight: 0,
            screenPixelHeight: 0,
            platform: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            } 
        }
    }
    componentDidMount() {
        const {width, height} = Dimensions.get('window');
        this.setState({
            screenWidth: width,
            screenPixelWidth: PixelRatio.getPixelSizeForLayoutSize(width),
            screenHeight: height,
            screenPixelHeight: PixelRatio.getPixelSizeForLayoutSize(height)
        });

        this.setState({
            platform: {
                x: 200 * gM(width),
                y: 800 * gM(width),
                w: 2160 * gM(width),
                h: 5 
            } 
        });

        this.props.testIt();
    }
    render() {
        return (
            <View style={styles.gamecontainer}>
                <View style={{...styles.platform, left: this.state.platform.x, width: this.state.platform.w, top: this.state.platform.y, height: this.state.platform.h}}></View>
                <Text style={styles.testtext}>
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

const styles = StyleSheet.create({
    gamecontainer: {
        flex: 1,
        backgroundColor: "#000000"
    },
    testtext: {
        color:"red",
        fontSize: 30
    },
    platform: {
        position: "absolute",
        backgroundColor: "#ffffff"
    }
});

export default connect(mapStateToProps, { testIt })(Game);