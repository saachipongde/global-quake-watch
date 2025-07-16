import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import './App.css';

function App() {
  const [duration, setDuration] = useState('day');
  const [magnitude, setMagnitude] = useState('all');
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${magnitude}_${duration}.geojson`;
    setLoading(true);
    
    const fetchEarthquakeData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setEarthquakes(data.features);
      } catch (e) {
        console.error("Failed to fetch earthquake data:", e);
        setEarthquakes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakeData();
  }, [duration, magnitude]);

  return (
    <div className="App">
      <div className="controls-container">
        <div className="control-group">
          <img src="../fevicon.ico"  alt="Global Quake Watch logo" className="logo-image" />
        </div>
        <h1>Global Quake Watch</h1>

        <div className="control-group">
          <label htmlFor="duration-select">Time Range:</label>
          <select 
            id="duration-select"
            value={duration} 
            onChange={e => setDuration(e.target.value)}
          >
            <option value="hour">Past Hour</option>
            <option value="day">Past Day</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="magnitude-select">Magnitude:</label>
          <select 
            id="magnitude-select"
            value={magnitude} 
            onChange={e => setMagnitude(e.target.value)}
          >
            {<option value="all">All Earthquakes</option>}
            <option value="1.0">M1.0+</option>
            <option value="2.5">M2.5+</option>
            <option value="4.5">M4.5+</option>
          </select>
        </div>

        <div className="control-group">
          <h3>Magnitude Key</h3>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'rgba(128, 0, 128, 0.7)' }}></span>
            <span>M 7.0+</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'rgba(255, 0, 0, 0.7)' }}></span>
            <span>M 6.0 - 6.9</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'rgba(255, 165, 0, 0.7)' }}></span>
            <span>M 4.5 - 5.9</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'rgba(255, 255, 0, 0.7)' }}></span>
            <span>M 2.5 - 4.4</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'rgba(0, 255, 0, 0.7)' }}></span>
            <span>Below M 2.5</span>
          </div>
          <p className="legend-size-note">Circle size also increases with magnitude.</p>
        </div>
        
      </div>
      {loading ? <p>Loading map...</p> : <MapView earthquakes={earthquakes} />}
    </div>
  );
}

export default App;