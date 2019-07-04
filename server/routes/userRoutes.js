const User = require('../models/User');

module.exports = app => {
  // Make a new user
  app.post('/api/user', async (req, res, next) => {
    const createdUser = new User(req.body);
    try {
      const result = await createdUser.save();;
      return res.send(result)

    } catch(err) {
      let usernameNotUnique = null;
      let allUsers = await User.find().exec();
      //looks through the DB and looks for an identical username. Then flags it.
      allUsers.forEach(dbUser => {
        if (dbUser.username === createdUser.username) usernameNotUnique = true})
      // if userNameNotUnique is true then the first if block will run
      if (usernameNotUnique) {
        return res.status(400).send({
          msg:`Unable to create user. Username: ${createdUser.username} is already in use.`,err})
      } else {
        return res.status(400).send({
          msg:'Unable to create user please check if required fields are entered.',
          err
        })
      }
    }
  })

  // Get all active users
  app.get('/api/users/active', async (req, res, next) => {
    try {
      const getAllUsers = await User.find().exec();
      const activeUsers = getAllUsers.filter(user => {
        return user.userActive === true;
      })
      return res.send(activeUsers);

    } catch(err) {
      return res.status(404).send({
        msg: 'Users could not be found please try again',
        err
      })
    }
  })

  // Get all inactive users
  app.get('/api/users/inactive', async (req, res, next) => {
    try {
      const getAllUsers = await User.find().exec();
      const inActive = getAllUsers.filter(user => {
        return user.userActive === false;
      })
      return res.send(inActive);

    } catch(err) {
      return res.status(404).send({
        msg: 'Users could not be found please try again',
        err
      })
    }
  })

  // Get all users active and inactive
  app.get('/api/users', async (req, res, next) => {
    try {
      const getAllUsers = await User.find().exec();
      return res.send(getAllUsers);

    } catch(err) {
      return res.status(404).send({
        msg: 'Users could not be found please try again',
        err
      })
    }
  })

  // Get User by ID
  app.get('/api/user/:id', async (req, res, next) => {
    try {
      const findUserById = await User.findById(req.params.id).exec();
      return res.send(findUserById)

    } catch(err) {
      return res.status(404).send({
        msg: 'User not found',
        err
      })
    }
  })

  // Delete/deactivate user by ID. I am not deleteing user out of DB. I am deactivating account. Will still have data.
  app.delete('/api/user/:id/deactivate', async (req, res, next) => {
    try {
      const findUserById = await User.findById(req.params.id).exec();
      // const deletedUser = User.deleteOne({ _id: req.params.id }).exec();
      findUserById.set({ userActive: false, dateModified: new Date() })
      const result = await findUserById.save();
      return res.send(result)

    } catch (err) {
      return res.status(400).send({
        msg: 'Please try again could not delete',
        err
      })
    }
  })

  // Activate user
  app.put('/api/user/:id/activate', async (req, res, next) => {
    try {
      const findUserById = await User.findById(req.params.id).exec();
      findUserById.set({ userActive: true, dateModified: new Date() })
      const result = await findUserById.save();
      return res.send(result);

    } catch(err) {
      res.status(400).send({
        msg: 'Please try again. Could not activate account',
        err
      })
    }
  })

  // Post a todo
  app.post('/api/user/:id/todo', async (req, res, next) => {
    try {
      const findUserById = await User.findById(req.params.id).exec();
      findUserById.todos.push({
        text: req.body.text
      })
      const result = await findUserById.save();
      return res.send(result)
      // console.log(findUserById);
    } catch(err) {
      return res.status(400).send({
        msg: 'Error: Could not post todo.',
        err
      });
    }
  })
  
  // Get all todos from a user based on ID
  app.get('/api/user/:id/todo', async (req, res, next) => {
    try {
      const findUserById = await User.findById(req.params.id).exec();
      const userTodos = findUserById.todos
      return res.send({userTodos})

    } catch(err) {
      return res.status(404).send({
        msg: 'Could not get todos list',
        err
      })
    }
  })

  // Get a single todo by its ID from a users' todo list. returns the Index of that todo
  app.get('/api/user/:id/todo/:todoid', async (req, res, next) => {
    try {
      const findUserById = await User.findById(req.params.id).exec();
      // Finds the index of the req.params.todoid for the array of todos for the user
      const todoIndex = findUserById.todos.findIndex(todo => {
        return todo._id == req.params.todoid
      })
      // Gets the single todo from the todos array
      const singleTodoByID = findUserById.todos[todoIndex]
      // This will catch the err if todoIndex comes up -1 for ID not found. 
      if (todoIndex === -1) {
        return res.status(404).send({msg: 'Todo item not found with the ID specified'})
      } else {
        // Sends the specific todo by its ID and also its index
        return res.send({singleTodoByID, todoIndex})
      }
      
    } catch(err) {
      return res.status(404).send({
        msg: 'Cannot get todo item',
        err
      });
    }
  });

  // Delete a single todo by ID
  // app.delete('/api/user/:id/todo/:todoid', async (req, res, next) => {
  //   try {
  //     const findUserById = User.findById(req.params.id).exec();
  //   } catch(err) {
  //     return res.status(404).send({
  //       msg: 'Todo item not found for deletion',
  //       err
  //     })
  //   }
  // })
}