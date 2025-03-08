const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = "68c7472dcf94c69eaa84b69910f885be";
let tournamentSlug;
let eventSlug;
let pageNumber = 1;
let eventId;
let resultContainer = document.getElementById('finalResults');
let resultsBtn = document.getElementById('searchResults');
let backgroundButton = document.getElementById("backgroundBtn");
let colorOne;
let colorTwo;

async function getEventId() {
    const finalSlug = `tournament/${tournamentSlug}/event/${eventSlug}`;

    await fetch(startggURL, {
        method: "POST",
        headers: {
            'content-type': "application/json",
            'Accept': "application/json",
            Authorization: 'Bearer ' + startggKey
        },
        body: JSON.stringify({
            query: "query EventQuery($slug:String) {event(slug: $slug) {id name}}",
            variables: {
                slug: finalSlug
            }
        })
    }).then(res => res.json())
        .then(data => {
            console.log(data.data.event)
            eventId = data.data.event.id;
        })
};

resultsBtn.addEventListener('click', async () => {
    resultContainer.innerHTML = 'Recent Results';
    tournamentSlug = document.getElementById('tournamentInput').value
    eventSlug = document.getElementById('eventInput').value
    await getEventId(), getRecentSets();
});

backgroundButton.addEventListener('click', () => {
    colorOne = document.getElementById('colorOne').value;
    colorTwo = document.getElementById('colorTwo').value;
    document.getElementById('finalResults').style.background = `linear-gradient(${colorOne}, ${colorTwo})`
});

async function getRecentSets() {

    await fetch(startggURL, {
        method: "POST",
        headers: {
            'content-type': "application/json",
            'Accept': "application/json",
            Authorization: 'Bearer ' + startggKey
        },
        body: JSON.stringify({
            query: "query getTournamentData( $tourneySlug: String! $eventId: EventFilter! $page: Int! ) { tournament(slug: $tourneySlug) { id name slug events(filter: $eventId) { name sets (page: $page, perPage: 5, sortType: RECENT, filters: {showByes: false, hideEmpty: true}) { nodes { slots (includeByes: false) { standing { entrant { participants { gamerTag } } stats { score { value } } } } } } } } }",
            variables: {
                "tourneySlug": tournamentSlug,
                "eventId": { "id": eventId },
                "page": 1
            }
        })
    }).then(res => res.json())
        .then(data => {
            let recentSets = data.data.tournament.events[0].sets.nodes;

            for (let i = 0; i < recentSets.length; i++) {
                let set = document.createElement('p');
                let playerOne = recentSets[i].slots[0].standing.entrant.participants[0].gamerTag;
                let playerTwo = recentSets[i].slots[1].standing.entrant.participants[0].gamerTag;
                let scoreOne = recentSets[i].slots[0].standing.stats.score.value;
                let scoreTwo = recentSets[i].slots[1].standing.stats.score.value;
                set.innerText = `${playerOne} ${scoreOne} VS ${scoreTwo} ${playerTwo}`;
                resultContainer.appendChild(set);
            }
            console.log(recentSets)
        })
};