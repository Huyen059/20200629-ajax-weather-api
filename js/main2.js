document.querySelector('.formCtn button').addEventListener('click', (e)=>{
    e.preventDefault();

    //// Make image height smaller
    document.querySelector('.imgAndInfoCtn .randomImg').style.height = '30vh';

    //// Display info and forecast
    document.querySelector('.imgAndInfoCtn .infoCtn').style.display = 'flex';
    document.querySelector('.forecast').style.display = 'block';

    let inputCountry = document.querySelector('#inputCountry').value.toLowerCase();
    let inputCity = document.querySelector('#inputCity').value.toLowerCase();

    //// Display random img of the city
    let imgUrl = `https://source.unsplash.com/800x800/?${inputCity},building`;
    document.querySelector('.imgAndInfoCtn .randomImg').style.background = `url("${imgUrl}") bottom`;

    //// Fetch the weather data using the input country and input city
    const apikey = '9a2ad67a0fa15d04ba82bf3d4d9b2b38';
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity},${inputCountry}&appid=${apikey}&units=metric`;
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

            //// Array to store data to make graph later
            let chartLabels = [], chartDataHighTemp = [], chartDataLowTemp = [];

            //// Display five day forecast including today
            for (let i = 0; i < 5; i++) {
                let date = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i);
                let year = date.getFullYear();
                let month = (date.getMonth() < 10) ? `0${date.getMonth() +1}` : date.getMonth() +1;
                let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
                let cutArr = array.filter(object => object.dt_txt.indexOf(`${year}-${month}-${day}`) !== -1);
                let avgTemp = cutArr.map(item => parseFloat(item.main.temp)).reduce((total, num) => total + num) / cutArr.length;
                let highestTemp = cutArr.map(item => parseFloat(item.main.temp_max)).sort((a,b) => a-b)[cutArr.length-1];
                let lowestTemp = cutArr.map(item => parseFloat(item.main.temp_min)).sort((a,b) => b-a)[cutArr.length-1];

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
                // document.querySelectorAll('.forecast .date')[i].innerHTML = `${day}/${month}`;
                let dayOfWeek = `${date.toLocaleDateString('en-EN', {weekday:'long'}).substring(0,3)}`;
                document.querySelectorAll('.forecast .date')[i].innerHTML = dayOfWeek;
                document.querySelectorAll('.forecast .forecastTemp')[i].innerHTML = Math.round(avgTemp);

                //// Add values to the arrays to make graph later
                //if (i>=1){
                    chartLabels.push(dayOfWeek);
                    chartDataHighTemp.push(highestTemp);
                    chartDataLowTemp.push(lowestTemp);
                //}
            }

            //// Draw graph
            let myChart = document.querySelector('.tempChart').getContext('2d');
            Chart.defaults.global.defaultFontSize = 16;
            Chart.defaults.global.elements.point.radius = 5;
            Chart.defaults.global.elements.point.hoverRadius = 7;
            Chart.defaults.global.elements.point.pointStyle = 'rect';
            let massPopChart = new Chart(myChart, {
                type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
                data:{
                    labels: chartLabels,
                    datasets:[
                        {
                            label:'Lowest temperature',
                            data:chartDataLowTemp,
                            borderColor:'blue',
                            pointBackgroundColor:'blue',
                            fill:false,
                            hoverBackgroundColor: '#ccc'
                        },
                        {
                            label:'Highest temperature',
                            data:chartDataHighTemp,
                            borderColor:'red',
                            pointBackgroundColor:'red',
                            fill:false,
                            hoverBackgroundColor: '#ccc'
                        }
                    ]
                },
                options:{
                    title:{
                        display:true,
                        text:'Temperature range in the next four days',
                        fontSize:25
                    },
                    scales:{
                        yAxes:[
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Temperature (\xB0C)'
                                }
                            }
                        ]
                    }
                }
            });
        })
})