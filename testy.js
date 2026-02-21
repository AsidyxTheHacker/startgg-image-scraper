const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = "4f3ac3b27603ed696feaaf945c34178b";
let tournamentSlug;
let pageNumber = 1;
const container = document.getElementById('container')

fetch('./test.json')
    .then(res => res.json())
    .then(data => {
        tournamentSlug = data[0].slug;
    });

async function testy(slug) {

    await fetch(startggURL, {
        method: "POST",
        headers: {
            'content-type': "application/json",
            'Accept': "application/json",
            Authorization: 'Bearer ' + startggKey
        },
        body: JSON.stringify({
            query: 'query getTournamentData($tourneySlug:String!) { tournament(slug: $tourneySlug) { id name slug participants(query: {page: 1, perPage: 100}, isAdmin: true) { nodes { gamerTag user { id name images { type url } } } } } }',
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
                container.appendChild(imgUrl)
                imgUrl.appendChild(player);
                player.innerText = data.data.tournament.participants.nodes[i].gamerTag

                const account = data.data.tournament.participants.nodes[i]
                console.log(account)

                if (account.user === null) {
                    player.innerText = account.gamerTag
                } else {
                    switch (account.user.images.length) {
                        case 0: player.innerText = account.gamerTag; break;
                        case 1:
                            imgUrl.setAttribute('href', account.user.images[0].url);
                            imgUrl.setAttribute('target', "_blank");
                            break;
                        case 2:
                            imgUrl.setAttribute('href', account.user.images[0].url);
                            imgUrl.setAttribute('target', "_blank");
                            break;
                    }
                };
            };
        });

};

setTimeout(() => {
    testy(tournamentSlug);
}, 100);