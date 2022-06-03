document.addEventListener("DOMContentLoaded", () => {
    
    const timestamp = [1,2,4,7,11,16];
    const endText = [["와! 케이팝 고인물이시네요!","이 노래를 안다고??","오~ 좀 하네","운이 좋은거 아냐?","한번 더해도 이렇게 잘할까"],["나쁘지 않네","다음에는 한번에 맞추길!","이 노래는 한번에 맞춰야지","좀 하네ㅋ"],["실망이 크다","그래도 새로운 노래 하나 배워가네ㅎ","아 이 노래는 알 줄 알았는데","케이팝 초보시군요!"]];
    let tries = 1;
    let guesses = [];
    let gamePlaying = true;
    let jsonData;

    const main_container = document.querySelector('.main-container');
    const sub_container = document.querySelector('.sub-container');
    const guesse_box = document.querySelectorAll('.guess');
    const replay_button = document.querySelector("#replay");
    const share_button = document.querySelector("#share");
    const save_text = document.querySelector("#cpytxt");
    const play_Button = document.getElementById('play-music');
    const artist_input = document.getElementById('artist-input');
    const title_input = document.getElementById('title-input');
    const submit_button = document.getElementById('submit');
    const skip_button = document.getElementById('skip');
    const progress_bar = document.getElementById('progress-bar');
    const progress_bg = document.querySelectorAll('.progress-bg');

    let music;
    let widget;
    let musicPlaying = false;
    (async () => {
        const res = await fetch("./music_list.json");
        jsonData = await res.json();
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
        widget.bind(SC.Widget.Events.ERROR, function() {
            window.alert("음악 로딩 실패. 새로고침 하시오");
        });
    })();

    play_Button.addEventListener('click',() => {
        widget.setVolume(50);
        if (!gamePlaying) {
            if (musicPlaying) {
                widget.pause();
            } else {
                widget.seekTo(0);
                widget.play();
            }
        }
        else if (!musicPlaying) {
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
        if (!gamePlaying) {
            return;
        }
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
        if (!gamePlaying) {
            return;
        }
        guesses.push(["","",false,false]);
        updateRound();
    });

    function updateRound() {
        artist_input.value = "";
        title_input.value = "";

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
            updateActiveEl();
        }
    }

    function updateActiveEl() {
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

    function endGame(result) {
        artist_input.value = "";
        title_input.value = "";
        gamePlaying = false;
        main_container.classList.remove("show");
        main_container.classList.add("noshow");
        sub_container.classList.remove("noshow");
        sub_container.classList.add("show");
        const answerText = sub_container.querySelector("h3");
        const reactionText = sub_container.querySelector("#reaction");
        const histories = sub_container.querySelectorAll(".historyBox");
        answerText.textContent = "정답: " + music["artist"][0] + ", " + music["title"][0];
        if (result === "correct") {
            if (tries == 1) {
                reactionText.textContent = endText[0][Math.floor(Math.random()*endText[0].length)];
            }
            else {
                reactionText.textContent = endText[1][Math.floor(Math.random()*endText[1].length)];
            }
        }
        else {
            reactionText.textContent = endText[2][Math.floor(Math.random()*endText[2].length)];
        }
        for (let i = 0; i < 6; i++) {
            let color;
            if (i > guesses.length-1) {
                color = "var(--white)";
            } else {
                if (guesses[i][2] && guesses[i][3]) {
                    color = "var(--green)"
                }
                else if (!guesses[i][2] && !guesses[i][3]) {
                    if (guesses[i][0] == "") {
                        color = "var(--gray2)";
                    } else {
                        color = "var(--red)";
                    }
                }
                else {
                    color = "var(--yellow)";
                }
            }
            histories[i].style.backgroundColor = color;
        }
        widget.setVolume(50);
        widget.seekTo(0);
        widget.play();
        tries = 1;
    }

    replay_button.addEventListener('click', () => {
        widget.pause();
        const musicCount = jsonData.length;
        music = jsonData[Math.floor(Math.random() * musicCount)];
        widget.load(`https://api.soundcloud.com/tracks/${music["track_num"]}`);
        guesses = [];
        tries = 1;
        main_container.classList.remove("noshow");
        main_container.classList.add("show");
        sub_container.classList.remove("show");
        sub_container.classList.add("noshow");
        updateActiveEl();
        guesse_box.forEach((box) => {
            box.childNodes.forEach((el) => {
                el.textContent = null;
            });
        });
        gamePlaying = 1;
    });

    share_button.addEventListener('click', () => {
        let s = "🔊";
        for (let i = 0; i < 6; i++) {
            if (i > guesses.length-1) {
                s+= "⬜️";
            } else {
                if (guesses[i][2] && guesses[i][3]) {
                    s+= "🟩";
                }
                else if (!guesses[i][2] && !guesses[i][3]) {
                    if (guesses[i][0] == "") {
                        s+= "⬛️";
                    } else {
                        s+= "🟥";
                    }
                }
                else {
                    s+= "🟨";
                }
            }
        }
        let historyString = "KPOP 노래 맞추기:" + music["artist"] + ", " + music["title"] + "\n" + s + "\nhttps://linklingj.github.io/GuessTheKpop";
        navigator.clipboard.writeText(historyString);
        save_text.textContent = "클립보드 복사 완료!";
        setTimeout(() => {
            save_text.textContent = "";
        }, 1000);
    });

    function updateMusicPlayer() {
        let w = document.createElement("iframe");
        w.id = "soundcloud_widget";
        w.allow = "autoplay";
        w.src = src=`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${music["track_num"]}&color=%236ef028&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
        sub_container.appendChild(w);
    }
})