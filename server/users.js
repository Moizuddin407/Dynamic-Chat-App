// clear

const users = [];

const addUser = ({ id, name, room }) => {

  console.log(id);
  console.log(room);
  console.log(name);
   if (!name || !room) {
    console.log("Name or room not given");
    return { error: 'Username and room are required.' };
  }
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
}



const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  
  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };


// let users = [];  // Ensure this is declared globally

// const addUser = ({ id, name, room }) => {
//   console.log("AddUser called");
//   console.log("ID:", id);
//   console.log("Name:", name);
//   console.log("Room:", room);
  
//   if (!name || !room) {
//     console.log("Name or room not given");
//     return { error: 'Username and room are required.' };
//   }

//   name = name.trim().toLowerCase();
//   room = room.trim().toLowerCase();

//   // Log the users array to check if it's being updated
//   console.log("Current Users Array:", users);

//   // Check if the user already exists
//   const existingUser = users.find((user) => user.room === room && user.name === name);

//   // Log the result of the existence check
//   console.log("Existing User:", existingUser);

//   if (existingUser) {
//     return { error: 'Username is taken.' };
//   }

//   const user = { id, name, room };

//   // Add the new user to the array
//   users.push(user);
  
//   // Log the updated users array
//   console.log("Updated Users Array:", users);

//   return { user };
// }