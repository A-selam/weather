//  the date-fns repo: https://github.com/date-fns/date-fns
const loading_card = document.createElement('div');
loading_card.classList.add('loading-card', 'hide');
loading_card.textContent = 'Loading...';

const error_card = document.createElement('div');
error_card.classList.add('error-card', 'hide');
const errorTitle = document.createElement('h1');
const errorDetail = document.createElement('h2');
error_card.append(errorTitle, errorDetail);

document.querySelector('div.main').append(loading_card)
document.querySelector('div.main').append(error_card)

const current_card = document.querySelector('div.current-card');
const searchBar = document.querySelector('input#searchBar');

// error codes here...
// https://www.weatherapi.com/docs/#intro-error-codes

const dom_location = document.querySelector('h2.location');
const dom_condition_icon = document.querySelector('img.condition-icon');
const temp = document.querySelector('p.temp');
const dom_condition_text = document.querySelector('p.condition-text');
const dom_feels_like = document.querySelector('p.feels-like');

const dom_uv_index = document.querySelector('span.uv-index');
const dom_humidity = document.querySelector('span.humidity');
const dom_visibility = document.querySelector('span.visibility');
const dom_wind_speed = document.querySelector('span.wind-speed');
const dom_precipitation = document.querySelector('span.precipitation');

async function currentWeather(city) {
    const key = '9ec9bbb7f2814aacabe72411242006';
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`, { mode: 'cors' });
        if (!response.ok) {
            const error_body = await response.json();
            throw (error_body.error.code);
        }
        const responseBody = await response.json();
        return responseBody;

    } catch (err) {
        throw err;
    }
}

async function processData(city) {
    try {
        let data = await currentWeather(city);

        let locationDetail = { city: data.location.name, country: data.location.country, localTime: data.location.localtime, is_day: data.current.is_day };
        let weatherDetail = {
            temp_c: data.current.temp_c,
            temp_f: data.current.temp_f,
            condition_text: data.current.condition.text,
            condition_icon: data.current.condition.icon,
            feelsLike_c: data.current.feelslike_c,
            feelsLike_f: data.current.feelslike_f,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_mph,
            windDirection: data.current.wind_dir,
            precipitation: data.current.precip_mm,
            uvIndex: data.current.uv,
            visibility_Km: data.current.vis_km,
        }

        let details = { location: locationDetail, wether: weatherDetail };
        return details;

    } catch (error) {
        throw error;
    }
}

async function domRender(city) {
    try {
        error_card.classList.replace('show', 'hide')
        current_card.classList.replace('show', 'hide');
        loading_card.classList.replace('hide', 'show');

        const details = await processData(city);

        if (details === undefined) {
            throw 'Error'
        }

        dom_location.textContent = '';
        dom_location.textContent = details.location.city + ', ' + details.location.country;

        dom_condition_icon.src = "";
        dom_condition_icon.src = 'https://' + details.wether.condition_icon;
        temp.textContent = "";
        temp.textContent = details.wether.temp_c + "°C";
        dom_condition_text.textContent = "";
        dom_condition_text.textContent = details.wether.condition_text;
        dom_feels_like.textContent = '';
        dom_feels_like.textContent = 'Feels like ' + details.wether.feelsLike_c + '°';

        dom_uv_index.textContent = "";
        dom_uv_index.textContent = details.wether.uvIndex;
        dom_humidity.textContent = "";
        dom_humidity.textContent = details.wether.humidity + '%';
        dom_visibility.textContent = "";
        dom_visibility.textContent = details.wether.visibility_Km + ' Km';
        dom_wind_speed.textContent = "";
        dom_wind_speed.textContent = details.wether.windSpeed + ' mph';
        dom_precipitation.textContent = "";
        dom_precipitation.textContent = details.wether.precipitation + ' mm';

        error_card.classList.replace('show', 'hide')
        current_card.classList.replace('hide', 'show');
        loading_card.classList.replace('show', 'hide');

    } catch (err) {
        errorTitle.textContent = 'Something went worng...';
        if (err == 1006) {
            errorDetail.textContent = 'please enter a valid city!'
        } else {
            errorDetail.textContent = 'Please contact the developer!'
        }
        current_card.classList.replace('show', 'hide');
        loading_card.classList.replace('show', 'hide');
        error_card.classList.replace('hide', 'show');
    }
};

searchBar.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        let searchTerm = searchBar.value;
        if (searchTerm === '') {
            searchTerm = 'Addis Ababa';
        }
        domRender(searchTerm);
    }
});

domRender('Addis Ababa')

// todo
// making possible to use the cog at the top to toggle different units
// making the look change based on the data is being retrieved