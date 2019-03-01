import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';


// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const PolygonLayer = fromJS({
  osm_id: 'data',
  source: 'PolygonAPI',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': '#3288bd',
    'fill-opacity': 0.8
  }
});

export const defaultMapStyle = fromJS(MAP_STYLE);