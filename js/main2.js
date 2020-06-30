document.querySelector('.formCtn button').addEventListener('click', (e)=>{
    e.preventDefault();

    //// Make image height smaller
    document.querySelector('.imgAndInfoCtn .randomImg').style.height = '30vh';

    //// Display info and forecast
    document.querySelector('.imgAndInfoCtn .infoCtn').style.display = 'flex';
    document.querySelector('.forecast').style.display = 'block';

    let inputCountry = document.querySelector('#inputCountry').value.toLowerCase();
    let inputCity = document.querySelector('#inputCity').value.toLowerCase();
    let countryCode;

    //// Fetch list of country and return the country code
    fetch('json/country.list.json')
        .then(list => list.json())
        .then(countries => {
            countries.forEach(country => {
                if (country.name.toLowerCase().indexOf(inputCountry) !== -1) {
                    countryCode = country['alpha-2'].toLowerCase();
                }
            })

            //// Display random img of the city
            let imgUrl = `https://source.unsplash.com/800x800/?${inputCity},building`;
            document.querySelector('.imgAndInfoCtn .randomImg').style.background = `url("${imgUrl}") bottom`;

            //// Fetch the weather data using the country code and input city
            const apikey = '9a2ad67a0fa15d04ba82bf3d4d9b2b38';
            let url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity},${countryCode}&appid=${apikey}&units=metric`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    ////-----------------------------------------------------////
                    //// Working with the weather data received from the API ////
                    ////-----------------------------------------------------////

                    //// Getting name of the city
                    document.querySelector('.imgAndInfoCtn .cityName').innerHTML = data.city.name;

                    //// Display date info of today in long format
                    let now = new Date();
                    let options = {weekday:'long', year:'numeric', month: 'long', day:'numeric'};
                    document.querySelector('.imgAndInfoCtn .todayDate').innerHTML = now.toLocaleDateString('en-EN', options);

                    //// Accessing the array containing weather information ////
                    let array = data.list;

                    //// Display icon of the current weather
                    let iconCode = array[0].weather[0].icon;
                    let iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                    document.querySelector('.imgAndInfoCtn .icon').innerHTML = `<img src="${iconURL}"/>`

                    //// Display current temperature, and temperature range, humidity and wind speed of today
                    document.querySelector('.imgAndInfoCtn .currentTemp').innerHTML = Math.round(array[0].main.temp);
                    document.querySelector('.imgAndInfoCtn .currentHumid').innerHTML = array[0].main.humidity;
                    document.querySelector('.imgAndInfoCtn .currentWindSpeed').innerHTML = Math.round(array[0].wind.speed);

                    //// Display five day forecast including today
                    for (let i = 0; i < 5; i++) {
                        let date = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i);
                        let year = date.getFullYear();
                        let month = (date.getMonth() < 10) ? `0${date.getMonth() +1}` : date.getMonth() +1;
                        let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
                        let cutArr = array.filter(object => object.dt_txt.indexOf(`${year}-${month}-${day}`) !== -1);
                        let avgTemp = cutArr.map(item => parseFloat(item.main.temp)).reduce((total, num) => total + num) / cutArr.length;

                        //// Get all icons of weather for 1 day
                        let iconArr = cutArr.map(item => item.weather[0].icon);
                        //// Find the icon that appears most frequently
                        let icon = '';
                        let freq = 1;
                        let distinctIconArr = [...new Set(iconArr)];
                        let iconFreq = distinctIconArr.map(icon => [icon, iconArr.filter(el => el === icon).length]);
                        iconFreq.forEach(array => {
                            if (array[1] >= freq) {
                                freq = array[1];
                                icon = array[0];
                            }
                        })
                        document.querySelectorAll('.forecast .icon')[i].style.backgroundImage = `url("https://openweathermap.org/img/wn/${icon}@2x.png")`;

                        ////Display in each box in html
                        document.querySelectorAll('.forecast .date')[i].innerHTML = `${day}/${month}`;
                        document.querySelectorAll('.forecast .forecastTemp')[i].innerHTML = Math.round(avgTemp);
                    }
                })
        })
        .catch(err => console.log(err))
})