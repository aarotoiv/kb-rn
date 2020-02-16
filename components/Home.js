import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { socketConnect } from '../actions';
import { connect } from 'react-redux';
import SocketHandler from '../game/SocketHandler';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "asdf" 
        };
    }
    componentDidMount() {
        this.props.socketConnect();
    }
    componentDidUpdate() {
        if(this.props.joined && this.props.connected && this.props.yourId)
            Actions.game();
    }
    attemptJoin() {
        if(this.props.socket && !this.props.connecting) {
            SocketHandler.join(this.props.socket, this.state.name, Math.random() * 1000 + 200);
        }
    }
    render() {
        return this.props.connected ? (
            <View style={styles.container}>
                <Text style={styles.homeTitle}>
                    King of the Buttons
                </Text>
                <TouchableOpacity style={styles.joinButton} onPress={this.attemptJoin.bind(this)}>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
            </View>
            ) : (
            <View style={styles.container}>
                <Text style={styles.loadingText}>
                    CONNECTING
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center"
    },
    homeTitle: {
        fontSize: 40,
        color: "#fff",
        textAlign: "center",
    },  
    loadingText: {
        color: "#fff",
        fontSize: 40,
        textAlign: "center",
    },
    joinButton: {
        width: 250,
        height: 75,
        backgroundColor: "#fff",
        marginTop: 100,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 30
    }
});

const mapStateToProps = (state) => {
    return {
        socket: state.game.socket,
        connecting: state.game.connecting,
        connected: state.game.connected,
        joining: state.game.joining,
        joined: state.game.joined,
        yourId: state.game.yourId
    };
};

export default connect(mapStateToProps, { socketConnect })(Home);