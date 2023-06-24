import React from 'react'
import format from 'date-fns/format'

export const truncate = (str, num) => {
  if (str.length <= num) return str
  const substring = str.substr(0, num - 1)
  return `${substring.substr(0, substring.lastIndexOf(' '))}...`
}

export const formatDate = (date) => {
  if (!date) {
    return 'Release date unknown'
  }
  return format(new Date(date), 'MMMM d, y')
}

export const renderImage = (path) => {
  const _urlBase = 'https://image.tmdb.org/t/p/original'

  if (!path) {
    return <div className="card-image-absent" />
  }
  return <img src={_urlBase + path} className="card-image" alt="Poster" />
}

export const averageColor = (avg) => {
  if (avg >= 0 && avg <= 3) return '#E90000'
  if (avg > 5 && avg <= 5) return '#E97E00'
  if (avg > 5 && avg <= 7) return '#E9D100'
  return '#66E900'
}
