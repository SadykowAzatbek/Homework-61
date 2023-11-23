import './App.css';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {CountryCode, CountryData, CountryName} from '../types';

const url = 'https://restcountries.com/';
const countryUrl = url + 'v2/all?fields=alpha3Code,name';

function App() {
  const [countryList, setCountryList] = useState<CountryCode[]>([]);
  const [countryInfo, setCountryInfo] = useState<CountryData>({
    name: '',
    capital: '',
    population: '',
    borders: '',
    flags: '',
  });

  const [country, setCountry] = useState(false);
  const [bordersCountry, setBordersCountry] = useState<string>('');

  const countryListData = useCallback(async () => {
    try {
      const countryResponse = await axios.get<CountryCode[]>(countryUrl);

      const promises = countryResponse.data.map(async (countryElem) => {
        const countryData = url + 'v2/alpha/' + countryElem.alpha3Code;
        const country = await axios.get<CountryName>(countryData);

        return {
          alpha3Code: countryElem.alpha3Code,
          name: country.data.name,
          id: Math.random(),
        };
      });

      const newCountry = await Promise.all(promises);
      setCountryList(newCountry);
    } catch (err) {
      alert(err);
    }
  }, []);

  useEffect(() => {
    void countryListData();
  }, [countryListData]);

  const addCountryInfo = async (index: number) => {
    const countryUrl = url + 'v2/alpha/' + countryList[index].alpha3Code;
    const countryResponse = await axios.get<CountryData>(countryUrl);

    setCountryInfo({
      name: countryResponse.data.name,
      capital: countryResponse.data.capital,
      population: countryResponse.data.population,
      borders: countryResponse.data.borders,
      flags: countryResponse.data.flags,
    });

    const countryBorders: string[] = [];

    for (let i = 0; i < countryResponse.data.borders.length; i++) {
      const bordersCountryUrl = url + 'v2/alpha/' + countryResponse.data.borders[i];
      const bordersCountryResponse = await axios.get<CountryName>(bordersCountryUrl);
      countryBorders.push(bordersCountryResponse.data.name);
    }

    setBordersCountry(countryBorders.join(', '));

    setCountry(true);
  };

  let styleBlock = {display: 'block'};
  let addCounter: React.ReactElement = <div></div>;

  if (country) {
    styleBlock = { display: 'none' };

    addCounter = (
      <div>
        <img src={countryInfo.flags.svg} alt="country" />
        <h5>{countryInfo.name}</h5>
        <p>
          <strong>Capital: </strong>
          {countryInfo.capital}
        </p>
        <p>
          <strong>Population: </strong>
          {countryInfo.population}
        </p>
        <p>
          <strong>Borders with: </strong>
          {bordersCountry}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="countryList">
        {countryList.map((elem, index) => (
          <div
            className="border-bottom country"
            key={elem.id}
            onClick={() => addCountryInfo(index)}
          >
            {elem.name}
          </div>
        ))}
      </div>
      <div className="countryInfo">
        <div style={styleBlock}>Выберите страну!</div>
        {addCounter}
      </div>
    </>
  );
}

export default App;