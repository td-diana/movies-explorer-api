const Movie = require('../models/movies');
const BadRequestError = require('../errors/bad-request-errors');
const NotFoundError = require('../errors/not-found-errors');
const ForbiddenError = require('../errors/forbidden-errors');

// GET /movies — возвращает все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

// POST /movies — создаёт фильм с переданными в теле данными
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// DELETE /movies/:movieId — удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new NotFoundError('Фильм не найден')))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('Ошибка доступа'));
      } else {
        movie.remove()
          .then(() => res.send({ message: movie }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
