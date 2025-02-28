const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = "68c7472dcf94c69eaa84b69910f885be";
let tournamentSlug;
let pageNumber = 1;
const nameContainer = document.getElementById('name-container')
const noNameContainer = document.getElementById('no-name-container')

fetch('./test.json')
    .then(res => res.json())
    .then(data => {
        tournamentSlug = data[0].slug;
    });

async function search(slug) {
    await fetch(startggURL, {
        method: "POST",
        headers: {
            'content-type': "application/json",
            'Accept': "application/json",
            Authorization: 'Bearer ' + startggKey
        },
        body: JSON.stringify({
            query: 'query getTournamentData($tourneySlug:String!) { tournament(slug: $tourneySlug) { id name slug participants(query: {page: 1, perPage: 300}, isAdmin: true) { nodes { gamerTag user { id name images { type url } } } } } }',
            variables: {
                "tourneySlug": slug,
            }
        })
    }).then(res => res.json())
        .then(data => {
            let entrants = data.data.tournament.participants.nodes;
            console.log(entrants)

            for (let i = 0; i < entrants.length; i++) {
                let player = document.createElement('p');
                let imgUrl = document.createElement('a');
                let playerImg = document.createElement('img');
                imgUrl.appendChild(player);
                player.innerText = data.data.tournament.participants.nodes[i].gamerTag
                const account = data.data.tournament.participants.nodes[i];

                if (account.user === null) {
                    player.innerText = account.gamerTag
                    imgUrl.classList.add('no-image');
                } else {
                    switch (account.user.images.length) {
                        case 0:
                            player.innerText = account.gamerTag;
                            imgUrl.classList.add('no-image');
                            noNameContainer.appendChild(imgUrl);
                            break;
                        case 1:
                            nameContainer.appendChild(imgUrl)
                            imgUrl.appendChild(playerImg);
                            playerImg.setAttribute('src', account.user.images[0].url);
                            imgUrl.setAttribute('href', account.user.images[0].url);
                            imgUrl.classList.add('has-image');
                            imgUrl.setAttribute('target', "_blank");
                            break;
                        case 2:
                            nameContainer.appendChild(imgUrl);
                            imgUrl.appendChild(playerImg);
                            if (account.user.images[0].type === 'banner') {
                                imgUrl.setAttribute('href', account.user.images[1].url);
                                playerImg.setAttribute('src', account.user.images[1].url);
                            } else {
                                imgUrl.setAttribute('href', account.user.images[0].url);
                                playerImg.setAttribute('src', account.user.images[0].url);
                            }
                            imgUrl.classList.add('has-image');
                            imgUrl.setAttribute('target', "_blank");
                            break;
                    }
                };
            };
        });
};

let searchButton = document.getElementById('searchBtn');
searchButton.addEventListener('click', () => {
    tournamentSlug = document.getElementById('searchInput').value;
    nameContainer.innerHTML = '';
    noNameContainer.innerHTML = '';
    setTimeout(() => {
        search(tournamentSlug);
    }, 200);
})

setTimeout(() => {
    search(tournamentSlug);
}, 200);