import type { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet'

import { useState } from 'react'
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import sectionMap from '../secciones-map.json'

const data = sectionMap.data

const initialPosition: LatLngExpression = [18.472113134457878, 3.597817222715871]

const purpleOptions = { color: 'purple' }

export interface Feature {
  type: string
  properties: FeatureProperties
  geometry: Geometry
}

export interface Geometry {
  type: string
  coordinates: number[][]
}

export interface FeatureProperties {
  BARRIO: string
  COMUNA: number
  PERIMETRO: number
  AREA: number
  OBJETO: string
}

export default function App() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Feature | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null)

  const handleClick = (neighborhood: Feature) => (event: LeafletMouseEvent) => {
    setSelectedNeighborhood(neighborhood)
    setSelectedPosition(event.latlng)
  }

  return (
    <div className='container'>
      <div className='main-map'>
        <MapContainer center={initialPosition} scrollWheelZoom zoom={8}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            url=''
          />
          {data.map((feature) => {
            // const coords = feature.geometry.coordinates.flat(2).map((c) => c.toReversed())
            let coords

            if (feature.geometry.type === 'Polygon') {
              coords = feature.geometry.coordinates.flat().map((c) => c.toReversed())
            } else {
              coords = feature.geometry.coordinates.flat(2).map((c) => c.toReversed())
            }

            return (
              <Polygon
                eventHandlers={{
                  click: handleClick({
                    ...feature,
                    geometry: { ...feature.geometry, coordinates: coords },
                  }),
                }}
                key={crypto.randomUUID()}
                pathOptions={purpleOptions}
                positions={coords as LatLngExpression[]}
              />
            )
          })}
        </MapContainer>
      </div>
      <div className='main-map'>
        <MapContainer
          center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : initialPosition}
          scrollWheelZoom
          zoom={11}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            url=''
          />
          <MapCenter
            center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : null}
            zoom={selectedPosition ? 12 : 10}
          />
          {!!selectedNeighborhood && (
            <Polygon
              pathOptions={purpleOptions}
              positions={selectedNeighborhood.geometry.coordinates as LatLngExpression[]}
            />
          )}
        </MapContainer>
      </div>
    </div>
  )
}

function MapCenter({ center, zoom = 13 }: { center: LatLngExpression | null; zoom?: number }) {
  const map = useMap()

  map.setView(center ?? map.getCenter(), zoom)

  return null
}
