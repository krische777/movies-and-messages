const Sequelize = require('sequelize')
const bodyParser = require('body-parser');

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:best@localhost:5005/postgres'

const db = new Sequelize(databaseUrl)


const Movie = db.define('movie', {
    title: {
        type: Sequelize.TEXT
    },
    yearOfRelease: {
        type: Sequelize.INTEGER
    },
    synopsis: {
        type: Sequelize.TEXT
    }
})

db.sync()
    .then(() => {
        console.log('Tables created successfully');

        Movie.create({
            title: 'Inception',
            yearOfRelease: 2010, synopsis: 'Dom is a thief with the rare ability to enter people s dreams and steal their secrets from their subconscious.'
        });

        Movie.create({
            title: 'NewInception',
            yearOfRelease: 2015, synopsis: 'subconsciousness.'
        });

        Movie.create({
            title: 'NewNewInception',
            yearOfRelease: 2020, synopsis: 'secrets.'
        });
    })

    .catch(err => {
        console.error('Unable to create tables, shutting down...', err);
        process.exit(1);
    })

const express = require('express');
const app = express();
app.use(bodyParser.json())

const port = 3000;
app.listen(port, () => console.log(`My app is listening on port ${port}`))


app.post('/movies', (request, response, next) => {
    Movie.create(request.body)
        .then(movie => response.json(movie))
        .catch(next)
})

app.get('/movies', (request, response, next) => {
    Movie.findAll()
        .then(movie => response.status(200).json(movie))
        .catch(next)
})

app.get('/movies/:movieId', (request, response, next) =>
    Movie.findOne({
        where: {
            id: request.params.movieId
        }
    })
        .then(movie =>{
            if(movie) {
                return response.json(movie)
            }
            return response.status(404).end()
        })
        .catch(next)
)

app.put('/movies/:movieId', (request, response, next) =>
    Movie.findByPk(request.params.movieId)
        .then(movie => {
            if (movie) {
                return movie.update(request.body)
                    .then(movie => response.json(movie))
            }
            return response.status(404).end()
        })
        .catch(next)
)

app.delete('/movies/:movieId', (request, response, next) => {
    Movie.destroy({
        where: {
            id: request.params.movieId
        }
    })
        .then(movie => {
            if (movie) {
                return response.status(204).end()
            }
            return response.status(404).end()
        })
        .catch(next)
})