import {GameManager} from "./gamemanager.js";
// import {logger} from "./utils.js";


const timeDelta = 100;

let g: GameManager = new GameManager();

document.body.addEventListener("keypress", function (e) {
    g.handleInput(String.fromCharCode(e.charCode));
});

document.body.addEventListener("click", function (e) {
    g.handleClick(e);
});

document.body.addEventListener("touchstart", function (e) {
    if (1 == e.touches.length) {
        g.handleClick(e);
    }
});

function mainFunc() {
    // alert("mainFunc");
    // docLog.innerHTML = docLog.innerHTML + ". ";
    g.showAllCards();
    // logger.log("mainFunc");
    // setTimeout(mainFunc, timeDelta);
}

setTimeout(mainFunc, timeDelta);
