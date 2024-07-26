module.exports = (user) => {
  let username = `${user}-${Math.floor(Math.random() * 1000000)}`;
  let password = `Aa1${(Math.random() + 1).toString(36).substr(2, 5)}`; //password must have one uppercase, one lowercase and one number, and be at least 8 characters long.
  let userEmail = `${username}@${username}.com`;
  //make sure both are strings
  username = String(username);
  password = String(password);
  userEmail = String(userEmail);
  const confirmPassword = password;
  const credential = { userEmail, username, password, confirmPassword };
  return credential;
};
