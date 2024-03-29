import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import ToDo from "./ToDo";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";
import uuid from 'uuid-js';

const { height, width } = Dimensions.get("window")

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToTos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this._loadToDos();
  }
  render() {
    const { newToDo, loadedToTos, toDos } = this.state
    
    if (!loadedToTos) {
      return <AppLoading/>
    }
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"} 
            value={newToDo} 
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            underlineColorAndroid={"transparent"}
            />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(toDo => <ToDo key={toDo.id}
                                                    deleteToDo={this._deleteToDo}
                                                    uncompleteToDo={this._uncompleteToDo}
                                                    completeToDo={this._completeToDo}
                                                    updateToDo={this._updateToDo}
                                                    {...toDo} />)}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewToDo = text =>{
    this.setState({
      newToDo: text
    })
  }
  
  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      // string 으로 저장되어있기때문에 object로 변환작업을 해줘야한다.
      const paredToDos = JSON.parse(toDos)
      this.setState({ loadedToTos : true, toDos: paredToDos || {}})
    }catch(err){ 
      console.log(err)
    }
    
  }

  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "" ){
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]:{
            id:ID,
            isCompleted: false,
            text: newToDo,
            createAt: Date.now()
          }
        };

        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return {...newState};
      })
    }
  }

  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }

  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }

  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }
      
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            text:text
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }

  _saveToDos = (newToDos) => {
    //asyncstorage는 string저장용 object가아니다.
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor:"rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset:{
          height:-1,
          width:0
        }
      },
      android:{
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos:{
    alignItems:"center"
  }
});
