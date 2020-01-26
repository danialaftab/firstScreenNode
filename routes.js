const api = require('./controllers/apiController')

module.exports = (app) => {
    app.get('/api/repositories/', (req, res) => api.getRepositories(req, res))  
    app.get('/api/actors/', (req, res) => api.getActorRepositories(req, res)) 
    app.get('/api/repo-with-most-events-by-actor/', (req, res) => api.getMaxEventsForRepoByActor(req, res))   
    app.get('/api/top-contributer-for-repo/', (req, res) => api.getTopContributer(req, res))   
    app.delete('/api/history/', (req, res) => api.deleteUserHistory(req, res))       
}