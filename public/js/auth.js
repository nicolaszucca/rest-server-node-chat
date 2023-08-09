const form = document.querySelector('form');

const url = 'http://localhost:8080/api/auth/';

form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = {};

    for (let element of form.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(({ msg, token }) => {
            if (msg) { return console.error(msg) }
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(err => {
            console.error(err)
        })


})



function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.

    // const responsePayload = decodeJwtResponse(response.credential);
    const body = { id_token: response.credential };

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html'
        })
        .catch(console.warn);
}

const button = document.querySelector('#google-signout');
button.addEventListener('click', () => {
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
});