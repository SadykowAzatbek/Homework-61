import './App.css';
import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {countryCode, CountryName} from '../types';

const url = ' https://restcountries.com/';
const countryUrl = url + 'v2/all?fields=alpha3Code,name';

function App() {
  const [countryList, setCountryList] = useState<countryCode[]>([]);

  const countryListData = useCallback(async () => {
    try {
      const countryResponse = await axios.get<countryCode[]>(countryUrl);

      const promises = countryResponse.data.map(async (countryElem) => {
        const countryData = url + 'v2/alpha/' + countryElem.alpha3Code;
        const country = await axios.get<CountryName>(countryData);

        return {
          alpha3Code: countryElem.alpha3Code,
          name: country.data.name,
          id: Math.random(),
        }
      });

      const newCountry = await Promise.all(promises);
      setCountryList(newCountry);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    void countryListData();
  }, [countryListData]);



  return (
    <>
      <div>
        {countryList.map((elem) => (
          <div className="border-bottom country" key={elem.id}>{elem.name}</div>
        ))}
      </div>
    </>
  );
}

export default App;
