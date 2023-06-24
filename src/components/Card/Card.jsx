import React, { Component } from 'react'
import { Typography, Rate } from 'antd'
import format from 'date-fns/format'

import MovieApi from '../../services/MovieApiDb'
import { MovieApiConsumer } from '../MovieDbApiContext'

import { truncate, averageColor, formatDate, renderImage } from './lib/lib'
import './Card.css'

function Card(props) {
  const movieApi = new MovieApi()
  const { name, title, overview, release_date, poster_path, id, vote_average, genre_ids } = props.data
  const { rateMovie, rated } = props
  const { Text } = Typography
  const image = renderImage(poster_path)

  let truncLength = 160

  if (title.length > 35) {
    truncLength = 90
  } else if (title.length > 20) {
    truncLength = 120
  }
  if (genre_ids.length > 3) {
    truncLength -= 20
  }

  return (
    <li className="card">
      {image}
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-area">
            <h3 className="card-title">{name || title}</h3>
            <div className="card-average" style={{ border: `2px solid ${averageColor(vote_average)}` }}>
              <span>{vote_average.toFixed(1)}</span>
            </div>
          </div>
          <Text className="card-date" type="secondary">
            {formatDate(release_date)}
          </Text>
          <div className="card-genres">
            <MovieApiConsumer>
              {(genres) => {
                return genres
                  .filter((el) => {
                    return genre_ids.includes(el.id)
                  })
                  .map((el) => {
                    return (
                      <span key={el.id} className="genre">
                        {el.name}
                      </span>
                    )
                  })
              }}
            </MovieApiConsumer>
          </div>
        </div>
        <div className="card-description">
          <Text>{truncate(overview, truncLength)}</Text>
          <Rate
            count={10}
            value={rated[id] || 0}
            allowHalf
            onChange={(e) => {
              rateMovie(id, e)
            }}
          />
        </div>
      </div>
    </li>
  )
}

export default Card
