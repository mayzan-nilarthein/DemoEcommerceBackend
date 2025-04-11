const GET_USER = `
  query GetUser($email: String!) {
      users(where: {email: {_eq: $email}}) {
        id
        email
        name
        password
      }
    }
`;

module.exports = {
  GET_USER,
};
