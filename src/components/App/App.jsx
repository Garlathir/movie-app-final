import React, { Component } from 'react'
import { Online, Offline } from 'react-detect-offline'
import { Alert, Tabs, Pagination } from 'antd'

import './App.css'
import SearchInput from '../SearchInput'
import CardList from '../CardList'
import MovieApi from '../../Services/MovieApiDb'
import { MovieApiProvider } from '../MovieDbApiContext'

export default class App extends Component {
  state = {
    movies: [],
    rated: {},
    loading: true,
    error: false,
    query: '',
    total: 0,
    currentPage: 1,
    genres: [],
  }

  movieApi = new MovieApi()

  componentDidMount() {
    this.movieApi.createGuestSession().then((id) => {
      sessionStorage.setItem('guestId', id)
    })
    this.movieApi.getGenres().then((data) => {
      this.setState({ genres: data.genres })
    })
  }

  componentDidCatch(error, info) {
    this.setState({
      error: true,
      errorInfo: info,
    })
  }

  getMovies = (query = 'return', page = 1) => {
    this.setState({ loading: true, currentPage: page })
    this.movieApi
      .getMovies(query, page)
      .then((data) => {
        this.setState({ movies: data.results, loading: false, query, total: data.total_pages })
      })
      .catch(() => {
        this.setState({ loading: false, error: true })
      })
  }

  getRated = (page = 1) => {
    this.setState({ loading: true, currentPage: page })
    this.movieApi
      .getRatedMovies(page)
      .then((data) => {
        const res = data.results ? data.results : []
        this.setState({ movies: res, loading: false, total: data.total_pages })
      })
      .catch(() => {
        this.setState({ loading: false, error: true })
      })
  }

  paginationChange = (num) => {
    this.getMovies(this.state.query, num)
  }

  rateMovie = (id, rate) => {
    const guestId = sessionStorage.getItem('guestId')
    this.movieApi.rateMovie(id, rate, guestId)
    this.setState(({ rated }) => {
      return { rated: { ...rated, [id]: rate } }
    })
  }

  onTabChanged = (tab) => {
    const { query } = this.state
    if (tab === 'search') {
      this.getMovies(query || 'return')
    } else {
      this.getRated(1)
    }
  }

  render() {
    const { loading, error, movies, currentPage, total, rated, genres } = this.state
    const pagination =
      movies.length > 19 && !loading && !error ? (
        <Pagination
          className="pagination"
          defaultCurrent={1}
          current={currentPage}
          defaultPageSize={20}
          total={total * 20}
          showSizeChanger={false}
          onChange={(e) => this.paginationChange(e)}
        />
      ) : null

    const searchTab = (
      <React.Fragment>
        <header className="page-header">
          <SearchInput getMovies={this.getMovies} />
        </header>
        <main className="main">
          <CardList
            movies={this.state.movies}
            getMovies={this.getMovies}
            loading={loading}
            error={error}
            rateMovie={this.rateMovie}
            rated={rated}
          />
          {pagination}
        </main>
      </React.Fragment>
    )

    const ratedTab = (
      <main className="main">
        <CardList
          movies={this.state.movies}
          getMovies={this.getRated}
          loading={loading}
          error={error}
          rateMovie={this.rateMovie}
          rated={rated}
        />
        {pagination}
      </main>
    )

    const items = [
      { label: 'Search', key: 'search', children: searchTab },
      { label: 'Rated', key: 'rated', children: ratedTab },
    ]

    if (error) {
      return (
        <Alert
          className="offline-error"
          message="Internet connection lost"
          description="Check your internet connection and try again"
          type="error"
          showIcon
        />
      )
    }

    return (
      <div className="app">
        {/* <Online> */}
        <div className="page-wrapper">
          <MovieApiProvider value={genres}>
            <Tabs items={items} onChange={(e) => this.onTabChanged(e)} />
          </MovieApiProvider>
        </div>
        {/* </Online>
        <Offline>
          <Alert
            className="offline-error"
            message="Internet connection lost"
            description="Check your internet connection and try again"
            type="error"
            showIcon
          />
        </Offline> */}
      </div>
    )
  }
}
