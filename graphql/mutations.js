const REGISTER_ADMIN = `
   mutation RegisterAdmin($email: String!, $name: String!, $password: String!) {
    insert_admin_one(object: {email: $email, name: $name, password: $password}) {
      id
      email
      name
    }
  }
`;
const REGISTER_USER = `
   mutation RegisterUser($email: String!, $name: String!, $password: String!) {
    insert_users_one(object: {email: $email, name: $name, password: $password}) {
      id
      email
      name
    }
  }
`;
const UPDATE_ADMIN_STATE = `
mutation UpdateAdmin($email: String!) {
      update_admin(
          where: {email: {_eq: $email}},
          _set: {disabled: false}
          ) {
          affected_rows
              }
            }`;
const UPDATE_USER_STATE = `
mutation UpdateUser($email: String!) {
      update_users(
          where: {email: {_eq: $email}},
          _set: {disabled: false}
          ) {
          affected_rows
              }
            }`;
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
  REGISTER_ADMIN,
  UPDATE_USER_BY_ID,
  UPDATE_PASSWORD,
  UPDATE_USER_STATE,
  UPDATE_ADMIN_STATE,
};
