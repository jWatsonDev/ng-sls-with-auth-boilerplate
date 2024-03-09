const getUserId = (headers) => {
  return headers.app_user_id;
}

const getUsername = (headers) => {
  return headers.app_username;
}

const getResponseHeaders = () => {
  return {
    'Access-Control-Allow-Origin': '*'
  }
}

module.exports = {
  getUserId,
  getUsername,
  getResponseHeaders
}