import React, { Component } from 'react';
import { GLView } from 'expo-gl';
import { View, Text, StyleSheet, Dimensions, PixelRatio, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { testIt } from '../actions';
import { graphicMod as gM } from '../util';
import Player from '../game/Player';
import Renderer from './Renderer';

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
            playerDefaultScale: 70,
            defaultEyeScale: 20 * 70 / 150,
            frames: 0,
            frameTime: 0,
            fps: 0
        }
        this.getPlayerPositions = this.getPlayerPositions.bind(this);
        this.getPlayerColors = this.getPlayerColors.bind(this);
        this.getPlayerScales = this.getPlayerScales.bind(this);
    }
    componentWillUnmount() {
        if(this.updateLoop) 
            clearInterval(this.updateLoop);
    }
    updatePlayers(updateRatio) {
        for(let i = 0; i<this.state.players.length; i++) {
            this.state.players[i].update(updateRatio);
            this.state.players[i].checkCollisions(this.state.platform, this.state.buttons);
        }
    }
    changeVels() {
        const rand = Math.random() * 100;
        for(let i = 0; i<this.state.players.length; i++) {
            this.state.players[i].velocityUpdate(rand > 50, rand < 50);
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
        this.state.players.push(Player.newPlayer(200, 0, {r: 23, g: 54, b: 12}, gM(width)));
        this.state.players.push(Player.newPlayer(500, 300, {r: 250, g: 54, b: 255}, gM(width)));
        this.state.players.push(Player.newPlayer(1250, 0, {r: 54, g: 255, b: 76}, gM(width)));

        let self = this;
        this.updateLoop = setInterval(function() {
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
    getPlayerPositions() {
        let positions = [];
        const halfX = this.state.screenWidth / 2;
        const halfY = this.state.screenHeight / 2;
        for(let i = 0; i<this.state.players.length; i++) {
            positions.push((this.state.players[i].x - halfX) / halfX);
            positions.push((halfY - this.state.players[i].y) / halfY);

            positions.push((this.state.players[i].x - this.state.playerDefaultScale / 15 - halfX) / halfX);
            positions.push((halfY - this.state.players[i].y + this.state.playerDefaultScale / 15) / halfY);

            positions.push((this.state.players[i].x + this.state.playerDefaultScale / 15 - halfX) / halfX);
            positions.push((halfY - this.state.players[i].y + this.state.playerDefaultScale / 15 ) / halfY);
        }
        return positions;
    }
    getPlayerColors() {
        let colors = [];
        for(let i = 0; i<this.state.players.length; i++) {
            colors.push(this.state.players[i].color.r / 255);
            colors.push(this.state.players[i].color.g / 255);
            colors.push(this.state.players[i].color.b / 255);

            colors.push(1.0);
            colors.push(1.0);
            colors.push(1.0);
            colors.push(1.0);
            colors.push(1.0);
            colors.push(1.0);
        }
        return colors;
    }
    getPlayerScales() {
        let scales = [];
        for(let i = 0; i<this.state.players.length; i++) {
            scales.push(this.state.playerDefaultScale * gM(this.state.screenPixelWidth));
            scales.push(this.state.defaultEyeScale * gM(this.state.screenPixelWidth));
            scales.push(this.state.defaultEyeScale * gM(this.state.screenPixelWidth));
        }
        return scales;
    }
    render() {
        return (
            <View style={styles.gamecontainer}>
                <Renderer 
                    getPlayerPositions={this.getPlayerPositions}
                    getPlayerColors={this.getPlayerColors}
                    getPlayerScales={this.getPlayerScales}
                />
                <View style={{...styles.platform, left: this.state.platform.x, width: this.state.platform.w, top: this.state.platform.y, height: this.state.platform.h}}></View>
                <Text style={styles.testtext}>
                    {this.state.fps}
                </Text>
                <TouchableOpacity style={styles.debugBtn} onPress={this.changeVels.bind(this)}>
                    <Text>ASDF</Text>
                </TouchableOpacity>
            </View>
        );
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
        backgroundColor: "#000"
    },
    testtext: {
        color:"red",
        fontSize: 30,
        position: "absolute"
    },
    platform: {
        position: "absolute",
        backgroundColor: "#ffffff"
    },
    debugBtn: {
        position:"absolute",
        width: 50,
        height: 50,
        left: 50,
        bottom: 50,
        backgroundColor: "#fff"
    }
});

export default connect(mapStateToProps, { testIt })(Game);