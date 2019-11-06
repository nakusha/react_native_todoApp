import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import PropTypes from "prop-types"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")
// state를 사용할떄는 class로 선언해야한다.
export default class ToDo extends React.Component{
    constructor(props){
        super(props);
        this.state = { isEditing: false, toDoValue: props.text };
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        completeToDo: PropTypes.func.isRequired,
        uncompleteToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    };

    state = {
        isEditing: false,
        toDoValue: ""
    };

    render() {
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteToDo, isCompleted} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toogleComplete}>
                        <View style={[
                            styles.circle, 
                            isCompleted ? styles.completedCircle : styles.uncompletedCircle
                        ]}/>
                    </TouchableOpacity>
                    { isEditing ? (
                            <TextInput 
                                style={[
                                    styles.input, 
                                    styles.text,
                                    isCompleted ? styles.completedText : styles.uncompletedText
                                ]} 
                                multiline={true} 
                                value={toDoValue}
                                onChangeText={this._constorlInput}
                                returnKeyType={"done"}
                                //blur 빈공간 클릭시 수정 종료
                                onBlur={this._finishEditing}
                                underlineColorAndroid={"transparent"}/>
                        ) : (
                            <Text 
                                style={[
                                styles.text, 
                                isCompleted ? styles.completedText : styles.uncompletedText
                                ]}
                            >
                                {text}
                            </Text>
                        )
                    }
                </View>
                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={this._finishEditing}>
                            <View style={styles.actionContainer}>
                               <Text style={styles.actionsText}>
                                    <MaterialCommunityIcons 
                                        name={"check-outline"} 
                                        size={30} 
                                        color="black"/>
                               </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={this._startingEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionsText}>
                                    <MaterialCommunityIcons 
                                        name={"square-edit-outline"} 
                                        size={30} 
                                        color="black"/>
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={(event) => {
                            event.stopPropagation;
                            deleteToDo(id)
                            }}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionsText}>
                                    <MaterialCommunityIcons 
                                        name={"delete-outline"} 
                                        size={30} 
                                        color="black"/>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }

    _toogleComplete = (event) => {
        event.stopPropagation()
        const { isCompleted, completeToDo, uncompleteToDo, id } = this.props;
        if (isCompleted){
            uncompleteToDo(id)
        }else{
            completeToDo(id)
        }
    };
    _startingEditing = (event) => {
        event.stopPropagation()
        this.setState({  isEditing: true });
    };

    _finishEditing = (event) => {
        event.stopPropagation()
        const { toDoValue } = this.state;
        const { id, updateToDo }  = this.props;
        updateToDo(id, toDoValue);
        this.setState({
            isEditing: false
        });
    }
    _constorlInput = (text) => {
        this.setState({
            toDoValue: text
        })
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
        width: width/2
    },
    actions: {
        flexDirection:"row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    input: {
        marginVertical: 10,
        width: width / 2
    }
})