const getUserId = (headers) => {
  return headers.app_user_id;
}

const getUsername = (headers) => {
  return headers.app_user_name;
}

const getIdToken = (headers) => {
  return headers.Authorization;
}

const getResponseHeaders = () => {
  return {
      'Access-Control-Allow-Origin': '*'
  }
}

module.exports = {
  getUserId,
  getUsername,
  getIdToken,
  getResponseHeaders
}