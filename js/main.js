document.querySelector('#submit').addEventListener('click', (e)=>{
    e.preventDefault();
    const apikey = '9a2ad67a0fa15d04ba82bf3d4d9b2b38';
    let country = 'be';
    let cityName = document.querySelector('#search').value;
    console.log(cityName);
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},${country}&appid=${apikey}`;
    console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
})