const { request, response } = require("express");
const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

//Middlaware

function checkRepositoriesExists(request, response, next){
  const { id } = request.params;

  repositoryIndex = repositories.findIndex((repository) => id === repository.id);

  if(repositoryIndex < 0){
    return response.status(404).json({error: "Repository not Exists"});
  }

  request.repositoryIndex = repositoryIndex;

  return next();
}

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoriesExists, (request, response) => {
  const { repositoryIndex } = request;
  
  const{ title, url, techs } = request.body

  const repository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepositoriesExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoriesExists, (request, response) => {
  const { repositoryIndex } = request;

  const repository = repositories[repositoryIndex];

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
