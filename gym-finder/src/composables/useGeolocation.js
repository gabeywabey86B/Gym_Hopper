import { ref } from 'vue'
import { getDistance } from 'geolib'

export function useGeolocation() {
  const userCoords = ref(null)
  const geoError = ref(null)

  function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        geoError.value = 'Geolocation not supported'
        reject()
        return
      }

      navigator.geolocation.getCurrentPosition(
        pos => {
          userCoords.value = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }
          resolve(userCoords.value)
        },
        err => {
          geoError.value = err.message
          reject(err)
        }
      )
    })
  }

  function sortByDistance(locations) {
    if (!userCoords.value) return locations

    return [...locations].sort((a, b) => {
      const distA = getDistance(
        { latitude: userCoords.value.lat, longitude: userCoords.value.lng },
        { latitude: a.lat, longitude: a.lng }
      )
      const distB = getDistance(
        { latitude: userCoords.value.lat, longitude: userCoords.value.lng },
        { latitude: b.lat, longitude: b.lng }
      )
      return distA - distB
    })
  }

  return { userCoords, geoError, getUserLocation, sortByDistance }
}