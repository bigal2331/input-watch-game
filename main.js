const socket = io();
const showMaxInputBtn = document.querySelector("button");
const maxValuesDiv = document.querySelector('.show-max-values');
const currentInputDiv = document.querySelector('.current-input');

const inputFilter = (e) => {
    switch (e.key.toLowerCase()) {
        case 'arrowup':
            return e.key;
        case 'arrowdown':
            return e.key;
        case 'arrowright':
            return e.key;
        case 'arrowleft':
            return e.key;
        case 'a':
            return e.key;
        case 'b':
            return e.key;
        case 'x':
            return e.key;
        case 'y':
            return e.key;
        default:
            return;
    }
}
const emitKeyPress = (key) => {
    socket.emit('userInput', {
        key
    });
}
document.addEventListener('keydown', (e) => {
    let key = inputFilter(e);
    if (key) {
        emitKeyPress(key)
        currentInputDiv.innerHTML = key;
    } else {
        currentInputDiv.innerHTML = 'Please use one of the following keys: up, down, left, right, a, b, x, y';
    }
});

showMaxInputBtn.addEventListener('click', () => {

    socket.emit('getMaxValues');

});

socket.on('displayMaxValues', (data) => {
    maxValuesDiv.innerHTML = `Below are the recorded Max values: </br></br> [ ${data}] `;
})