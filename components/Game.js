import React, { Component } from 'react';
import { MultiTouchView } from 'expo-multi-touch';
import { View, Text, StyleSheet, Dimensions, PixelRatio, PanResponder } from 'react-native';
import { connect } from 'react-redux';
import { socketConnect } from '../actions';
import { graphicMod as gM } from '../util';
import Player from '../game/Player';
import Renderer from './Renderer';
import SocketHandler from '../game/SocketHandler';

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
            fps: 0,
            touches: {}
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
    changeOwnVel(right, left) {
        this.state.players[0].velocityUpdate(right, left);
    }
    ownJump() {
        this.state.players[0].jump();
    }
    componentWillMount() {
        this.gestures = {
            onTouchBegan: event => {
                const { identifier } = event;
                this.setState(previous => ({
                    touches: {
                        ...previous.touches,
                        [identifier]: event,
                    },
                }));
            },
            onTouchMoved: event => {
                const { identifier } = event;
                this.setState(previous => ({
                    touches: {
                    ...previous.touches,
                    [identifier]: event,
                    },
                }));
            },
            onTouchEnded: event => {
                const { identifier, deltaX, deltaY, isTap } = event;
                this.setState(previous => ({
                    touches: {
                    ...previous.touches,
                    [identifier]: null,
                    },
                }));
            },
            onTouchCancelled: event => {
                const { identifier, deltaX, deltaY, isTap } = event;
                this.setState(previous => ({
                    touches: {
                    ...previous.touches,
                    [identifier]: null,
                    },
                }));
            },
        };
    }
    componentDidMount() {
        this.props.socketConnect(); 

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
                height: 25 * gM(width)
            }
        });
        this.state.players.push(Player.newPlayer(1250, 0, {r: 54, g: 255, b: 76}, gM(width)));

        let self = this;
        this.updateLoop = setInterval(function() {
            self.setState({frames: self.state.frames+1});
            self.setState({fps: self.state.frames / (((new Date()).getTime() - self.state.frameTime) / 1000)});
            self.updatePlayers(60 / self.state.fps);
            self.checkInputs();
        }, 0);
    }
    checkInputs() {
        const touchArr = Object.values(this.state.touches);
        const middleX = this.state.screenWidth / 2;
        const middleY = this.state.screenHeight / 2;

        let jump = false;
        let right = false;
        let left = false;

        for(let i = 0; i<touchArr.length; i++) {
            if(touchArr[i] != null) {
                const touchX = touchArr[i].locationX;
                const touchY = touchArr[i].locationY;
                if(touchY < middleY) 
                    jump = true;
                else if(touchX > middleX) 
                    right = true;
                else if(touchX < middleX)
                    left = true;        
            }
        }

        if(jump) {
            this.state.players[0].jump();
        }
        this.state.players[0].velocityUpdate(right, left);
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
            colors.push(...[1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
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
        return this.props.joined ? (
            <MultiTouchView style={styles.gamecontainer}
                {...this.gestures}
            >
                <Renderer 
                    getPlayerPositions={this.getPlayerPositions}
                    getPlayerColors={this.getPlayerColors}
                    getPlayerScales={this.getPlayerScales}
                />
                <View style={{...styles.platform, left: this.state.platform.x, width: this.state.platform.w, top: this.state.platform.y, height: this.state.platform.h}}></View>
                <Text style={styles.testtext}>
                    {Math.ceil(this.state.fps)}
                </Text>
            </MultiTouchView>
        ) : 
        (
            <View>
                <Text style={styles.loadingText}>
                    LOADING...
                </Text>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        socket: state.game.socket,
        connecting: state.game.connecting,
        connected: state.game.connected
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
    },
    buttons: {
        left: 0,
        top:0,
        position: "absolute",
        height: 100,
        width: 300,
        flexDirection: "row",
        backgroundColor: "red",
    },
    button: {
        flex: 1
    },
    loadingText: {
        fontSize: 30,
        textAlign: "center",
        top: 150
    }
});

export default connect(mapStateToProps, { socketConnect })(Game);