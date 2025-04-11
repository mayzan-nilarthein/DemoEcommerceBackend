const REGISTER_USER = `
   mutation RegisterUser($email: String!, $name: String!, $password: String!) {
    insert_users_one(object: {email: $email, name: $name, password: $password}) {
      id
      email
      name
    }
  }
`;

module.exports = {
  REGISTER_USER,
};
