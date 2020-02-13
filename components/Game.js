import React, { Component } from 'react';
import { GLView } from 'expo-gl';
import { View, Text, StyleSheet, Dimensions, PixelRatio, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { testIt } from '../actions';
import { graphicMod as gM } from '../util';
import Player from '../game/Player';
import {PlayerView} from './Player';

const vertSrc = `
attribute vec3 color;
attribute vec2 point;
varying vec3 vColor;

void main(void) {
    gl_Position = vec4(point, 0.0, 1.0);
    gl_PointSize = 70.0;
    vColor = color;
}
`;

const fragSrc = `
precision mediump float;
varying vec3 vColor;

void main(void) {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

let _initialized = false;

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
            playerDefaultScale: 0,
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
    changeVels(self) {
        console.log(this.state.players);
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
    getPlayerPositions() {
        let positions = [];
        const halfX = this.state.screenWidth / 2;
        const halfY = this.state.screenHeight / 2;
        for(let i = 0; i<this.state.players.length; i++) {
            positions.push((this.state.players[i].x - halfX) / halfX);
            positions.push((halfY - this.state.players[i].y) / halfY);
        }
        return positions;
    }
    getPlayerColors() {
        let colors = [];
        for(let i = 0; i<this.state.players.length; i++) {
            colors.push(this.state.players[i].color.r / 255);
            colors.push(this.state.players[i].color.g / 255);
            colors.push(this.state.players[i].color.b / 255);
        }
        return colors;
    }
    _onGLContextCreate = gl => {
        
        if (_initialized) {
            return;
        }
    
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
    
        // Compile vertex and fragment shader
        const vert = gl.createShader(gl.VERTEX_SHADER);
        
        gl.shaderSource(vert, vertSrc);
        gl.compileShader(vert);
        const frag = gl.createShader(gl.FRAGMENT_SHADER);
        
        gl.shaderSource(frag, fragSrc);
        gl.compileShader(frag);
        
        // Link together into a program
        const program = gl.createProgram();
        
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);

        gl.linkProgram(program);
        gl.useProgram(program);

        let points = this.getPlayerPositions();
        let colors = this.getPlayerColors();

        const color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        const color = gl.getAttribLocation(program, "color");
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(color);

        const point_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
        const point = gl.getAttribLocation(program, "point");
        gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0,0);
        gl.enableVertexAttribArray(point);



        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, points.length / 2);
    
        gl.flush();
        gl.endFrameEXP();
        _initialized = true;

        const onTick = () => {
            let points = this.getPlayerPositions();
            let colors = this.getPlayerColors();

            const color_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            const color = gl.getAttribLocation(program, "color");
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(color);

            const point_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
            const point = gl.getAttribLocation(program, "point");
            gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0,0);
            gl.enableVertexAttribArray(point);

            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, points.length / 2);
            gl.flush();
            gl.endFrameEXP();
        };

        const animate = () => {
            if(gl) {
                this.loop = requestAnimationFrame(animate);
                onTick(gl);
            }
        };
        animate();
    }
    renderGL() {
        return (
            <GLView
                style={{ flex: 1 }}
                onContextCreate={this._onGLContextCreate}
            />
        );
    }
    render() {
        return (
            <View style={styles.gamecontainer}>
                {this.renderGL()}
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
        flex: 1
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