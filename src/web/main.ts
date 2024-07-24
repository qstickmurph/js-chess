const button = document.getElementById('increment-button');
const number = document.getElementById('number');

function onButtonClick() {
    if(!number){
        return;
    }

    number.innerHTML = (parseInt(number.innerHTML) + 1).toString();
}

if(button)
    button.addEventListener('click', onButtonClick);
