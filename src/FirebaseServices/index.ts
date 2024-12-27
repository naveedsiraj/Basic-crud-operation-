import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const AddToDoToFirestore = async (todoData: string) => {
  try {
    // Get the current user
    const currentUser = auth().currentUser;

    if (!currentUser) {
      console.error('No user is currently logged in.');
      return null;
    }

    // Create the new todo data with a proper timestamp
    const newTodo = {
      todo: todoData, // The todo text
      timestamp: new Date().toDateString(), // Use a valid timestamp format
    };

    // Reference to the 'todos' collection with the user's UID
    const userTodosRef = firestore().collection('todos').doc(currentUser.uid);

    // Check if the user document exists
    const userTodosDoc = await userTodosRef.get();

    if (userTodosDoc.exists) {
      // Update the existing document by adding the new todo to the 'todos' array
      await userTodosRef.update({
        todos: firestore.FieldValue.arrayUnion(newTodo),
      });
    } else {
      // Create a new document with the todo array if it doesn't exist
      await userTodosRef.set({
        todos: [newTodo], //  data is stored in the array form
      });
    }

    console.log('Todo added to Firestore');
  } catch (error) {
    console.error('Error adding todo to Firestore:', error);
  }
};

export const gettodo = async () => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    console.error('No user is currently logged in.');
    return null;
  }

  const userTodosRef = firestore().collection('todos').doc(currentUser.uid);

  try {
    const userTodosDoc = await userTodosRef.get();

    if (userTodosDoc.exists) {
      const todos = userTodosDoc.data().todos || []; // Fetch the todos array (or an empty array if not present)
      return todos; // Return the todos array
    } else {
      console.log('No todos document found for this user.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching todos:', error);
    return null;
  }
};

export const deleteTodoFromFirestore = async (index: number) => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    console.error('No user is currently logged in.');
    return null;
  }

  const userTodosRef = firestore().collection('todos').doc(currentUser.uid);

  try {
    const userTodosDoc = await userTodosRef.get();

    if (userTodosDoc.exists) {
      const todos = userTodosDoc.data().todos || []; // Fetch the todos array

      if (index < 0 || index >= todos.length) {
        console.error('Index out of bounds.');
        return null;
      }

      // Remove the todo at the specified index
      todos.splice(index, 1);

      // Update the Firestore document with the new todos array
      await userTodosRef.update({
        todos: todos,
      });

      console.log('Todo deleted from Firestore');
    } else {
      console.log('No todos document found for this user.');
    }
  } catch (error) {
    console.error('Error deleting todo from Firestore:', error);
  }
};

// New function to update a todo in Firestore
export const updateTodoInFirestore = async (
  index: number,
  updatedTodo: string,
) => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    console.error('No user is currently logged in.');
    return null;
  }

  const userTodosRef = firestore().collection('todos').doc(currentUser.uid);

  try {
    const userTodosDoc = await userTodosRef.get();

    if (userTodosDoc.exists) {
      const todos = userTodosDoc.data().todos || [];

      if (index < 0 || index >= todos.length) {
        console.error('Index out of bounds.');
        return null;
      }

      // Update the todo at the specified index
      todos[index].todo = updatedTodo; // Update the todo text

      // Update the Firestore document with the new todos array
      await userTodosRef.update({
        todos: todos,
      });

      console.log('Todo updated in Firestore');
    } else {
      console.log('No todos document found for this user.');
    }
  } catch (error) {
    console.error('Error updating todo in Firestore:', error);
  }
};

export const DeleteAlldata = async () => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    console.error('No user is currently logged in.');
    return null;
  }

  const userTodosRef = firestore().collection('todos').doc(currentUser.uid);

  try {
    const userTodosDoc = await userTodosRef.get();

    if (userTodosDoc.exists) {
      // Update the document by setting the 'todos' array to an empty array
      await userTodosRef.update({
       todos: []
     })

      console.log('Todo updated in Firestore');
    } else {
      console.log('No todos document found for this user.');
    }
  } catch (error) {
    console.error('Error updating todo in Firestore:', error);
  }
};
