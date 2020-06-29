class UI {
    static processData () {
        let data = {
            city : {name: "Brussels"},
            list : [
                {
                    dt_txt : "2020-06-29 15:00:00",
                    main: {
                        humidity: 51,
                        temp: 18.46,
                        temp_max: 18.46,
                        temp_min: 14.27
                    },
                    weather: [{
                        icon: "03d"
                    }],
                    wind: {speed: 8.91}
                },
                {
                    dt_txt : "2020-06-29 18:00:00",
                    main: {
                        humidity: 51,
                        temp: 19.46,
                        temp_max: 19.46,
                        temp_min: 13.27
                    },
                    weather: [{
                        icon: "03d"
                    }],
                    wind: {speed: 9.91}
                },
                {
                    dt_txt : "2020-06-30 18:00:00",
                    main: {
                        humidity: 51,
                        temp: 16.59,
                        temp_max: 20.59,
                        temp_min: 11.03
                    },
                    weather: [{
                        icon: "03d"
                    }],
                    wind: {speed: 7.61}
                },
                {
                    dt_txt : "2020-07-01 18:00:00",
                    main: {
                        humidity: 51,
                        temp: 16.59,
                        temp_max: 18.59,
                        temp_min: 14.03
                    },
                    weather: [{
                        icon: "03d"
                    }],
                    wind: {speed: 7.61}
                },
                {
                    dt_txt : "2020-07-02 18:00:00",
                    main: {
                        humidity: 51,
                        temp: 16.59,
                        temp_max: 22.59,
                        temp_min: 18.03
                    },
                    weather: [{
                        icon: "03d"
                    }],
                    wind: {speed: 7.61}
                },
                {
                    dt_txt : "2020-07-03 18:00:00",
                    main: {
                        humidity: 51,
                        temp: 16.59,
                        temp_max: 24.59,
                        temp_min: 19.03
                    },
                    weather: [{
                        icon: "03d"
                    }],
                    wind: {speed: 7.61}
                },
                {
                    dt_txt : "2020-07-04 18:00:00",
                    main: {
                        humidity: 51,
                        temp: 16.59,
                        temp_max: 16.59,
                        temp_min: 16.03
                    },
                    weather: [{
                        icon: "03d"
                    }],
                    wind: {speed: 7.61}
                }
            ]
        }
        //// Display today
        let now = new Date();
        let options = {weekday:'long', year:'numeric', month: 'long', day:'numeric'};
        document.getElementById('dateTime').innerHTML = now.toLocaleDateString('en-EN', options);
        //// Display city name
        let city = 'Antwerp';
        document.getElementById('cityName').innerHTML = 'Antwerp';//data.city.name
        //// Accessing the array containing weather information
        let array = data.list;

        //// Display date/month in five day forecast boxes
        for (let i = 0; i < 6; i++) {
            let date = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i);
            let year = date.getFullYear();
            let month = (date.getMonth() < 10) ? `0${date.getMonth() +1}` : date.getMonth() +1;
            let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
            let searchDay = `${year}-${month}-${day}`;
            console.log(searchDay);
            let cutArr = array.filter(object => object.dt_txt.indexOf(searchDay) !== -1);
            let avgHighTemp = cutArr.map(item => item.main.temp_max).reduce((total,num) => total+num) / cutArr.length;
            let avgLowTemp = cutArr.map(item => item.main.temp_min).reduce((total,num) => total+num) / cutArr.length;

            console.log(cutArr, avgHighTemp, avgLowTemp);
            if (i===0) {
                document.querySelector('.todayHighTemp').innerHTML = Math.round(avgHighTemp);
                document.querySelector('.todayLowTemp').innerHTML = Math.round(avgLowTemp);
            } else {
                ////Display in each box in html
                document.querySelectorAll('.weatherFiveDays .date')[i-1].innerHTML = `${day}/${month}`;
                document.querySelectorAll('.highTemp')[i-1].innerHTML = Math.round(avgHighTemp);
                document.querySelectorAll('.lowTemp')[i-1].innerHTML = Math.round(avgLowTemp);
            }
        }



        //// Display current temperature, and temperature range, humidity and wind speed of today
        document.getElementById('currentTempNum').innerHTML = Math.round(array[0].main.temp);
        document.getElementById('humid').innerHTML = array[0].main.humidity;
        document.getElementById('windSpeed').innerHTML = Math.round(array[0].wind.speed);
    }

}



////Submit event
document.querySelector('#submit').addEventListener('click', (e)=>{
    e.preventDefault();

    ////Display weather infomation
    document.querySelector('.displayBox').style.display = 'block';

    ////Get data from API
    const apikey = '9a2ad67a0fa15d04ba82bf3d4d9b2b38';
    let country = 'be';
    let cityName = document.querySelector('#search').value;
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},${country}&appid=${apikey}&units=metric`;
    // fetch(url)
    //     .then(res => res.json())
    //     .then(data => console.log(data))
    //     .catch(err => console.log(err))
    UI.processData();
})

