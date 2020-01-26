Prerequisites:
- Node.js > 10 is installed
- Mysql is installed and is running
- Sequelize Cli is installed gloabally / Or you can use npx to run it (https://www.npmjs.com/package/sequelize-cli)

To Run:
- Change db credentials in ./config/config.json
- Run sequelize db:migrate to run migrations and create db structure (you can also use sequelize db:migrate:undo to undo migrations)
- Run sequelize db:seed:all to import data from ./data.json you can also change filename/filepath from the seeder inside ./seeders/
- Run npm start to run the project on localhost:3000 (you can change the port from the index.js file on the project root)

Endpoints:
The following are the endpoints along with the params:
- GET localhost:3000/api/repositories?id={id}&type={type} Example -> localhost:3000/api/repositories?id=8820624457&type=CreateEvent
- GET localhost:3000/api/actors?userLogin={userLogin} Example -> GET localhost:3000/api/actors?login=bbdk612
- GET localhost:3000/api/repo-with-most-events-by-actor/ 
- GET localhost:3000/api/top-contributer-for-repo/
- DELETE localhost:3000/api/history?userLogin={userLogin} Example -> localhost:3000/api/history?userLogin=rodjjo

