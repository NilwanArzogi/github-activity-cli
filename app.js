const axios = require("axios");
const chalk = require("chalk");

const username = process.argv[2];

if (!username) {
  console.log("Masukkan username GitHub!");
  console.log("Contoh: node app.js NilwanArzogi");
  process.exit();
}

async function getActivity() {
  try {
    const url = `https://api.github.com/users/${username}/events`;
    const response = await axios.get(url);

    const events = response.data;

    console.log(chalk.green(`\n Aktivitas GitHub: ${username}\n`));

    if (events.length === 0) {
      console.log(chalk.yellow("Tidak ada aktivitas, menampilkan repository\n"));
      /* API github */
      const repoRes = await axios.get(`https://api.github.com/users/${username}/repos`);
      const repos = repoRes.data;

      repos.slice(0, 5).forEach((repo, i) => {
        console.log(`${i + 1}. ${repo.name}  ${repo.stargazers_count}`);
      });

      return;
    }

    events.slice(0, 5).forEach((event) => {
    let output = "";

    switch (event.type) {
        case "PushEvent":
        const commitCount = event.payload?.commits?.length || 0;
        output = `Pushed ${commitCount} commits to ${event.repo.name}`;
        break;

        case "IssuesEvent":
        output = `Opened a new issue in ${event.repo.name}`;
        break;

        case "WatchEvent":
        output = `Starred ${event.repo.name}`;
        break;

        case "ForkEvent":
        output = `Forked ${event.repo.name}`;
        break;

        case "CreateEvent":
        const refType = event.payload?.ref_type || "something";
        output = `Created ${refType} in ${event.repo.name}`;
        break;

        default:
        output = `${event.type} in ${event.repo.name}`;
    }

    console.log(chalk.cyan(`- ${output}`));
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Username tidak ditemukan!");
    } else {
      console.log("Terjadi error:", error.message);
    }
  }
}

getActivity();