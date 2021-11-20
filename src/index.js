import './css/styles.css';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
let countryInfoMarkup = null;
const refs = {
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  input: document.querySelector('#search-box'),
};
const BASE_URL = 'https://restcountries.com/v3.1/name/';
const FILTER = '?fields=name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}${FILTER}`).then(response => {
    if (response.ok) {
      return response.json();
    }
  });
}

function clean() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function render(name) {
  const countryListMarkup = name
    .map(
      country => `<li class="country-item" style="display: flex; align-items: center;">
  <img class='icon' src='${country.flags.svg}' width='30px' height='30px'>
<h2 class="country-name" style="margin-left: 20px;">${country.name.official}</h2> </li>`,
    )
    .join(' ');

  refs.countryList.innerHTML = countryListMarkup;
  
  if (name.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    clean();
  }

  if (name.length === 1) {
    countryInfoMarkup = name
      .map(
        country => `
    <p class='text'><span style="font-weight: bold">Capital:</span> ${country.capital}</p>
    <p class='text'><span style="font-weight: bold">Population:</span> ${country.population}</p>
    <p class='text'><span style="font-weight: bold">Languages:</span> ${Object.values(country.languages).join(", ")}</p>`,
      )
      .join(' ');

    refs.countryInfo.innerHTML = countryInfoMarkup;
    document.querySelector('.country-item').style.fontSize = '14px';
  } else {
    refs.countryInfo.innerHTML = '';
  }
}

function onError(error) {
  Notiflix.Notify.warning('Oops, there is no country with that name');
  console.log(error);
  refs.countryInfo.innerHTML = '';
}

function onInput() {
  const name = refs.input.value.trim();

  if (name.length === 0) {
    clean();
    return;
  }
  fetchCountries(name).then(render).catch(onError);
}

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
