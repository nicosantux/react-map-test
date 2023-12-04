import type { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet'

import { useState } from 'react'
import { MapContainer, TileLayer, Polygon, useMap, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import sectionMap from '../secciones-map.json'

const data = sectionMap.data.getCoordinatesSections

const initialPosition: LatLngExpression = [19.542292820200803, 3.582170921357595]

const purpleOptions = { color: 'purple' }

export interface Feature {
  type: string
  properties: FeatureProperties
  geometry: Geometry
}

export interface FeatureProperties {}

export interface Geometry {
  type: string
  coordinates: number[][]
}

export default function App() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Feature | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null)

  const handleClick = (neighborhood: any) => (event: LeafletMouseEvent) => {
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
          {data.map(({ geometryInFormatLatLong }) => {
            const coords = geometryInFormatLatLong.map((coord) => coord.toReversed())

            return (
              <Polygon
                eventHandlers={{
                  click: handleClick({
                    geometry: { coordinates: coords },
                  }),
                }}
                key={crypto.randomUUID()}
                pathOptions={purpleOptions}
                positions={coords as LatLngExpression[]}
              >
                <Tooltip sticky>Hola, soy un tooltip</Tooltip>
              </Polygon>
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
