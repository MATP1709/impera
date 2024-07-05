const MAX_VOTES = 30;
const songs = [
    "Deus Culpa", "Con Clavi Con Dio", "Ritual", "Elizabeth", 
    "Stand By Him", "Satan Prayer", "Death Knell", "Prime Mover", 
    "Genesis", "Here Comes the Sun", "Infestissumam", "Per Aspera ad Inferi", 
    "Secular Haze", "Jigolo Har Megiddo", "Ghuleh / Zombie Queen", "Year Zero", 
    "Body And Blood", "Idolatrine", "Depth of Satan’s Eyes", "Monstrance Clock", 
    "La Mantra Mori", "If You Have Ghost", "I’m a Marionette", "Crucified", 
    "Waiting for the Night", "Spirit", "From the Pinnacle to the Pit", "Cirice", 
    "Spöksonat", "He Is", "Mummy Dust", "Majesty", "Devil Church", "Absolution", 
    "Deus in Absentia", "Zenith", "Square Hammer", "Nocturnal Me", "I Believe", 
    "Missionary Man", "Bible", "Ashes", "Rats", "Faith", "See the Light", 
    "Miasma", "Dance Macabre", "Pro Memoria", "Witch Image", "Helvetesfönster", 
    "Life Eternal", "It’s a Sin", "Avalanche", "Kiss the Go-Goat", "Mary On A Cross", 
    "Imperium", "Kaisarion", "Spillways", "Call Me Little Sunshine", "Hunter’s Moon", 
    "Watcher in the Sky", "Dominion", "Twenties", "Darkness at the Heart of My Love", 
    "Griftwood", "Bite of Passage", "Respite on the Spitalfields", "See No Evil", 
    "Jesus He Knows Me", "Hanging Around", "Phantom of the Opera", "We Don´t need Another Hero", 
    "The Future Is A Foreign Land"
];
$(document).ready(function() {
    // Generar filas de canciones
    songs.forEach(song => {
        $('#song-list').append(`
            <tr>
                <td>${song}</td>
                <td>
                    <button class="vote-button" data-song="${song}">Votar</button>
                    <div class="vote-bar" data-song="${song}" style="display: none;">
                        <div class="vote-bar-fill"></div>
                        <span class="vote-bar-text"></span>
                    </div>
                </td>
            </tr>
        `);
    });

    const updateVoteBars = () => {
        const votes = localStorage.getItem('votes') ? JSON.parse(localStorage.getItem('votes')) : {};
        const totalVotes = Object.keys(votes).reduce((sum, song) => sum + votes[song], 0);

        // Calcular los porcentajes y almacenar las canciones con sus votos y porcentajes
        const songPercentages = Object.keys(votes).map(song => {
            const songVotes = votes[song] || 0;
            const percentage = totalVotes ? (songVotes / totalVotes) * 100 : 0;
            return { song, votes: songVotes, percentage };
        });

        // Ordenar las canciones por votos en orden descendente
        songPercentages.sort((a, b) => b.votes - a.votes);

        // Limpiar y volver a llenar la tabla con las canciones ordenadas
        $('#song-list').empty();
        songPercentages.forEach(({ song, votes, percentage }) => {
            $('#song-list').append(`
                <tr>
                    <td>${song}</td>
                    <td>
                        <button class="vote-button" data-song="${song}">Votar</button>
                        <div class="vote-bar" data-song="${song}" style="display: ${votes > 0 ? 'block' : 'none'};">
                            <div class="vote-bar-fill" style="width: ${percentage}%;"></div>
                            <span class="vote-bar-text">${percentage.toFixed(2)}%</span>
                        </div>
                    </td>
                </tr>
            `);
        });

        // Desactivar todos los botones si se alcanza el límite de votos
        if (totalVotes >= MAX_VOTES) {
            $('.vote-button').prop('disabled', true).hide();
            $('.vote-bar').show();
        } else {
            $('.vote-button').each(function() {
                const song = $(this).data('song');
                if (votes[song]) {
                    $(this).hide(); // Oculta el botón
                    const $voteBar = $('.vote-bar[data-song="' + song + '"]');
                    $voteBar.show(); // Muestra la barra de porcentaje
                }
            });
        }
    };

    const updateVoteButtons = () => {
        const votes = localStorage.getItem('votes') ? JSON.parse(localStorage.getItem('votes')) : {};
        const totalVotes = Object.keys(votes).reduce((sum, song) => sum + votes[song], 0);

        updateVoteBars();

        if (totalVotes >= MAX_VOTES) {
            $('.vote-button').prop('disabled', true).hide();
            $('.vote-bar').show();
        } else {
            $('.vote-button').each(function() {
                const song = $(this).data('song');
                if (votes[song]) {
                    $(this).hide(); // Oculta el botón
                    const $voteBar = $('.vote-bar[data-song="' + song + '"]');
                    $voteBar.show(); // Muestra la barra de porcentaje
                }
            });
        }
    };

    updateVoteButtons();

    $('.vote-button').click(function() {
        const votes = localStorage.getItem('votes') ? JSON.parse(localStorage.getItem('votes')) : {};
        const totalVotes = Object.keys(votes).reduce((sum, song) => sum + votes[song], 0);

        if (totalVotes >= MAX_VOTES) {
            return; // No hacer nada si ha alcanzado el límite de votos
        }

        const song = $(this).data('song');
        if (votes[song]) {
            return; // No hacer nada si ya ha votado por esta canción
        }

        // Registrar el voto en localStorage
        votes[song] = (votes[song] || 0) + 1;
        localStorage.setItem('votes', JSON.stringify(votes));

        // Desactivar botón después de votar y mostrar barra de porcentaje
        $(this).hide();
        const $voteBar = $('.vote-bar[data-song="' + song + '"]');
        $voteBar.show();

        // Calcular y mostrar barra de porcentaje
        updateVoteBars();

        // Desactivar todos los botones si se alcanza el límite de votos
        if (Object.keys(votes).reduce((sum, song) => sum + votes[song], 0) >= MAX_VOTES) {
            $('.vote-button').prop('disabled', true).hide();
            $('.vote-bar').show();
        }

        // Enviar voto al servidor (comentado para pruebas locales)
        /*
        fetch('https://api.github.com/repos/TU_USUARIO/TU_REPOSITORIO/actions/workflows/voto.yml/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': 'token TU_GITHUB_TOKEN',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                ref: 'main',
                inputs: {
                    song: song
                }
            })
        });
        */
    });
});
