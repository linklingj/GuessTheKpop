document.addEventListener("DOMContentLoaded", () => {
    
    const timestamp = [1,2,4,7,11,16];
    let tries = 1;

    const main_container = document.querySelector('.main-container');
    const play_Button = document.getElementById('play-music');

    let music;
    let widget;
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


    var musicPlaying = false;

    play_Button.addEventListener('click',() => {
        if (musicPlaying) {
            widget.pause();
        } else {
            widget.play();
        }
    });

    function updateMusicPlayer() {
        let w = document.createElement("iframe");
        w.id = "soundcloud_widget";
        w.allow = "autoplay";
        w.src = src=`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${music["track_num"]}&color=%236ef028&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
        main_container.appendChild(w);
    }
})