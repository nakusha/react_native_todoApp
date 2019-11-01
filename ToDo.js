import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { getTimeFieldValues } from "uuid-js";

const { width, height } = Dimensions.get("window")
// state를 사용할떄는 class로 선언해야한다.
export default class ToDo extends React.Component{
    state = {
        isEditing: false,
        isCompleted: false
    };

    render() {
        const { isCompleted, isEditing } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toogleComplete}>
                        <View style={[
                            styles.circle, 
                            isCompleted ? styles.completedCircle : styles.uncompletedCircle
                        ]}/>
                    </TouchableOpacity>
                    <Text 
                        style={[
                            styles.text, 
                            isCompleted ? styles.completedText : styles.uncompletedText
                        ]}
                    >
                    Hello I'm a To Do
                    </Text>
                </View>
                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._finishEditing}>
                            <View style={styles.actionContainer}>
                               <Text style={styles.actionsText}>V</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._startingEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionsText}>M</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionsText}>X</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }

    _toogleComplete = () => {
        this.setState(prevState => {
            return {
                isCompleted: !prevState.isCompleted
            };
        });
    };
    _startingEditing = () => {
        this.setState({
            isEditing: true
        });
    };
    _finishEditing = () => {
        this.setState({
            isEditing: false
        });
    }
}

const styles = StyleSheet.create({
    container:{
        width: width - 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#bbb",
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20
    },
    completedText:{
        color:"#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        color:"#353839"
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 20,
        borderColor: "red",
        borderWidth: 3
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    uncompletedCircle: {
        borderColor: "#F23657"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width/2,
        justifyContent: "space-between"        
    },
    actions: {
        flexDirection:"row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
        padding:5,
        borderWidth: 1,
        borderColor: "#bbb"
    }
})