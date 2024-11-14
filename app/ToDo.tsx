import {
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Button,
  View,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Todo {
  id: number;
  title: string;
}

const ToDo = () => {
  // component state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  // effect hooks
  useEffect(() => {
    // Load todos from AsyncStorage when the component mounts
    const loadTodos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("todos");
        if (jsonValue != null) {
          setTodos(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Failed to load todos:", e);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    // Save todos to AsyncStorage whenever the todos state changes
    const saveTodos = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("todos", jsonValue);
      } catch (e) {
        console.error("Failed to save todos:", e);
      }
    };

    saveTodos();
  }, [todos]);

  // event handlers
  const handleSubmit = () => {
    if (text) {
      const newTodo = {
        id: todos.length + 1,
        title: text,
      };
      setTodos([...todos, newTodo]);
      setText("");
      Keyboard.dismiss();
    }
  };

  const handleDelete = (item: any) => {
    const newArray = todos.filter((m) => m.id !== item.id);
    setTodos(newArray);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TODO</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        selectionColor="#000"
      />
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Reset" color="red" onPress={() => setTodos([])} />
      </View>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Button
              title="delete"
              color="orange"
              onPress={() => handleDelete(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} // Ensure keyExtractor returns a unique string
        extraData={todos} // This forces FlatList to re-render when `todos` changes
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow container to grow and take up available space
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  todoItem: {
    borderColor: "#B0B0B0",
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ToDo;
