import { MapView } from "@deck.gl/core";
import DeckGL from "@deck.gl/react/typed";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "react-map-gl";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2FuZGVlcDYwODYiLCJhIjoiY2xkdHJwZGc3MTc5cDNvcDl4MjBqdTZzbiJ9.-jXlvQsNqJj7Qnzr3lGydA";
const INITIAL_VIEW_STATE = {
  longitude: 6.82386387,
  latitude: 46.469095495,
  zoom: 17,
  pitch: 45,
  bearing: 20,
};

function MapComp({
  floorHeight,
  layers,
}: {
  floorHeight: number | number[];
  layers: any;
}) {
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      pickingRadius={10}
      height={800}
      width={800}
      style={{ marginLeft: "500px" }}
    >
      <MapView id="map" width="100%" controller={true}>
        <Map
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </MapView>
    </DeckGL>
  );
}

export default MapComp;
