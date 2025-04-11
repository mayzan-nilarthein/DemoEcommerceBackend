const REGISTER_USER = `
   mutation RegisterUser($email: String!, $name: String!, $password: String!) {
    insert_users_one(object: {email: $email, name: $name, password: $password}) {
      id
      email
      name
    }
  }
`;
const UPDATE_USER_BY_ID = `
mutation UpdateUser($id: Int!, $name: String) {
      update_users_by_pk(pk_columns: {id: $id}, _set: {name: $name,}) {
        id
        name
        email
      }
    }
`;

const UPDATE_PASSWORD = `
mutation UpdatePassword($id: Int!, $password: String!) {
      update_users_by_pk(pk_columns: {id: $id}, _set: {password: $password}) {
        id
      }
    }
`;

module.exports = {
  REGISTER_USER,
  UPDATE_USER_BY_ID,
  UPDATE_PASSWORD,
};
