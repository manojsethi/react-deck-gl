import * as turf from "@turf/turf";
export const findNewBuildingArea = (inputJSON: any, sliderValue: number) => {
  try {
    if (inputJSON) {
      const newPolygon = turf.polygon(inputJSON?.coordinates?.[0], {
        name: "poly1",
      });
      if (newPolygon) {
        const center = turf.centerOfMass(newPolygon);
        if (center) {
          let responseArray: any[] = [];
          inputJSON?.coordinates?.[0]?.[0]?.map((z: any) => {
            let lat1 = z?.[0];
            let lon1 = z?.[1];
            let lat2 = center?.geometry?.coordinates?.[0];
            let lon2 = center?.geometry?.coordinates?.[1];
            const from = turf.point([lat2, lon2]);
            const to = turf.point([lat1, lon1]);
            const distance = turf.distance(from, to, { units: "meters" });
            const brng = turf.bearing(from, to);
            const d = (distance * sliderValue) / 100;
            var destination = turf.destination(from, d, brng, {
              units: "meters",
            });
            responseArray.push([
              destination.geometry.coordinates[0],
              destination.geometry.coordinates[1],
            ]);
          });
          return responseArray;
        }
      }
    }
  } catch (err) {
    console.log(err, "error");
  }
};
