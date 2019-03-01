import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl'
import { Jumbotron, InputGroup, InputGroupText, Button, Container, InputGroupAddon, Input, PageHeader, Progress } from 'reactstrap';
import axios from 'axios'

mapboxgl.accessToken = 'insert_api_key_here';

class App extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      lng: 1,
      lat: 1,
      zoom: 0,
      searchStr: null,
      boundary: null,
      bounds: null
  }}

  submitSelection(search_str) {
    var url_string = `https://nominatim.openstreetmap.org/search.php?q=${search_str}&polygon_geojson=1&format=geojson`
    console.log(url_string);
    axios.get(url_string).then(response => {
      this.setState({'boundary': response.data.features[0]['geometry']});
      console.log(this.state.boundary);
      this.map.getSource('boundary').setData(this.state.boundary);
      this.map.fitBounds(response.data.features[0]['bbox']);})
  }
      
  updateStr(event) {
     this.setState({searchStr: event.target.value});
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });

    this.map.on('load', () => {
      console.log(this.state.boundary);
      
      this.map.addSource('boundary', {type: 'geojson', data: this.state.boundary});  
      this.map.addLayer({
        id: 'boundary',
        type: 'fill',
        source: 'boundary'
      })
    });
    
    this.map.on('move', () => {
      const { lng, lat } = this.map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(1)
      });
    });
  }


  render() {
    const { lng, lat, zoom, searchStr, boundary } = this.state;


    return (
      <div>
        <Jumbotron>
          <Container>
            <h1>JumpTo</h1>
            <p className="lead">Ever wonder where a place is or how big it is? Wonder no more!</p>
            <hr className="my-2" />
            <p>This is a fast way to grab the boundary or location of anywhere in the world. By using the MapBox APIs and Nominatim plus Open Street Map.
            </p>
            <InputGroup size="lg" >
            <Input name="searchStr"
            placeholder="Enter a city, state or country!" onChange={this.updateStr.bind(this)}/>
            <InputGroupAddon addonType="append"><Button onClick={() => this.submitSelection(this.state.searchStr)}>Submit</Button></InputGroupAddon>
            </InputGroup>
          </Container>
        </Jumbotron>
        <Container>
          <div className="text-center">75%</div>
          <Progress value={75} />
          <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          </div>
          <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        </Container>
      </div>
      );
    }
  }

export default App;
