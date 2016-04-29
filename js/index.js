var buttons = ["red", "yellow", "blue", "green"];
var on = false;
var pTurn = false;
var sOn = false;
var arr = [];
arr[0] = [];
arr[1] = [];
var click = 0;
var level = 1;
var sound1 = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
var sound2 = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
var sound3 = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
var sound4 = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";
var correct = "http://adrianpayne.me/game/assets/sounds/gem.mp3";
var fail = "http://adrianpayne.me/game/assets/sounds/pop2.mp3";

function setCode() {
  for (var i = 0; i < 20; i++) {
    arr[0].push(Math.round(Math.random() * 3));

  }
}

function getLevel() {
  return level;
}

function setLevel(mLevel) {
  level = mLevel;
}

function nextLevel() {
  level += 1;
  PlaySound(correct);
}

function incClick() {
  click += 1;
}

function setClick(number) {
  click = number;
}

function getClick() {
  return click;
}

function resetCode() {
  arr[0] = [];
  arr[1] = [];
  setLevel(1);
  setClick(0);
  setCode();
  aiMove();
}

function PlaySound(path) {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', path);
  audioElement.play();
}

function blink(bSpeed, bTimes, div) {

  for (var i = 0; i < bTimes; i++) {
    div.fadeOut(bSpeed).fadeIn(bSpeed);
  }

  if (div[0] == $(".red")[0]) {

    arr[1].push(0);
    PlaySound(sound1);

  } else if (div[0] == $(".yellow")[0]) {

    arr[1].push(1);
    PlaySound(sound2);

  } else if (div[0] == $(".blue")[0]) {

    arr[1].push(2);
    PlaySound(sound3);

  } else if (div[0] == $(".green")[0]) {

    arr[1].push(3);
    PlaySound(sound4);

  }
}

function checkForWin() {

  if (arr[1][getClick()] == arr[0][getClick()]) {

    display("correct!");

    incClick();

    if (getClick() == getLevel()) {
      setTurner(false);
      display("Level Up!");

      if (getLevel() == 20) {
        setTimeout(function() {

          var playAgain;
          playAgain = confirm("You Won Great Job! Want to play again?")
          if (playAgain) {
            resetCode();
            on = true;
            $("#player").html("The current level is: 1");
          }

        }, 600);
      } else {

        nextLevel();
        setTimeout(function() {
          display("Simon Says")
          aiMove();
          arr[1] = [];
          setClick(0);

        }, 2000);
      }
    }

  } else {
    display("No try again");
    PlaySound(fail);
    setTurner(false);
    if (sOn) {

      display("starting over");
      setTimeout(function() {
        $("#player").html("The current level is: 1");
        resetCode();
      }, 2000);

    } else {
      setTimeout(function() {
        display("Simon said")
        aiMove();
        arr[1] = [];
        setClick(0);
      }, 2000);
    }
  }
}

function setTurner(bool) {
  pTurn = bool;
}

function getTurn() {
  return pTurn;
}

function display(string) {
  $("#display").html(string);
}

function simonSays(bSpeed, bTimes, div) {

  var color = buttons[div];

  for (var i = 0; i < bTimes; i++) {
    $("." + color).fadeOut(bSpeed).fadeIn(bSpeed);

    if (color == "red") {
      PlaySound(sound1);
    } else if (color == "yellow") {
      PlaySound(sound2);
    } else if (color == "blue") {
      PlaySound(sound3);
    } else if (color == "green") {
      PlaySound(sound4);
    }
  }
}

function playPattern(count, delay) {
  var next = 0;

  (function step() {

    if (count-- >= 1) {

      simonSays(400, 1, arr[0][next++]);
      setTimeout(step, delay);
    }
  })();
}

function aiMove() {

  setTurner(false);
  playPattern(getLevel(), 1000);
  var delay = getLevel() * 1000;
  setTimeout(function() {
    setTurner(true);

    $("#player").html("The current level is: " + getLevel());
  }, delay);

}

// public void main  // 
for (var color in buttons) {

  $("." + buttons[color]).click(function() {

    if (on && getTurn()) {

      blink(50, 1, $(this));
      checkForWin();

    }
  });
}

$("#on").click(function() {
  if (on == false) {
    on = true;
    $(this).html("On");
    $("#light").removeClass("off").addClass("on");
    display("Simon Says");
    $("#player").html("The current level is: 1");
    resetCode();
  } else {
    on = false;
    $(this).html("Off");
    display("Press on to play");
    $("#light").removeClass("on").addClass("off");

  }
});

$("#strict").click(function() {
  if (sOn == false) {
    sOn = true;
    $(this).html("Strict mode On");

  } else {
    sOn = false;
    $(this).html("Strict mode Off");

  }
});

$("#reset").click(function() {
  resetCode();
  $("#display").html("Resting");
  $("#player").html("The current level is: 1");
});