import React, { Component } from 'react';
import { GLView } from 'expo-gl';

const vertSrc = `
attribute vec3 color;
attribute vec2 point;
attribute float scale;

varying vec3 vColor;

void main(void) {
    gl_Position = vec4(point, 0.0, 1.0);
    gl_PointSize = scale;
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
class Renderer extends Component {

    constructor(props) {
        super(props);
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

        let points = this.props.getPlayerPositions();
        let colors = this.props.getPlayerColors();
        let scales = this.props.getPlayerScales();

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

        const scale_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, scale_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scales), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, scale_buffer);
        const scale = gl.getAttribLocation(program, "scale");
        gl.vertexAttribPointer(scale, 1, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(scale);



        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, points.length / 2);

        gl.flush();
        gl.endFrameEXP();
        _initialized = true;

        const onTick = () => {
            let points = this.props.getPlayerPositions();
            let colors = this.props.getPlayerColors();
            let scales = this.props.getPlayerScales();

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

            const scale_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, scale_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scales), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, scale_buffer);
            const scale = gl.getAttribLocation(program, "scale");
            gl.vertexAttribPointer(scale, 1, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(scale);

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

    render() {
        return (
            <GLView 
                style={{ flex: 1 }}
                onContextCreate={this._onGLContextCreate}
            />
        );
    }
}

export default Renderer;