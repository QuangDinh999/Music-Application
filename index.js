const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd')
const header = $('header h2')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const replayBtn = $('.btn-repeat')


const app = {
    isPlaying: false,
    isShuffle: false,
    isReplay: false,
    curentIndex: 0,
    playlist: [
        {
            name: 'On Time',
            singer: 'Metro Boomin, Jonh Legend',
            img: './asset/img/ontime.jpg',
            path: './asset/music/On_Time.mp3'
        },
        {
            name: '16',
            singer: 'Baby Keem',
            img: './asset/img/16.jpg',
            path: './asset/music/16.mp3'
        },
        {
            name: 'Get You (Feat. Kali Uchis)',
            singer: 'Daniel Ceasar, Kali Uchis',
            img: './asset/img/get_you.jpg',
            path: './asset/music/Get_You.mp3'
        },
        {
            name: 'Dilemma',
            singer: 'Nelly, Kelly Rowland',
            img: './asset/img/dilemma.jpg',
            path: './asset/music/Dilemma.mp3'
        },
        {
            name: 'Heather',
            singer: 'Conan Gray',
            img: './asset/img/heather.jpg',
            path: './asset/music/heather.mp3'
        },
        {
            name: 'La Dificil',
            singer: 'Bad Bunny',
            img: './asset/img/la_dificil.jpg',
            path: './asset/music/La_Dificil.mp3'
        },
        {
            name: 'Wet Dreamz',
            singer: 'J.Cole',
            img: './asset/img/wet_dreamz.jpg',
            path: './asset/music/Wet_Dreamz.mp3'
        },
        {
            name: 'Ojitos Lindos',
            singer: 'Bad Bunny, Bomba Estereo',
            img: './asset/img/ojitos_lindos.jpg',
            path: './asset/music/Ojitos_Lindos.mp3'
        },
    ],
    DefineProperties: function() {
        Object.defineProperty(this, "curentSong", {
            get: function() {
                return this.playlist[this.curentIndex]
            }  
        })
    },
    render: function(playlist) {
        const full = playlist.map(function(song, index) {
            return `<div class="song song-${index} ${index === app.curentIndex ? 'active' : ''}">
                        <div class="thumb" style="background-image: url('${song.img}')">
                        </div>
                        <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        });
        $('.playlist').innerHTML = full.join("");
    },
    
    Handlerevent: function() {
        //CD rotate and stop
        const cdAnimate = cd.animate([
            {transform: 'rotate(360deg)'},
            {opacity: 0.3},
            {opacity: 1},
            {}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause()


        // scroll top
        const CDwith = cd.offsetWidth;
        document.onscroll = function() {
            const ScrollTop = document.documentElement.scrollTop || window.scrollY
            const NewWidth = CDwith - ScrollTop
            cd.style.width = NewWidth > 0 ? NewWidth + 'px' : 0 + 'px'
            cd.style.opacity = NewWidth / CDwith
        }
        
        //play music
        playBtn.onclick = function() {
            if(app.isPlaying) {
                audio.pause()
            }else{
               audio.play()
            }

            audio.onplay = function(){
                app.isPlaying = true
                player.classList.add("playing")
                cdAnimate.play()
            }

            audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove("playing")
                cdAnimate.pause()
            }
        }

        //seek and curent time
        audio.ontimeupdate = function() {  
            const progressPercent = audio.currentTime / audio.duration * 100
            if(progressPercent) {
                progress.value = progressPercent
            } 
        }

        progress.onchange = function(e) {
            const currentPlay = e.target.value
            audio.currentTime = audio.duration /100 * currentPlay
        }
        
        // next Song
        HandleNextSong = function() {
            const preSong = $(`.song-${app.curentIndex}`)
            preSong.classList.remove("active")
            if(app.isReplay){
                audio.play()
            }else if(app.isShuffle){
                app.shuffleSong()
                audio.play()
            }else{
                app.nextSong()
                audio.play()
                if(player.classList.contains("playing") === false) {
                    player.classList.add("playing")
                }
            }
            const nextSong = $(`.song-${app.curentIndex}`)
            nextSong.classList.add("active")
        }
        replayBtn.onclick = function() {
            app.isReplay = !app.isReplay
            replayBtn.classList.toggle("active", app.isReplay) 
            // Auto next song
            console.log(app.isReplay)
            if(app.isReplay) {
                audio.onended = HandleNextSong
            }
        }
        //next song
        nextBtn.onclick = HandleNextSong
        //auto next song
        audio.onended = HandleNextSong
        //prev song
        prevBtn.onclick = function() {
            const preSong = $(`.song-${app.curentIndex}`)
            preSong.classList.remove("active")
            app.prevSong()
            audio.play()
            if(player.classList.contains("playing") === false ) {
                player.classList.add("playing")
            }
            const nextSong = $(`.song-${app.curentIndex}`)
            nextSong.classList.add("active")
        }

        randomBtn.onclick = function() {
            app.isShuffle = !app.isShuffle
            randomBtn.classList.toggle("active", app.isShuffle)
        }

        const pointSong = $(`.song-${app.curentIndex}`)

        
        
        
    },
    shuffleSong: function() {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * ((this.playlist.length -1) + 1))
        }while(randomIndex === this.curentIndex)
        this.curentIndex = randomIndex
        app.loadCurentSong()
    },
    nextSong: function() {
        this.curentIndex++
        if(this.curentIndex >= this.playlist.length) {
            this.curentIndex = 0
        }
        app.loadCurentSong()
    },
    prevSong: function() {
        if(this.curentIndex == 0) {
            this.curentIndex = this.playlist.length -1
        }else{
            this.curentIndex--
        }
        console.log(this.curentIndex)
        app.loadCurentSong()
    },
    loadCurentSong: function() {
        console.log(this.curentSong)
        cd.innerHTML = `<div class="cd-thumb" style="background-image: url('${this.curentSong.img}')">`
        header.innerText = this.curentSong.name + "\n" + this.curentSong.singer
        audio.src = this.curentSong.path
    },

    start: function() {
        this.Handlerevent();
        this.render(this.playlist);
        this.DefineProperties()
        this.loadCurentSong()
    }
}

app.start();