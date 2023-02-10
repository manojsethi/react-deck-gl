import { MapView } from "@deck.gl/core";
import DeckGL from "@deck.gl/react/typed";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "react-map-gl";
import { ILatLng } from "../appSlider";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2FuZGVlcDYwODYiLCJhIjoiY2xkdHJwZGc3MTc5cDNvcDl4MjBqdTZzbiJ9.-jXlvQsNqJj7Qnzr3lGydA";

function MapComp({
  floorHeight,
  layers,
  latLng,
}: {
  floorHeight: number | number[];
  layers: any;
  latLng: ILatLng;
}) {
  const INITIAL_VIEW_STATE = {
    longitude: latLng?.lat,
    latitude: latLng?.lng,
    zoom: 17,
    pitch: 45,
    bearing: 20,
  };
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={[layers]}
      pickingRadius={10}
      height={"90%"}
      width={"50%"}
      style={{ marginLeft: "500px", marginTop: "20px" }}
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
