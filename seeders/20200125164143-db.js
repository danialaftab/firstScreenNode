'use strict';

const FILENAME = `data.json`

function chunkify(collection) {
  const maxChunkSize = 300
  let startIndex = 0
  let endIndex = 0
  let chunkedData = []
  while (startIndex < collection.length) {
    if (startIndex + maxChunkSize >= collection.length) {
      endIndex = collection.length
    }
    else
      endIndex = startIndex + maxChunkSize
    chunkedData.push(collection.slice(startIndex, endIndex))
    startIndex += maxChunkSize
  }
  return chunkedData
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    let events = []
    let actors = []
    let repos = []
    let orgs = []

    return new Promise(async (resolve, reject) => {
      var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(FILENAME),
        crlfDelay: Infinity
      });

      for await (const line of lineReader) {

        let lineItem = JSON.parse(line)

        events.push({
          id: lineItem.id,
          type: lineItem.type,
          actor_id: lineItem.actor.id,
          repo_id: lineItem.repo.id,
          payload: (lineItem.payload) ? JSON.stringify(lineItem.payload) : null,
          public: lineItem.public,
          created_at: lineItem.created_at,
          organization_id: lineItem.org ? lineItem.org.id : null
        })

        let actor = lineItem.actor
        if (actor != null && actors.findIndex(arrActor => arrActor.id == actor.id) == -1)
          actors.push({
            id: actor.id,
            login: actor.login,
            display_login: actor.display_login,
            gravatar_id: actor.gravatar_id,
            url: actor.url,
            avatar_url: actor.avatar_url
          })

        let org = lineItem.org
        if (org && orgs.findIndex(arrOrg => arrOrg.id == org.id) == -1)
          orgs.push({
            id: org.id,
            login: org.login,
            gravatar_id: org.gravatar_id,
            url: org.url,
            avatar_url: org.avatar_url
          })

        let repo = lineItem.repo
        if (repo != null && repos.findIndex(arrRepo => arrRepo.id == repo.id) == -1)
          repos.push({
            id: repo.id,
            name: repo.name,
            url: repo.url
          })
      }

      let chunkedEvents = chunkify(events)
      let chunkedActors = chunkify(actors)
      let chunkedRepos = chunkify(repos)
      let chunkedOrgs = chunkify(orgs)

      let eventPromises = chunkedEvents.map(chunk => {
        return queryInterface.bulkInsert('Events', chunk, {})
      })

      let actorPromises = chunkedActors.map(actor => {
        return queryInterface.bulkInsert('Actors', actor, {})
      })

      let repoPromises = chunkedRepos.map(repo => {
        return queryInterface.bulkInsert('Repos', repo, {})
      })

      let orgsPromises = chunkedOrgs.map(org => {
        return queryInterface.bulkInsert('Organizations', org, {})
      })

      Promise.all([...actorPromises, ...eventPromises, ...repoPromises, ...orgsPromises]).then(res => {
        resolve(res)
      }).catch(err => {
        console.log("Error : ", err)
        reject(err)
      })
    })


  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', null, {});
  }
};
