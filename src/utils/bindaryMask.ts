import shenzhenData from '@/static/shenzhen.json';
import { FeatureCollection, Feature, Polygon, MultiLineString } from 'geojson';

const getRings = (): [number, number][][] => {
  const coords = shenzhenData.features[0].geometry.coordinates;
  return coords.map(
    (polygon: number[][][]) => polygon[0] as [number, number][]
  );
};

export const createShenzhenMask = (): FeatureCollection<Polygon> => {
  const worldBounds: [number, number][] = [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90],
  ];

  const maskFeature: Feature<Polygon> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [worldBounds, ...getRings()],
    },
  };

  return { type: 'FeatureCollection', features: [maskFeature] };
};

export const createShenzhenBorder = (): FeatureCollection<MultiLineString> => {
  const borderFeature: Feature<MultiLineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: getRings(),
    },
  };

  return { type: 'FeatureCollection', features: [borderFeature] };
};
