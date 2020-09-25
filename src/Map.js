import React from "react";
import "./Map.css";
import { Map as LeafletMap, TileLayer } from "react-leaflet";

function Map({ center, zoom }) {
  // Props => center and zoom
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https:{s}.title.openstreetmap.org/{z}/{x}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        ></TileLayer>
      </LeafletMap>
    </div>
  );
}

export default Map;
