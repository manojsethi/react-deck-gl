import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import "../../assets/appslider.css";
import { marks } from "./appSliderData";
import * as turf from "@turf/turf";
import MapComp from "../map";
import { useEffect, useState } from "react";
import { PolygonLayer, SolidPolygonLayer } from "@deck.gl/layers/typed";
import { Button } from "@mui/material";
import { findNewBuildingArea } from "../../utils/vencityFormula";
import { v4 as uuid } from "uuid";
export interface ILatLng {
  lat: number;
  lng: number;
}
const AppSlider = () => {
  const [floorHeight, setFloorHeight] = useState<number | number[]>(0);
  const [floorNumber, setFloorNumber] = useState<number>(0);
  const [currentLatlng, setCurrentLatlng] = useState<ILatLng>({
    lat: 76.8188,
    lng: 30.7421,
  });
  const [buildingArea, setBuildingArea] = useState<number>(0);
  const [buildingHeight, setBuildingHeight] = useState<number>(0);
  const [coverage, setCoverage] = useState<number | number[]>(100);
  const [landArea, setLandArea] = useState<number>(0);
  const [geoJSON, setGeoJSON] = useState<any>({});
  const [originalGeoJSON, setOriginalGeoJSON] = useState<any>({});
  const [buildingFloorArea, setbuildingFloorArea] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [layers, setLayers] = useState<any[]>([]);
  const [initialLayer, setInitialLayer] = useState<any>();
  const handleSlideFloorNumber = () => {
    const firstTimeDataLoad = {
      type: "MultiData",
      coordinates: [[geoJSON?.coordinates?.[0]?.[0]]],
    };
    let slide = floorNumber;
    let newLayers = layers;
    let i = 1;
    let floorLayers: any[] = [];
    floorLayers.push(initialLayer);
    for (i; i < slide; i++) {
      if (newLayers.length > 0) {
        let solidLayer = new SolidPolygonLayer({
          id: uuid() + Date.now().toString(),
          data: [firstTimeDataLoad],
          filled: true,
          stroked: true,
          extruded: true,
          wireframe: true,
          visible: true,
          getPolygon: (f) => f?.coordinates?.[0],
          autoHighlight: true,
          getElevation: (f) => floorHeight as number,
          lineWidthMinPixels: 20,
          getLineColor: [0, 0, 0],
          elevationScale: i * (floorHeight as number),
          positionFormat: "XY",
          lineJointRounded: true,
          lineWidthScale: 3,
          getLineWidth: 1,
          getFillColor: (d) => [218, 165, 32],
        });
        floorLayers.push(solidLayer);
        setLayers(floorLayers);
      }
    }
    setVolume((floorHeight as number) * buildingFloorArea);
    setBuildingHeight(floorNumber * (floorHeight as number));
    setBuildingArea(floorNumber * buildingFloorArea);
    setLayers(floorLayers);
  };
  const loadFirstTimePolygon = (json: any) => {
    let layer = new PolygonLayer({
      id: "polygon-layer",
      data: [json],
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      coordinateOrigin: [44, 44, 55],
      lineWidthMinPixels: 1,
      getPolygon: (d) => d?.coordinates?.[0],
      getFillColor: (d) => [127, 255, 212],
      getLineColor: [0, 0, 0, 80],
      lineJointRounded: true,
      lineWidthScale: 1,
      getLineWidth: 1,
    });
    setInitialLayer(layer);
    setLayers([layer]);
  };
  const hanldeIncreaseCoverage = (e: any, v: any) => {
    setCoverage(v);
    let newbuildingGeoJSON = findNewBuildingArea(originalGeoJSON, v);
    var polygon = turf.polygon([newbuildingGeoJSON!]);
    const polygonArea = turf.area(polygon);
    setbuildingFloorArea(polygonArea);
    setGeoJSON({ ...geoJSON, coordinates: [[newbuildingGeoJSON]] });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentLatlng({
        lat: position.coords.longitude,
        lng: position.coords.latitude,
      });
    });
  }, []);
  useEffect(() => {
    handleSlideFloorNumber();
  }, [floorNumber, floorHeight, coverage]);
  return (
    <Grid container spacing={3}>
      <Grid item md={24} sm={8} lg={4} xl={3} xs={12}>
        <div style={{ padding: "1rem" }}>
          <Button variant="contained" component="label" fullWidth>
            LOAD JSON
            <input
              type="file"
              id="input_json"
              hidden
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  const fileName = event.target.files[0].name;
                  const splitFileName = fileName.split(".");
                  if (splitFileName[1] === "geojson") {
                    const updatedJSON = event.target.files[0];
                    const fileReader = new FileReader();
                    fileReader.readAsText(updatedJSON, "UTF-8");
                    fileReader.onload = (e) => {
                      const target = e.target;
                      const result = target?.result;
                      let parsedJson = JSON.parse(result as any);
                      const coords = parsedJson.coordinates[0]?.[0];
                      setCurrentLatlng({
                        lat: coords?.[0]?.[0],
                        lng: coords?.[1]?.[1],
                      });
                      loadFirstTimePolygon(parsedJson);
                      setGeoJSON(parsedJson);
                      setOriginalGeoJSON(parsedJson);
                      const coordinates = parsedJson?.coordinates[0];
                      var polygon = turf.polygon([coordinates[0]]);
                      const landCoverage = turf.area(polygon);
                      setLandArea(landCoverage);
                      setbuildingFloorArea(landCoverage);
                    };
                  }
                }
              }}
            />
          </Button>
          <div style={{ marginTop: 30 }}>
            <div>
              <label>Lot Coverage</label> <b>100</b>
            </div>
            <Slider
              size="medium"
              value={coverage}
              aria-label="Small"
              valueLabelDisplay="on"
              min={0}
              max={100}
              onChange={(event, value) => hanldeIncreaseCoverage(event, value)}
              // marks={marks}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>0</label> <b>100</b>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <label>Floor height</label>
            <Slider
              size="medium"
              value={floorHeight}
              valueLabelDisplay="on"
              aria-label="Small"
              min={0}
              max={5}
              onChange={(event, value) => setFloorHeight(value)}
              // marks={marks}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>0</label> <b>5</b>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <label>Floor number</label>
            <Slider
              size="medium"
              defaultValue={floorNumber}
              value={floorNumber}
              valueLabelDisplay="on"
              aria-label="Small"
              min={0}
              max={15}
              onChange={(event, value) => setFloorNumber(value as number)}
              // marks={marks}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>0</label> <b>15</b>
            </div>
          </div>
        </div>
      </Grid>
      {!currentLatlng?.lat ? (
        <>Loading...</>
      ) : (
        <Grid item md={24} sm={6} lg={8} xl={7} xs={12}>
          <MapComp
            floorHeight={floorHeight}
            layers={layers}
            latLng={currentLatlng}
          />
        </Grid>
      )}
      <Grid item md={24} sm={12} lg={6} xl={2} xs={12}>
        <p className="title2" style={{ marginTop: "3rem" }}>
          Statistiques
        </p>
        <ul>
          <li className="list">Land Area {`${landArea}`}(m2)</li>
          <li className="list"> Building Area {`${buildingArea}`}(m2)</li>
          <li className="list">
            Building Floor Area {`${buildingFloorArea}`}
            (m2)
          </li>
          <li className="list"> Volume {`${volume}`}(m3)</li>
          <li className="list"> Building Height {`${buildingHeight}`}(m)</li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default AppSlider;
