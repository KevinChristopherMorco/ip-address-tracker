const ipInput = document.querySelector('.input__container > input')
const searchBtn = document.querySelector('.input__container > button')
const textDisplay = document.querySelectorAll('.display__main-text')
const map = L.map('map').setView([13, 122], 5)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.removeControl(map.zoomControl);

const errorMessage = () => {
    Swal.fire({
        title: "Whooops...",
        text: "Invalid IP Address, try another one!",
        icon: "error"
    });
    return
}

const fetchData = () => {
    let apiUrl
    if (ipInput.value === '') {
        apiUrl = 'https://ipapi.co/json/'
    } else {
        apiUrl = `https://ipapi.co/${ipInput.value}/json/`
    }

    fetch(apiUrl).then(response => response.json()).then(data => renderData(data)).catch(error => {
        errorMessage()
        return
    })
}

const renderData = (data) => {

    if (data.latitude === undefined && datalongitude === undefined) {
        return
    }

    const prop = [data.ip, [`${data.city}, ${data.region}, ${data.country_name}`], `UTC ${data.utc_offset}`, data.org]
    textDisplay.forEach((text, index) => {
        text.textContent = `${prop[index]}`
    })

    const container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
    //end

    map.setView([`${data.latitude}`, `${data.longitude}`], 17)
    L.marker([`${data.latitude}`, `${data.longitude}`]).addTo(map);
}

searchBtn.addEventListener('click', (e) => {
    const letter = /^[a-zA-Z\s]+$/;
    const checkIpV4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const checkIpV6 = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
    if (letter.test(ipInput.value)) {
        errorMessage()
        return
    }

    if((!checkIpV4.test(ipInput.value) || checkIpV6.test(ipInput.value))){
        errorMessage()
        return
    }
    fetchData()
})

window.addEventListener('load', (event) => {
    fetchData()
});





