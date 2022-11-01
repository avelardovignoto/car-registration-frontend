const form = document.querySelector('#form');
const inputNameCar = document.querySelector('#car');
let ulCars = document.querySelector('#cars');
const btnReset = document.querySelector('#btn-reset');
const modalForm = document.querySelector('#modal-form');
const btnAdd = document.querySelector('#btn-add');

form.addEventListener('submit', e => {
    e.preventDefault();

    const car = Object.create(null);
    car.name = e.target.car.value;

    sendCar(car);
});

btnReset.addEventListener('click', () => {
    modalForm.style.display = 'none';
});

btnAdd.addEventListener('click', () => {
    modalForm.style.display = 'flex';
});

const sendCar = car => {
    const url = 'http://localhost:8080/api/v1/cars';
    const request = {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(car)
    }
    fetch(url, request)
    .then(response => handleResponse(response))
    .finally(() => modalForm.style.display = 'none');
}

const handleResponse = response => {
    if (response.status === 201) {
        inputNameCar.value = '';
        getCars();
    }
}

const getCars = () => {
    const url = 'http://localhost:8080/api/v1/cars';
    const request = {
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }
    fetch(url, request)
    .then(response => response.json())
    .then(data => showCars(data));
}

const showCars = cars => {
    ulCars.textContent = '';

    if (cars.length === 0) {
        ulCars.textContent = '- Nenhum Carro Cadastrado -';
    } else {
        cars.map(car => {
            const li = document.createElement('li');
            const divCarInfo = document.createElement('div');
            const divDelete = document.createElement('div');
            const span = document.createElement('span');

            divCarInfo.classList.add('car-info');
            span.classList.add('material-icons-outlined');

            divCarInfo.textContent = car.name;
            span.textContent = 'delete';

            span.setAttribute('onclick', `removeCar(${car.id})`);

            divDelete.append(span);
            li.append(divCarInfo, divDelete);
            ulCars.prepend(li);
        });
    }
}

const removeCar = id => {
    const url = `http://localhost:8080/api/v1/cars/${id}`;
    fetch(url, { method: 'DELETE' })
    .then(response => {
        if (response.status === 200) {
            getCars();
        } else {
            alert('Erro ao tentar remover carro');
        }
    });
}

getCars();