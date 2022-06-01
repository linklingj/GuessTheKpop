document.addEventListener("DOMContentLoaded", () => {
    
    const timestamp = [1,2,4,7,11,16];
    let tries = 6;

    const main_container = document.querySelector('.main-container');
    const play_Button = document.getElementById('play-music');
    const progress_bar = document.getElementById('progress-bar');
    const progress_bg = document.querySelectorAll('.progress-bg');

    let music;
    let widget;
    let duration;
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
            widget.pause();
        }
    }

    function updateMusicPlayer() {
        let w = document.createElement("iframe");
        w.id = "soundcloud_widget";
        w.allow = "autoplay";
        w.src = src=`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${music["track_num"]}&color=%236ef028&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
        main_container.appendChild(w);
    }
})