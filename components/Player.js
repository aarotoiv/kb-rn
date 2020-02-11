import React from 'react';
import { View } from 'react-native';

const PlayerView = ({ x, y, scale, eyeScale, color }) => {
    return(
        <View style={{...styles.player, left: x - scale / 2, top: y - scale / 2, width: scale, height: scale}}>
            <View style={{...styles.eye, left: scale / 2 - scale / 5 - eyeScale / 2, top: scale / 2 - scale / 5 - eyeScale / 2, width: eyeScale, height: eyeScale}}>
            </View>
            <View style={{...styles.eye, left: scale / 2 + scale / 5 - eyeScale / 2, top: scale / 2 - scale / 5 - eyeScale / 2, width: eyeScale, height: eyeScale}}>
            </View>
        </View>
    );
};

const styles = {
    player: {
        position:"absolute",
        backgroundColor: "red"
    },
    eye: {
        position:"absolute",
        backgroundColor: "#ffffff"
    }
};

export { PlayerView };