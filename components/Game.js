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
            },
            buttons: {
                width: 0,
                height: 0,
                positions: []
            },
            players: [],
            frames: 0,
            frameTime: 0,
            fps: 0
        }
    }
    updatePlayers(updateRatio) {
        for(let i = 0; i<this.state.players.length; i++) {
            this.state.players[i].update(updateRatio);
            this.state.players[i].checkCollisions(this.state.platform, this.state.buttons);
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
        this.setState({frameTime: (new Date()).getTime()});
        this.setState({
            platform: {
                x: 200 * gM(width),
                y: 800 * gM(width),
                w: 2160 * gM(width),
                h: 5 
            },
            buttons: {
                width: 80 * gM(width),
                height: 25 * gM(width),
                positions: []
            }
        });

        this.props.testIt();
        this.state.players.push(Player.newPlayer(800, 100, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(850, -300, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(900, 400, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(950, 300, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(1000, 100, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(1050, 200, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(1100, -100, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(1150, 0, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(1200, 75, {r: 100, g: 100, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(1250, 50, {r: 100, g: 100, b: 255}, gM(width)));

        let self = this;
        setInterval(function() {
            self.setState({frames: self.state.frames+1});
            self.setState({fps: self.state.frames / (((new Date()).getTime() - self.state.frameTime) / 1000)});
            self.updatePlayers(self.state.fps / 60);
        }, 0);
    }
    
    renderPlayers() {
        let players = [];
        for(let i = 0; i<this.state.players.length; i++) {
            players.push(<PlayerView key={i} x={this.state.players[i].x} y={this.state.players[i].y} scale={this.state.players[i].scale} eyeScale={this.state.players[i].eyeScale} color={this.state.players[i].color} />);
        }
        return players;
    }
    render() {
        return (
            <View style={styles.gamecontainer}>
                {this.renderPlayers()}
                <View style={{...styles.platform, left: this.state.platform.x, width: this.state.platform.w, top: this.state.platform.y, height: this.state.platform.h}}></View>
                <Text style={styles.testtext}>
                    {this.state.fps}
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