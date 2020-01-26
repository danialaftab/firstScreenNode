let models = require('../models')
let moment = require('moment')

let apiController = {

    getRepositories: (req, res) => {
        let params = req.query
        let options = {
            where: {},
            include: [{
                model: models.Actor,
                as: 'actor',
            }, {
                model: models.Repo,
                as: 'repo',
            }, {
                model: models.Organization,
                as: 'org',
            }]
        }

        if (params.id)
            options.where.id = params.id
        if (params.type)
            options.where.type = params.type


        models.Event.findAll(options).then(events => {
            events = events.map(event => {
                event.payload = JSON.parse(event.payload)
                return event
            })

            res.json({
                status: "ok",
                data: events
            })
        }).catch(err => apiController.handleError(err, res))
    },

    getActorRepositories: (req, res) => {
        let params = req.query

        if (!params.userLogin) {
            res.json({
                status: "error",
                message: "invalid params"
            })
        }

        let sql = `Select distinct(repos.id) as repoId, actors.id as actorId, actors.login as actorLogin, actors.display_login as actorDisplayLogin,
        actors.gravatar_id as actorGravitarId, actors.url as actorUrl, actors.avatar_url as actorAvatarUrl, 
        repos.name as repoName, repos.url as reposUrl  from actors
        join events on (events.actor_id = actors.id)
        join repos on (events.repo_id = repos.id)
        where actors.login='${params.userLogin}'`

        models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }).then(result => {
            let apiResult = {}
            let repos = result.map(repo => {
                return { id: repo.repoId, name: repo.repoName, url: repo.reposUrl }
            })

            if (result.length > 0) {
                apiResult = {
                    id: result[0].actorId,
                    login: result[0].actorLogin,
                    display_login: result[0].actorDisplayLogin,
                    gravatar_id: result[0].actorGravitarId,
                    url: result[0].actorUrl,
                    avatar_url: result[0].avatar_url,
                    repos: repos
                }
            } else {
                apiResult = {}
            }

            res.json({
                status: "ok",
                data: apiResult
            })
        }).catch(err => apiController.handleError(err, res))
    },

    getRepo: (repoId) => {
        return new Promise((resolve, reject) => {
            models.Repo.findOne({
                where: {
                    id: repoId
                }
            }).then(repo =>
                resolve(repo)
            ).catch(err => reject())
        })
    },

    getMaxEventsForRepoByActor: (req, res) => {
        let sql = `select count(events.id) count, actor_id, repo_id, created_at from events group by actor_id, repo_id order by count desc`

        models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }).then(result => {
            let apiResult = {}
            let i = 0;
            while (i < result.length - 1) {

                if (result[i].count != result[i + 1]) {
                    apiResult = result[i]
                    break;
                }
                else {
                    if (moment(result[i].created_at).isBefore(moment(result[i + 1].created_at))) {
                        apiResult = result[i + 1]
                    } else {
                        apiResult = result[i]
                    }
                }
                i++
            }

            apiController.getRepo(apiResult.repo_id).then(repo => {
                res.json({
                    status: "ok",
                    data: repo
                })
            }).catch(err => apiController.handleError(err))
        }).catch(err => apiController.handleError(err, res))
    },

    getTopContributer: (req, res) => {
        let sql = `select max(count) contributions, repo_id, actor_id, repos.name as repo_name, repos.url as repo_url, actors.login as actor_login, actors.display_login as actor_display_login,
        actors.gravatar_id as actor_gravitar_id, actors.url as actor_url, actors.avatar_url as actor_avatar_url from (select count(events.id) count, actor_id,
         repo_id, created_at from events group by actor_id, repo_id)
         temp join repos on (repos.id = temp.repo_id)
         join actors on (actors.id = temp.actor_id)
         group by temp.repo_id order by contributions desc`

        models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }).then(result => {
            result = result.map(item => {
                return {
                    contributions: item.contributions,
                    constributer: {
                        id: item.actor_id,
                        login: item.actor_login,
                        display_login: item.actor_display_login,
                        gravatar_id: item.actor_gravitar_id,
                        url: item.actor_url,
                        avatar_url: item.actor_avatar_url
                    },
                    repo: {
                        id: item.repo_id,
                        name: item.repo_name,
                        url: item.repo_url
                    }
                }
            })
            res.json({
                status: "ok",
                data: result
            })
        }).catch(err => apiController.handleError(err, res))
    },

    getActorFromLogin: (userLogin) => {
        return new Promise((resolve, reject) => {
            models.Actor.findOne({
                where: {
                    login: userLogin
                }
            }).then(actor => {
                resolve(actor)
            }).catch(err => reject(err))
        })
    },

    deleteUserHistory: (req, res) => {
        let params = req.query
        if (params.userLogin) {
            apiController.getActorFromLogin(params.userLogin).then(actor => {
                if (actor) {
                    models.Event.destroy({
                        where: {
                            actor_id: actor.id
                        }
                    }).then(delRes => {
                        res.json({
                            status: "ok",
                            message: "User history deleted"
                        })
                    }).catch(err => apiController.handleError(err, res))
                } else {
                    apiController.handleError({ message: "No Actor found" }, res)
                }
            }).catch(err => apiController.handleError(err, res))

        } else {
            apiController.handleError({
                message: "Invalid params"
            }, res)
        }
    },

    handleError: (err, res) => {
        console.log("Error: ", err)
        res.json({
            status: "error",
            error: err
        })
    }


}

module.exports = apiController;