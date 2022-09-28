require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

const token = process.env.GITHUB_TOKEN;
const org = process.env.ORGANIZATION;

const getUsers = (filename) => {
  let file = fs.readFileSync(filename, "utf8", function (err) {
    if (err) throw err;
  });
  const users = file.split("\n");

  return users;
};

const getUserId = async (username) => {
  const url = `https://api.github.com/users/${username}`;

  axios.defaults.headers.common["Accept"] = "application/vnd.github.v3+json";
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return await axios
    .get(url)
    .then((response) => response.data.id)
    .catch((error) => console.log(error));
};

const sendInvite = async (username) => {
  const userId = await getUserId(username);
  const url = `https://api.github.com/orgs/${org}/invitations`;

  axios.defaults.headers.common["Accept"] = "application/vnd.github.v3+json";
  axios.defaults.headers.common["Authorization"] = `token ${token}`;
  axios
    .post(url, { invitee_id: userId })
    .then((response) =>
      console.log(
        response.status === 201 ? "Sent: " + username : "Failed: " + username
      )
    )
    .catch((error) => console.log(error));
};

const main = async () => {
  const filename = process.argv.slice(2)[0];
  const usernames = getUsers(filename);

  for (username of usernames) {
    await sendInvite(username);
  }
};

main();
