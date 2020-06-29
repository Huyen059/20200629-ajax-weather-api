class UI {
    static processData (data) {
        //// Display today in long format
        let now = new Date();
        let options = {weekday:'long', year:'numeric', month: 'long', day:'numeric'};
        document.getElementById('dateTime').innerHTML = now.toLocaleDateString('en-EN', options);
        //// Display city name
        document.getElementById('cityName').innerHTML = data.city.name;
        //// Random img of the city
        let imgUrl = `https://source.unsplash.com/800x800/?${data.city.name},building`;
        document.querySelector('.cityImg').style.background = `url("${imgUrl}") bottom`;
        document.querySelector('.cityImg').style.backgroundSize = 'cover';
        //// Accessing the array containing weather information
        let array = data.list;
        //// Icon code
        let iconCode = array[0].weather[0].icon;
        let iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.querySelector('.todayIcon').innerHTML = `<img src="${iconURL}"/>`
        //// Display date/month in five day forecast boxes
        for (let i = 0; i < 6; i++) {
            let date = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i);
            let year = date.getFullYear();
            let month = (date.getMonth() < 10) ? `0${date.getMonth() +1}` : date.getMonth() +1;
            let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
            let searchDay = `${year}-${month}-${day}`;
            let cutArr = array.filter(object => object.dt_txt.indexOf(searchDay) !== -1);
            let highestTempArr = cutArr.map(item => parseFloat(item.main.temp_max)).sort((a,b) => a-b);
            let lowestTempArr = cutArr.map(item => parseFloat(item.main.temp_min)).sort((a,b) => b-a);
            let highestTemp = highestTempArr[cutArr.length-1];
            let lowestTemp = lowestTempArr[cutArr.length-1];

            if (i===0) {
                document.querySelector('.todayHighTemp').innerHTML = Math.round(highestTemp);
                document.querySelector('.todayLowTemp').innerHTML = Math.round(lowestTemp);
            } else {
                ////Display in each box in html
                document.querySelectorAll('.weatherFiveDays .date')[i-1].innerHTML = `${day}/${month}`;
                document.querySelectorAll('.highTemp')[i-1].innerHTML = Math.round(highestTemp);
                document.querySelectorAll('.lowTemp')[i-1].innerHTML = Math.round(lowestTemp);
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

    ////Display weather information box
    document.querySelector('.displayBox').style.display = 'block';

    ////Get data from API
    const apikey = '9a2ad67a0fa15d04ba82bf3d4d9b2b38';
    let country = 'be';
    let cityName = document.querySelector('#search').value;
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${country}&appid=${apikey}&units=metric`;
    fetch(url)
        .then(res => res.json())
        .then(data => UI.processData(data))
        .catch(err => console.log(err))
})

