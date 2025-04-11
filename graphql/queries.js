const GET_USER_BY_EMAIL = `
  query GetUserByEmail($email: String!) {
      users(where: {email: {_eq: $email}}) {
        id
        email
        name
        password
      }
    }
`;

const GET_USER_BY_ID = `
query GetUserByID($id: Int!) {
      users_by_pk(id: $id) {
        id
        email
        name
      }
    }`;
module.exports = {
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
};
