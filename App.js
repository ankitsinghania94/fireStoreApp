/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import firebase from "react-native-firebase";

import _ from "lodash";


export default class App extends Component<{}> {
constructor() {
  super(); 
  this.ref = firebase.firestore().collection("Todos");
  this.state = {
    text: "",
    todoList: []
  }
  this._onSubmitPress = this._onSubmitPress.bind(this);
  this._onTodoTaskPressed = this._onTodoTaskPressed.bind(this);
  this._onRemoveTodo = this._onRemoveTodo.bind(this);
}

componentDidMount() {
  // console.log(this.ref);

  // FireStore Data Retrieve

  // this.ref.get().then((fireStoreData) => {
  //   console.log(fireStoreData.docs.forEach(element => {
  //     console.log(element.data());
  //     })
  //   );
  // })

  // Firebase Listener


  this.ref.onSnapshot(((fireStoreData) => {
    fireStoreData.docs.forEach(element => {
      const todoList = this.state.todoList;
      const checkTodo = _.find(this.state.todoList, item => item.title == element.data().title)
      if(_.isEmpty(checkTodo)) {
        todoList.push(element.data());
        this.setState({ todoList });
      }
    })
  })
)

  // Firebase Query
  // this.ref.where('isCompleted', '==', false).get()
  // .then((snapshot) => {
  //   snapshot.forEach(doc => {
  //     console.log(doc.data(), "Query");
  //   });
  // })

  this.ref.where('isCompleted', '==', true)
  .onSnapshot((snapshot) => {
    snapshot.forEach(doc => {
      console.log(doc.data(), "Query");
    });
  })
  
}

  _onSubmitPress() {

    if(this.state.text == "")
    return;

    let checkTodo = _.filter(this.state.todoList, item => item.title == this.state.text);
    if(checkTodo.length > 0) {
      alert("Already There");
      this.setState({ text: "" });
      return;
    }

    var todo = {
      title: this.state.text,
      isCompleted: false
    }

    // Add Data to firestore

    // this.ref.doc("Todos")
    // .set(todo, {merge: true})     // Have to set megre otherwise it will replace
    // .then((res) => {
    //   this.setState({ text: "" });
    //   console.log("Document successfully written!");
    // })
    

    // Add Data to firestore with key

    this.ref
    .add(todo)
    .then((res) => {
      this.setState({ text: "" });
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  }

  _onTodoTaskPressed(index) {

    this.ref.where('title', '==', this.state.todoList[index].title).get().then((snapshot) => {
      snapshot.forEach(doc => {
        this.ref.doc(doc.id).update({ isCompleted: !this.state.todoList[index].isCompleted })
        .then(() => {
          let todoList = this.state.todoList;
          todoList[index].isCompleted = !this.state.todoList[index].isCompleted;
          this.setState({ todoList });
        }).catch((error) => {
          console.log("Error In Updating Todo", error);
        })
      });
    });
  }

  _onRemoveTodo(index) {
    
    this.ref.where('title', '==', this.state.todoList[index].title).get().then((snapshot) => {
      snapshot.forEach(doc => {
        this.ref.doc(doc.id).delete()
        .then(() => {
          let todoList = this.state.todoList;
          todoList.splice(index, 1);
          this.setState({ todoList})
        }).catch((error) => {
          console.log("Error In Removing Todo", error);
        })
      });
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.welcome}>
            Welcome to FireStore
          </Text>
          <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <TouchableOpacity onPress={() => this._onSubmitPress()} style= {styles.submitButton}>
            <Text style={styles.textColor}>Click To Submit</Text>
          </TouchableOpacity>
          {
            this.state.todoList.map((todo, index) => {
              return (
                <View key={index} style={styles.todoItemContainer}>
                  <TouchableOpacity style={{ margin: 2, backgroundColor: todo.isCompleted ? "gray" : "#5A73B1", padding: 5, alignItems: 'center', flex: 3 }} onPress={() => this._onTodoTaskPressed(index)}>
                    <Text style={{ color: "white", textDecorationLine: todo.isCompleted ? 'line-through' : null }}>{todo.title}</Text>
                  </TouchableOpacity>  
                  <TouchableOpacity style={{ margin: 2, backgroundColor: "red", padding: 5, alignItems: 'center', flex: 1 }} onPress={() => this._onRemoveTodo(index)}>
                    <Text style={styles.textColor}>Remove</Text>
                  </TouchableOpacity>  
                </View>
              )  
            })
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollViewContainer: {
    alignItems: "center",
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 40,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textField: { 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    width: "100%",
  },
  submitButton: { 
    marginVertical: 20, 
    backgroundColor: "gray", 
    padding: 10,
  },
  textColor: { 
    color: "white",
  },
  todoItemContainer: { 
    flexDirection: "row" ,
  }
});
