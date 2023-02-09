import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import "../../assets/appslider.css";
import { marks } from "./appSliderData";
import MapComp from "../map";
import { useEffect, useState } from "react";
import { PolygonLayer, SolidPolygonLayer } from "@deck.gl/layers/typed";
import { Button } from "@mui/material";
const AppSlider = () => {
  const [floorHeight, setFloorHeight] = useState<number | number[]>(0);
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [geoJSON, setGeoJSON] = useState<any>({});
  const [layers, setLayers] = useState<any[]>([]);
  const handleSlideFloorNumber = (mapData: any) => {
    let slide = floorNumber;
    let newLayers = layers;
    let i = 0;
    let floorLayers: any[] = [];
    for (i; i < slide; i++) {
      if (newLayers.length > 0) {
        let solidLayer = new SolidPolygonLayer({
          id: "arcss",
          data: [mapData],
          filled: true,
          stroked: true,
          extruded: true,
          wireframe: true,
          visible: true,
          getPolygon: (f) => f.coordinates[0],
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
      } else {
        floorLayers.push(
          new PolygonLayer({
            id: "polygon-layer",
            data: [mapData],
            pickable: true,
            stroked: true,
            filled: true,
            wireframe: true,
            coordinateOrigin: [44, 44, 55],
            lineWidthMinPixels: 1,
            getPolygon: (d) => d.coordinates[0],
            getFillColor: (d) => [99, 44, 156],
            getLineColor: [255, 255, 255],
            lineJointRounded: true,
            lineWidthScale: 2,
            getLineWidth: 1,
          })
        );
      }
    }
    setLayers(floorLayers);
  };
  useEffect(() => {
    handleSlideFloorNumber(geoJSON);
  }, [floorHeight, floorNumber, geoJSON]);
  return (
    <Grid container spacing={3}>
      <Grid item md={24} sm={8} lg={4} xl={3} xs={12}>
        <div style={{ padding: "1rem" }}>
          <Button variant="contained" component="label">
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
                      setGeoJSON(JSON.parse(result as any));
                    };
                  }
                }
              }}
            />
          </Button>
          <div style={{ marginTop: 30 }}>
            <label>Floor height &nbsp; &nbsp; {floorHeight}</label>
            <Slider
              size="medium"
              defaultValue={floorHeight}
              value={floorHeight}
              aria-label="Small"
              min={0}
              max={100}
              valueLabelDisplay="off"
              onChange={(event, value) => setFloorHeight(value)}
              marks={marks}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <label>
              Floor number &nbsp; &nbsp;{" "}
              {floorNumber > 0 ? floorNumber - 1 : floorNumber}
            </label>
            <Slider
              size="medium"
              defaultValue={floorNumber}
              value={floorNumber}
              aria-label="Small"
              min={0}
              max={100}
              valueLabelDisplay="off"
              onChange={(event, value) => setFloorNumber(value as number)}
              marks={marks}
            />
          </div>
        </div>
      </Grid>
      {!geoJSON ? (
        <></>
      ) : (
        <Grid item md={24} sm={6} lg={8} xl={7} xs={12}>
          <MapComp floorHeight={floorHeight} layers={layers} />
        </Grid>
      )}
      <Grid item md={24} sm={12} lg={6} xl={2} xs={12}>
        <p className="title2" style={{ marginTop: "3rem" }}>
          Statistiques
        </p>
        <ul>
          <li className="list"> Land Area (m2)</li>
          <li className="list"> Building Area (m2)</li>
          <li className="list"> Building Floor Area (m2)</li>
          <li className="list"> Volume(m3)</li>
          <li className="list"> Building Height {`${floorHeight}`}(m)</li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default AppSlider;
