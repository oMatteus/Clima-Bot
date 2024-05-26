class WeatherForecast{
    constructor(nome){
        this.nome = nome;
        this.result = '';
        this.lat = '';
        this.lng = '';
        this.previsao = '';
        this.unit='°';
    };

    async geocoding(){

        try{
            const request = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidade.nome}&count=2&language=pt-br&format=json`);
    
            const json = await request.json();    
    
                // console.log(json);
                cidade.lat = json.results[0].latitude;
                cidade.lng = json.results[0].longitude;
    
                cidade.result = json.results[0].admin2 + ', ' + json.results[0].admin1 + ' - ' + json.results[0].country_code
    
    
                // console.log(cidade)
    
        }catch(e){
            console.log(e + 'deu ruim');
        }; 
    };

    async getForecast(){
        const request = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cidade.lat}&longitude=${cidade.lng}&current=temperature_2m,apparent_temperature,precipitation,rain,showers,weather_code,cloud_cover&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,precipitation_hours,precipitation_probability_max&timezone=America%2FSao_Paulo`);
    
        const json = await request.json();
    
        // console.log(json);
        cidade.previsao = json
    };

    weatherCodeVerify(id){

        const weatherCode = {
            0 : {
                text:'Céu limpo', 
                icon:'assets/img/icones/wi-day-sunny.svg', 
                bg:'assets/img/bg/ceu-limpo.jpg'},
            1 : {
                text:'Parcialmente limpo', 
                icon:'assets/img/icones/wi-day-cloudy.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            2 : {
                text:'Parcialmente nublado', 
                icon:'assets/img/icones/wi-day-cloudy-high.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            3 : {
                text:'Nublado', 
                icon:'assets/img/icones/wi-cloudy.svg'},
                bg:'assets/img/bg/ceu-limpo.jpg',
            45 : {
                text:'Névoa', 
                icon:'assets/img/icones/wi-fog.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            51 : {
                text:'Garoa Leve', 
                icon:'assets/img/icones/wi-raindrop.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            53 : {
                text:'Garoa Moderada',  
                icon:'assets/img/icones/wi-raindrops.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            55 : {
                text:'Garoa Intensa', 
                icon:'assets/img/icones/wi-rain.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            80 : {
                text:'Leves pancadas de chuva', 
                icon:'assets/img/icones/wi-showers.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            81 : {
                text:'Pancadas de chuva', 
                icon:'assets/img/icones/wi-rain-wind.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            82 : {
                text:'Pancadas de chuva intensa', 
                icon:'assets/img/icones/wi-night-thunderstorm.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            95 : {
                text:'Pancadas de chuva intensa', 
                icon:'assets/img/icones/wi-night-thunderstorm.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            96 : {
                text:'Pancadas de chuva intensa', 
                icon:'assets/img/icones/wi-night-thunderstorm.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
            99 : {
                text:'Pancadas de chuva intensa', 
                icon:'assets/img/icones/wi-night-thunderstorm.svg',
                bg:'assets/img/bg/ceu-limpo.jpg'},
                
        
                
        };

        if( weatherCode[id] === 'undefined') console.log('Invalid code');
        
        return weatherCode[id];
    };
};

const cidade = new WeatherForecast('Guarulhos')

async function start(){
    await cidade.geocoding();
    await cidade.getForecast();
    hideSkeleton();
    printCurrentForecast();
    printWeekForecast();
};
start()


function printCurrentForecast(){

    console.log(cidade);

    const elements = {
        title: document.querySelector('.title'),
        currentTitle: document.querySelector('.current-title'),
        currentTemperature: document.querySelector('.current-temperature'),
        currentTemperatureText: document.querySelector('.current-temperature-text'),
        currentIcon: document.querySelector('.icone-grande'),
    };

    const currentWeatherForecast = cidade.previsao.current;
    const currentWeatherCode = cidade.weatherCodeVerify(currentWeatherForecast.weather_code);

    console.log(currentWeatherForecast);

    elements.title.innerHTML += cidade.result;
    elements.currentIcon.setAttribute('src', currentWeatherCode.icon);
    elements.currentTemperatureText.innerHTML = currentWeatherCode.text;
    elements.currentTemperature.innerHTML += currentWeatherForecast.temperature_2m.toFixed(0) + cidade.unit;

    dynamicBG(currentWeatherCode);


    function dynamicBG(e){

        // const bg = document.querySelector()
        // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        // console.log(e);


    }




};

function printWeekForecast(){

    cidade.previsao.daily.temperature_2m_max.forEach((tempMax, index) => {
        if(!index) return;
        const maxTemp = document.querySelector(`#card${index} .max-line p`);
        maxTemp.innerHTML = tempMax.toFixed(0);
    });


    cidade.previsao.daily.temperature_2m_min.forEach((tempMin, index) => {
        if(!index) return;
        const minTemp = document.querySelector(`#card${index} .min-line p`);
        minTemp.innerHTML = tempMin.toFixed(0);
    });


    cidade.previsao.daily.weather_code.forEach((icon, index) => {
        if(!index) return;

        const card = document.querySelector(`#card${index} .card-icon`);
        const cardDescription = document.querySelector(`#card${index} .card-description`)

        const weekWeatherCode = cidade.weatherCodeVerify(icon);
        card.setAttribute('src', weekWeatherCode.icon);
        cardDescription.innerText = weekWeatherCode.text
    });

    cidade.previsao.daily.time.forEach((date, index) => {
        if(!index) return;

        const dayOfWeek = document.querySelector(`#card${index} .day-of-week`);

        week = {
            0 : 'Dom',
            1 : 'Seg',
            2 : 'Ter',
            3 : 'Qua',
            4 : 'Qui',
            5 : 'Sex',
            6 : 'Sab'
        };
        
        let day = new Date(date);
        day = day.getDay();

        console.log(week[day]);
        dayOfWeek.innerHTML = week[day];
    })   


}

function hideSkeleton(){
    console.log('aaaaaaaaaaaaa');
    const skeleton = document.querySelector('.skeleton');
    skeleton.style.display = 'none'
}

