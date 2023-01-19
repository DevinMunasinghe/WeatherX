import React, { useState, useEffect } from "react";
import axios from 'axios'
import Snow from "./snow";
import Rain from "./rain";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

function App() {

  //usestates to set fetch all data
  const [data, setData] = useState({})
  //usestates to set availaboility of data
  const [dataAvailable, setIsDataAvailable] = useState(false)
  //usestates to set location from user inputs
  const [location, setLocation] = useState('')

  //toogle flag value
  const [checked, setChecked] = useState(false);
  //set fetched celcius values
  const [celciusValue, setCelciusValue] = useState({});


  const searchLocation = async (value) => {
    setLocation(value.value ? value.value.terms[0].value : 'London')

    //url get fetch data from openweather map api 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${value.value ? value.value.terms[0].value : 'London'}&units=imperial&appid=0de8100e5a516356d39ac6a2581405a2`
    //url get fetch celcius data from openweather map api 
    const urlCelcius = `https://api.openweathermap.org/data/2.5/weather?q=${value.value ? value.value.terms[0].value : 'London'}&units=metric&appid=0de8100e5a516356d39ac6a2581405a2`


    let response = await axios.get(url);
    let responseCelcius = await axios.get(urlCelcius);

    if (response.data && responseCelcius.data) {
      setData(response.data)
      setCelciusValue(responseCelcius.data)
      setIsDataAvailable(true)
      setLocation('')
    } else {
      setLocation('')
    }
  }

  const changeTempValue = (event) => {
    setChecked(!checked);
  }

  //calling initial values
  useEffect(() => {
    let value = 'defult'
    searchLocation(value)
  }, [])



  return (
    <div className="app">

      {/* search input feild */}
      <div className="search">

        <GooglePlacesAutocomplete
          selectProps={{
            location,
            onChange: searchLocation,
            placeholder: 'Search Location',
            // noOptionsMessage: { "No options"},
            // NoOptionsMessage: 'Search locations',
            LoadingMessage: 'Search locations',
            styles: {
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? 'white' : 'white',
                backgroundColor: "rgba(255, 255, 255, 0.8)"
              }),
              input: (provided) => ({
                ...provided,
                color: 'grey',
                width: 650,
              }),
              option: (provided) => ({
                ...provided,
                color: 'grey',
                // opacity: 100,
                backgroundColor: "rgba(255, 255, 255, 0.8)"

              }),
              singleValue: (provided) => ({
                ...provided,
                color: 'grey',
                // backgroundColor: "rgba(255, 255, 255, 0.8)"
              }),
            }
          }}

        />


      </div>



      {/* snow animation */}
      {dataAvailable && data.weather[0].main === 'Snow' ? <Snow /> : null}

      {/* toogle for changing tempurature mearing units */}
      <div className="container">
        <div className="tempurateToggle">
          <div>
            <div class="row">
              <div class="toggle-button-cover">
                <div class="button-cover">
                  <div class="button r" id="button-1">
                    <input type="checkbox" class="checkbox" onClick={changeTempValue} />
                    <div class="knobs"></div>
                    <div class="layer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top">
          <div className="location">
            <p>{data.name} , {dataAvailable && data.sys.country}
            </p>
          </div>
          <div className="temp">
            {/* Temperature in farunhite round off to nearest whole number*/}
            {data.main ? <h1>{checked ? celciusValue.main.temp.toFixed() + "°C" : data.main.temp.toFixed() + "°F"}</h1> : null}
            {/* weather condition code */}
            {data.weather ? <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}></img> : null}
            {/* weather condition code description */}
            {data.weather ? <p className="descriptiontext">{data.weather[0].description}</p> : null}
          </div>
          <div className="description">
            {/* weather condition code */}
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name != undefined &&
          <div className="bottom">
            <div className="feels">
              {/* feels like tenpurature round off to nearest whole number */}

              {data.main ? <p className="bold">{checked ? celciusValue.main.feels_like.toFixed() + "°C" : data.main.feels_like.toFixed() + "°F"}</p> : null}

              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {/* humidity round off to nearest whole number */}
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}

              <p>Humidity</p>
            </div>
            <div className="wind">
              {/* wind speed round off to nearest whole number */}
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }

      </div>

      {/* Rain Animation */}
      {dataAvailable && data.weather[0].main === 'Rain' ? <Rain /> : null}

    </div>
  );
}

export default App;
