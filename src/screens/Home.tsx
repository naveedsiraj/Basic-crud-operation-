import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AddToDoToFirestore, gettodo, deleteTodoFromFirestore, updateTodoInFirestore,DeleteAlldata } from '../FirebaseServices';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { navigate } from '../navigation/NavigationRef';

const Home = () => {
  const { user, handleSignOut, deleteUser }: any = useContext(AuthContext);
  const [todo, settodo] = useState<string>(''); 
  const [todos, setTodos] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track which todo is being edited

  const currentUser = auth().currentUser;

  useEffect(() => {
    
    if (!currentUser) {
      console.error('No user is currently logged in.');
      return
    }

    const userTodosRef = firestore().collection('todos').doc(currentUser.uid);

   // Set up the snapshot listener
   const unsubscribe = userTodosRef.onSnapshot(
    (docSnapshot) => {
      if (docSnapshot.exists) {
        const data: any = docSnapshot.data();
        setTodos(data.todos || []); // Update the todos array in state
      } else {
        console.log('No todos document found for this user.');
        setTodos([]); // Clear todos if no document exists
      }
    },
    (error) => {
      console.error('Error listening for Firestore updates:', error);
    }
  );
   // Cleanup the listener on component unmount
   return () => unsubscribe();
   
  }, [currentUser])
  

  
  const addTodos = async () => {
    if (!todo.trim()) {
      console.log('Todo cannot be empty.');
      return;
    }

    try {
      await AddToDoToFirestore(todo);  // Add the todo to Firestore
      console.log('Todo added to Firestore');
      settodo(''); // Reset input field
      fetchTodos(); // Refresh the todos list after adding a new one
    } catch (error) {
      console.log('Error', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await gettodo();  // Get todos from Firestore
      setTodos(fetchedTodos || []);  // Update the state with the fetched todos
    } catch (error) {
      console.log('Error fetching todos:', error);
    }
  };

  const handleDeleteTodo = async (index: number) => {
    try {
      await deleteTodoFromFirestore(index); // Delete the todo from Firestore
      fetchTodos(); // Refresh the todos list after deletion
    } catch (error) {
      console.log('Error deleting todo:', error);
    }
  };

  const handleEditTodo = (index: number) => {
    setEditIndex(index); // Set the index of the todo being edited
    settodo(todos[index]); // Pre-fill the input with the current todo text
  };

  const updateTodo = async () => {
    if (editIndex === null || !todo.trim()) {
      console.log('Invalid edit operation.');
      return;
    }

    try {
      await updateTodoInFirestore(editIndex, todo); // Update the todo in Firestore
      console.log('Todo updated in Firestore');
      settodo(''); // Reset input field
      setEditIndex(null); // Clear the edit index
      fetchTodos(); // Refresh the todos list after updating
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();  // Fetch todos when the component mounts
  }, []);

  // function notificationscreennaviagte() { 

  //     // Create an object to pass as params
  // const Data = {
  //   name: 'John Doe',
  //   age: 30,
  // };
  //  navigate('NotificationScreen', { notificationData: Data });
  // }

  return (
    <View style={styles.container}>

      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize: 20 }}>Todo operation</Text>
        <TouchableOpacity style={{backgroundColor:"red", padding:8, borderRadius:8}}  onPress={DeleteAlldata}>
        <Text style={{ fontSize: 12, color:"white" }}>Delete All </Text>
        </TouchableOpacity>
      </View>
     
      
      <View>
        <Text style={{ fontSize: 15, marginVertical: 10 }}>{editIndex !== null ? 'Edit todo' : 'Add todo'}</Text>
        <TextInput
          style={styles.input}
          value={todo}
          placeholder="Enter todo"
          onChangeText={(value) => settodo(value)}  // Updates the state with user input
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={editIndex !== null ? updateTodo : addTodos}>
        <Text style={styles.buttonText}>{editIndex !== null ? 'Update Todo' : 'Add Todo'}</Text>
      </TouchableOpacity>

      {/* Display the list of todos */}
      <FlatList
        data={todos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.todoItem}>
            <Text> {item.todo ? item.todo : 'No todo available'}</Text>
            <View style={styles.todoActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTodo(index)} // Call edit function with index
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTodo(index)} // Call delete function with index
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

              {/* <TouchableOpacity
                style={styles.naviagtebtn}
                onPress={notificationscreennaviagte} // Call delete function with index
              >
                <Text style={styles.naviagtebtnText}>Delete</Text>
              </TouchableOpacity> */}

    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },

  naviagtebtn: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },

  naviagtebtnText: {
    color: 'white',
    textAlign:"center"
  }
});
