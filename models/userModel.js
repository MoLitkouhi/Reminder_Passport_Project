const database = [
  {
    id: 1,
    name: 'Cindy',
    email: 'pouya92@gmail.com',
    password: '123123',
    reminders: [
      {
        id: 1,
        title: 'Test',
        description: 'description test',
        completed: false
      }
    ]
  },
  {
    id: 2,
    name: 'Alex',
    email: 'alex123@gmail.com',
    password: 'alex123!',
    reminders: []
  }
];

const userModel = {
  findOne: email => {
    try {
      const user = database.find(user => user.email === email);
      if (user) {
        return user;
      }
    } catch (e) {
      console.log(`Couldn't find user with email: ${email}`, e);
    }
  },
  findById: id => {
    const user = database.find(user => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  findGitUserOrCreate: profile => {
    const user = database.find(user => user.id === profile.id);
    if (user) {
      return user;
    } else {
      const userProfile = {
        id: profile.id,
        name: profile.username,
        reminders: []
      };
      database.push(userProfile);
      return userProfile;
    }
  }
};

module.exports = { database, userModel };
