const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repos = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repos);

  return response.json(repos);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: "Repo not found" });
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryFind = repositories.findIndex((repo) => repo.id === id);

  if (repositoryFind >= 0) {
    repositories.splice(repositoryFind, 1);
  } else {
    return response.status(400).json({ error: "Repo not found" });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryFind = repositories.find((repo) => repo.id === id);

  if (!repositoryFind) {
    return response.status(400).json({ error: "Repo not found" });
  }

  repositoryFind.likes += 1;

  return response.json(repositoryFind);
});

module.exports = app;
