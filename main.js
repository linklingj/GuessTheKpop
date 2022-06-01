document.addEventListener("DOMContentLoaded", () => {
    
    const timestamp = [1,2,4,7,11,16];
    let tries = 1;
    let guesses = [];

    const main_container = document.querySelector('.main-container');
    const guesse_box = document.querySelectorAll('.guess');
    const play_Button = document.getElementById('play-music');
    const artist_input = document.getElementById('artist-input');
    const title_input = document.getElementById('title-input');
    const submit_button = document.getElementById('submit');
    const skip_button = document.getElementById('skip');
    const progress_bar = document.getElementById('progress-bar');
    const progress_bg = document.querySelectorAll('.progress-bg');

    let music;
    let widget;
    var musicPlaying = false;
    (async () => {
        const res = await fetch("./music_list.json");
        const jsonData = await res.json();
        const musicCount = jsonData.length;
        music = jsonData[Math.floor(Math.random() * musicCount)];
        updateMusicPlayer();
        widget = SC.Widget(document.getElementById('soundcloud_widget'));

        widget.bind(SC.Widget.Events.PLAY, function() {
            musicPlaying = true;
            play_Button.innerHTML = '<ion-icon name="pause-circle-outline"></ion-icon>';
        });
        widget.bind(SC.Widget.Events.PAUSE, function() {
            musicPlaying = false;
            play_Button.innerHTML = '<ion-icon name="play-circle-outline"></ion-icon>';
        });
    })();

    play_Button.addEventListener('click',() => {
        if (!musicPlaying) {
            widget.seekTo(0);
            widget.play();
            startTimer();
        }
    });

    let timer;
    let maxTime;
    function startTimer() {
        maxTime = timestamp[tries-1] * 10;
        time = 0;
        timer = setInterval(myTimer,100);
    }

    let time = 0;
    function myTimer() {
        time++;
        const width = (time * 100 / 160).toString() + '%';
        progress_bar.style.width = width;
        if (time >= maxTime) {
            window.clearInterval(timer);
            time = 0;
            progress_bar.style.width = 0;
            widget.pause();
        }
    }

    submit_button.addEventListener('click',() => {
        const artist_guess = artist_input.value;
        const title_guess = title_input.value;
        if (!artist_guess || !title_guess) {
            return;
        }
        const artist_ans = music["artist"].map(el => {
            return el.toLowerCase().replace(/\s+/g,'');
        });
        const title_ans = music["title"].map(el => {
            return el.toLowerCase().replace(/\s+/g,'');
        });

        let artist_correct = false;
        let title_correct = false;

        artist_correct = artist_ans.includes(artist_guess.toLowerCase().replace(/\s+/g,''));
        title_correct = title_ans.includes(title_guess.toLowerCase().replace(/\s+/g,''));
        guesses.push([artist_guess,title_guess,artist_correct,title_correct]);

        if (artist_correct && title_correct) {
            endGame("correct");
        } else {
            updateRound();
        }
    });

    skip_button.addEventListener('click',() => {
        guesses.push(["","",false,false]);
        updateRound();
    });

    function updateRound() {
        if (tries >= 6) {
            endGame("fail");
        }
        else {
            const artist_box = guesse_box[tries-1].querySelector('#artist');
            const state_a = guesse_box[tries-1].querySelector('._a');
            const title_box = guesse_box[tries-1].querySelector('#title');
            const state_t = guesse_box[tries-1].querySelector('._t');
            selectText(artist_box,guesses[guesses.length-1][0]);
            selectText(title_box,guesses[guesses.length-1][1]);
            state_a.textContent = selectEmoji(guesses[guesses.length-1][2]);
            state_t.textContent = selectEmoji(guesses[guesses.length-1][3]);
            function selectText(obj,t) {
                if (t === "") {
                    obj.textContent = "-";
                    obj.classList.add("skipped");
                } else {
                    obj.textContent = t;
                }
            }
            function selectEmoji(c) {
                if (c) {
                    return "✅";
                } else {
                    return "❌";
                }
            }
            tries++;
            guesse_box.forEach((el) => {
                if(el.id[1] == tries) {
                    el.classList.remove("inactive");
                    el.classList.add("active");
                } else {
                    el.classList.remove("active");
                    el.classList.add("inactive");
                }
            });
            progress_bg.forEach((el) => {
                if(el.id[2] > tries) {
                    el.classList.remove("active");
                    el.classList.add("inactive");
                } else {
                    el.classList.remove("inactive");
                    el.classList.add("active");
                }
            });
        }

        artist_input.value = "";
        title_input.value = "";
    }

    function endGame(result) {
        if (result === "correct") {
            console.log("correct");
        }
        else {
            console.log("wrong");
        }
        tries = 1;
    }

    function updateMusicPlayer() {
        let w = document.createElement("iframe");
        w.id = "soundcloud_widget";
        w.allow = "autoplay";
        w.src = src=`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${music["track_num"]}&color=%236ef028&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
        main_container.appendChild(w);
    }
})