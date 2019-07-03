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

  // Get all users
  app.get('/api/users', async (req, res, next) => {
    try {
      const getAllUsers = await User.find().exec();
      return res.send(getAllUsers)

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
      res.send(findUserById)
    } catch(err) {
      res.status(404).send({
        msg: 'User not found',
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

  app.get('/api/user/:id/todo/:todoid', async (req, res, next) => {
    try {
      const findUserById = await User.findById(req.params.id).exec();
      findUserById.todos.forEach(todo => {
        console.log(req.params.todoid)
        console.log(todo._id)
        // console.log(typeof todo._id)
        // console.log(typeof req.params.todoid)
        
        // console.log(todo._id == req.params.todoid)
        // console.log(todo._id)
        // console.log('param :', req.params.todoid)
        // if () {

        // }
      })
      // findUserById.todo.findById(req.params.index)
      // const test = await findUserById.todo.findById(req.params.idd).exec()
      // const result = await test
      // console.log(test)
      res.send(findUserById.todos[0])


    } catch(err) {
      return res.status(404).send({
        msg: 'Could not find todo',
        err
      });
    }
  });
}