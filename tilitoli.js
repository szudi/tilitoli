const res = 5; //square --> Kell-e? 
const tiles = document.querySelectorAll('.tile');
const tile_board = document.querySelector('#tiles');
const hud = document.querySelector('#hud');
const hud_steps = document.querySelector('#steps span');
const hud_time = document.querySelector('#time span');
const goodjob = document.querySelector('#goodjob');
const anim = document.querySelector('#anim');
const diffs = document.querySelectorAll('#diff input');
let map = Array(res * res).fill().map((n, i) => n = i);
const check = [...map];
let drag, game = false;
let col, row, dir, xorigin, yorigin, steps, time;
let animdur = 300;

function drawtiles() {
    let c = 0;
    for (let y = 1; y < res + 1; y++) {
        for (let x = 1; x < res + 1; x++) {
            //közepe:
            tiles[x + (y * (res + 2))].setAttribute('id', 'tile-' + map[c]);
            c++;
        }
        //overflow:
        tiles[y].setAttribute('id', 'tile-' + map[(y - 1) + (res * 4)]);
        tiles[y + ((res + 1) * (res + 2))].setAttribute('id', 'tile-' + map[y - 1]);
        tiles[y * (res + 2)].setAttribute('id', 'tile-' + map[(y * res) - 1]);
        tiles[y * (res + 2) + (res + 1)].setAttribute('id', 'tile-' + map[(y - 1) * res]);
    }

    //drawhud:
    hud_steps.innerHTML = steps;
} //drawtiles()

function inctime() {
    if (game) {
        time++;
        hud_time.innerHTML = (Math.floor(time / 60)).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0');
        setTimeout(() => { requestAnimationFrame(inctime); }, 1000);
    }
}


function removeclass() {
    tiles.forEach((t) => {
        t.className = "";
    });
    //check for win
    if (map.toString() == check.toString() && game === true) {
        game = false;
        goodjob.className = "show";
    }
}

goodjob.onclick = () => {
    shuffle.disabled = false;
    goodjob.className = "";
    hud.className = "";
}

function shift(dir, roc) {
    //dir: 0^ 1> 2ˇ 3<
    if (dir % 2 == 0) {
        let temp = map.filter((e, i) => i % 5 == roc);
        if (dir == 0) {
            temp.push(temp.shift()); //^
            for (let q = 0; q < 7; q++) { tiles[roc + 1 + (q * 7)].className = "up"; }
        } else {
            temp.unshift(temp.pop()); //ˇ
            for (let q = 0; q < 7; q++) { tiles[roc + 1 + (q * 7)].className = "down"; }
        }
        map = map.map(function (e, i) { return i % 5 == roc ? temp[(i - roc) / 5] : e });
    } else {
        let temp = map.slice(roc * 5, (roc * 5) + 5);
        if (dir == 1) {
            temp.unshift(temp.pop()); //-->
            for (let q = 0; q < 7; q++) { tiles[((roc + 1) * 7 + q)].className = "right"; }
        } else {
            temp.push(temp.shift()); //<--
            for (let q = 0; q < 7; q++) { tiles[((roc + 1) * 7 + q)].className = "left"; }
        }
        map.splice(roc * 5, 5, ...temp);
    }
    setTimeout(() => { requestAnimationFrame(removeclass); }, animdur);
}//shift

//init
drawtiles();

//swipe controll:
tiles.forEach((t, i) => {
    t.onpointerdown = (e) => {
        col = i % 7;
        row = Math.floor(i / 7);
        xorigin = e.clientX; yorigin = e.clientY;
        if (col > 0 && col < 6 && row > 0 && row < 6) {
            drag = true;
        }
        this.onpointerup = (e) => {
            if (drag) {
                drag = false;
                if (Math.abs(e.clientY - yorigin) > Math.abs(e.clientX - xorigin)) {
                    if (e.clientY - yorigin < -20) { shift(0, col - 1); } //^
                    if (e.clientY - yorigin > 20) { shift(2, col - 1); } //ˇ
                } else {
                    if (e.clientX - xorigin < -20) { shift(3, row - 1); } //<
                    if (e.clientX - xorigin > 20) { shift(1, row - 1); } //>
                }
                steps++;
                drawtiles();
            }
        }
    };
});//tiles.foreach

//Start game (shuffle = Auto ID object)
shuffle.onclick = (e) => {
    // map = Array(res*res).fill().map((a, i) => a = i).sort(() => Math.random() - 0.5);
    //rendes keverés kell, mert így lehet olyan, amit nem lehet kirakni... (?)
    if (game === false) {
        for (let q = 0; q < 666; q++) {
            shift(0 | Math.random() * 4, 0 | Math.random() * 5);
        }
    }
    shuffle.disabled = true;
    hud.className = "show";
    game = true;
    steps = 0;
    time = 0;
    inctime();
    drawtiles();
}

//controls
anim.onchange = (e) => {
    animdur = e.target.checked ? 300 : 0;
};
diffs.forEach((e) => {
    e.onchange = (e) => {
        tile_board.className = e.target.id;
    }
});