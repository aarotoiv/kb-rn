import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { connect } from 'react-redux';
import { testIt } from '../actions';
import { graphicMod as gM } from '../util';
import Player from '../game/Player';
import {PlayerView} from './Player';

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
        this.players = [];
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
        this.players.push(Player.newPlayer(800, 100, {r: 100, g: 100, b: 255}, gM(width)));
    }
    renderPlayers() {
        let players = [];
        for(let i = 0; i<this.players.length; i++) {
            players.push(<PlayerView key={i} x={this.players[i].x} y={this.players[i].y} scale={this.players[i].scale} eyeScale={this.players[i].eyeScale} color={this.players[i].color} />);
        }
        console.log(players);
        return players;
    }
    render() {
        return (
            <View style={styles.gamecontainer}>
                {this.renderPlayers()}
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