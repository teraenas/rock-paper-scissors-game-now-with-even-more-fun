const SOUND_EFFECTS_VOLUME = 0.6;
const MUSIC_VOLUME = 0.1;
const PLAYER_LIVES = 3;

class Player {
  constructor() {
    this.choice = undefined;
    this.name = '';
    this.isHuman = undefined;
    this.lives = PLAYER_LIVES;
  }
}

class TitleScene {
  constructor(owner) {
    this.owner = owner;
    this.sceneContainer = document.querySelector('#title-scene');
    this.sceneSwitcher = this.sceneContainer.querySelector('#overlay');
  }

  show() {
    this.sceneContainer.style.display = 'flex';
  }

  hide() {
    this.sceneContainer.style.display = 'none';
  }
}

class MainMenuScene {
  constructor(owner) {
    this.owner = owner;
    this.sceneContainer = document.querySelector('#main-menu-scene');
    this.setPVPModeButton =
      this.sceneContainer.querySelector('#setPVPmode-button');
    this.setPVEModeButton =
      this.sceneContainer.querySelector('#setPVEmode-button');
  }

  show() {
    this.sceneContainer.style.display = 'flex';
  }

  hide() {
    this.sceneContainer.style.display = 'none';
  }
}

class SetNamesScene {
  constructor(owner) {
    this.owner = owner;
    this.sceneContainer = document.querySelector('#set-names-scene');
    this.sceneSwitcher =
      this.sceneContainer.querySelector('#start-game-button');
    this.backToMainMenuButton = this.sceneContainer.querySelector(
      '#set-names-back-to-main-menu-button'
    );
    this.player1NameInput = this.sceneContainer.querySelector(
      '#player1-name-input'
    );
    this.player2NameInput = this.sceneContainer.querySelector(
      '#player2-name-input'
    );
  }

  show() {
    this.sceneContainer.style.display = 'flex';
    this.setupInputs();
  }

  hide() {
    this.sceneContainer.style.display = 'none';
  }

  setupInputs() {
    if (this.player2NameInput.value === 'COMPUTER')
      this.player2NameInput.value = '';
    if (!this.owner.player2.isHuman) {
      this.player2NameInput.disabled = true;
      this.player2NameInput.value = 'COMPUTER';
    } else {
      this.player2NameInput.disabled = false;
    }
  }
}

class PlayScene {
  constructor(owner) {
    this.owner = owner;
    this.sceneContainer = document.querySelector('#play-scene');
    this.player1NameDisplay =
      this.sceneContainer.querySelector('#player1-name');
    this.player2NameDisplay =
      this.sceneContainer.querySelector('#player2-name');
    this.player1LivesDisplay =
      this.sceneContainer.querySelector('#player1-lives');
    this.player2LivesDisplay =
      this.sceneContainer.querySelector('#player2-lives');
    this.player1Hand = this.sceneContainer.querySelector('#player1-hand');
    this.player2Hand = this.sceneContainer.querySelector('#player2-hand');
    this.player2Controls =
      this.sceneContainer.querySelector('#player2-controls');
  }

  show() {
    this.sceneContainer.style.display = 'flex';
    this.player1Hand.style.backgroundPosition = '0px 0px';
    this.player2Hand.style.backgroundPosition = '0px 0px';
    this.displayPlayerNames();
    this.initLives();
    this.updateLives();
    this.displayControls();
  }

  hide() {
    this.sceneContainer.style.display = 'none';
  }

  displayPlayerNames() {
    this.player1NameDisplay.innerHTML = game.player1.name;
    this.player2NameDisplay.innerHTML = game.player2.name;
  }

  displayControls() {
    this.player2Controls.style.display = !this.owner.player2.isHuman
      ? 'none'
      : 'flex';
  }

  initLives() {
    while (this.player1LivesDisplay.hasChildNodes()) {
      this.player1LivesDisplay.removeChild(this.player1LivesDisplay.lastChild);
    }
    while (this.player2LivesDisplay.hasChildNodes()) {
      this.player2LivesDisplay.removeChild(this.player2LivesDisplay.lastChild);
    }
    for (let i = 1; i <= this.owner.player1.lives; i++) {
      const lifePoint = document.createElement('div');
      lifePoint.classList.add('life-point');
      this.player1LivesDisplay.appendChild(lifePoint);
    }
    for (let i = 1; i <= this.owner.player2.lives; i++) {
      const lifePoint = document.createElement('div');
      lifePoint.classList.add('life-point');
      this.player2LivesDisplay.appendChild(lifePoint);
    }
  }

  updateLives() {
    const player1Lives = [
      ...this.player1LivesDisplay.querySelectorAll('.life-point'),
    ];
    const player2Lives = [
      ...this.player2LivesDisplay.querySelectorAll('.life-point'),
    ];
    setTimeout(() => {
      [...player1Lives, ...player2Lives].forEach(life =>
        life.classList.remove('full')
      );
      for (let i = 0; i < this.owner.player1.lives; i++) {
        player1Lives[i].classList.add('full');
      }
      for (let i = 0; i < this.owner.player2.lives; i++) {
        player2Lives[i].classList.add('full');
      }
      if (
        this.owner.player1.lives === PLAYER_LIVES &&
        this.owner.player2.lives === PLAYER_LIVES
      ) {
        this.owner.playSound(this.owner.sounds.fillGlass);
      } else {
        this.owner.playSound(this.owner.sounds.swallow);
      }
    }, 750);
  }

  revealChoices() {
    this.player1Hand.style.animation = 'none';
    if (this.owner.player1.choice === this.owner.choices.rock) {
      this.player1Hand.style.backgroundPosition = '0px 0px';
    } else if (this.owner.player1.choice === this.owner.choices.paper) {
      this.player1Hand.style.backgroundPosition = '-400px 0px';
    } else {
      this.player1Hand.style.backgroundPosition = '-800px 0px';
    }
    this.player2Hand.style.animation = 'none';
    if (this.owner.player2.choice === this.owner.choices.rock) {
      this.player2Hand.style.backgroundPosition = '0px 0px';
    } else if (this.owner.player2.choice === this.owner.choices.paper) {
      this.player2Hand.style.backgroundPosition = '-400px 0px';
    } else {
      this.player2Hand.style.backgroundPosition = '-800px 0px';
    }
  }

  resetHands() {
    this.player1Hand.style.animation =
      'preparing 750ms infinite cubic-bezier(0.19, 1, 0.22, 1)';
    this.player1Hand.style.backgroundPosition = '0px 0px';
    this.player2Hand.style.animation =
      'preparing 750ms infinite cubic-bezier(0.19, 1, 0.22, 1)';
    this.player2Hand.style.backgroundPosition = '0px 0px';
  }
}

class ScoreScreenScene {
  constructor(owner) {
    this.owner = owner;
    this.sceneContainer = document.querySelector('#score-screen-scene');
    this.winnerMessage = this.sceneContainer.querySelector('#winner-message');
    this.playAgainButton =
      this.sceneContainer.querySelector('#play-again-button');
    this.backToMainMenuButton = this.sceneContainer.querySelector(
      '#back-to-main-menu-button'
    );
  }

  show() {
    this.sceneContainer.style.display = 'flex';
    this.setWinnerMessage();
    this.owner.playSound(this.owner.sounds.fall);
  }

  hide() {
    this.sceneContainer.style.display = 'none';
  }

  setWinnerMessage() {
    const loser =
      this.owner.winner === this.owner.player1
        ? this.owner.player2
        : this.owner.player1;
    this.winnerMessage.innerHTML = `<p><span>${loser.name}</span> is under the table!</p><p><span>${this.owner.winner.name}</span> wins the shotout!</p>`;
  }
}

class Game {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.isAudioOn = false;
    this.player1 = new Player();
    this.player1.isHuman = true;
    this.player2 = new Player();
    this.winner = undefined;
    this.scenes = {
      title: new TitleScene(this),
      mainMenu: new MainMenuScene(this),
      setNames: new SetNamesScene(this),
      play: new PlayScene(this),
      scoreScreen: new ScoreScreenScene(this),
    };
    this.sounds = this.loadSounds();
    this.setSoundsVolume(0, 0);
    this.init();
    this.initRules();
  }

  init() {
    Object.values(this.scenes).forEach(scene => scene.hide());
    this.currentScene = this.scenes.title;
    this.currentScene.show();
  }

  initRules() {
    this.choices = {
      rock: {
        choice: 'Rock',
      },
      paper: {
        choice: 'Paper',
      },
      scissors: {
        choice: 'Scissors',
      },
    };

    this.choices.rock.beats = this.choices.scissors;
    this.choices.scissors.beats = this.choices.paper;
    this.choices.paper.beats = this.choices.rock;
  }

  loadSounds() {
    const sounds = {
      theme: new Audio(),
      ambience: new Audio(),
      fillGlass: new Audio(),
      swallow: new Audio(),
      fall: new Audio(),
      click: new Audio(),
    };

    sounds.theme.src = './assets/sounds/theme.mp3';
    sounds.theme.loop = true;
    sounds.ambience.src = './assets/sounds/bar-ambience.mp3';
    sounds.ambience.loop = true;
    sounds.fillGlass.src = './assets/sounds/fill-glass.mp3';
    sounds.swallow.src = './assets/sounds/swallow.mp3';
    sounds.fall.src = './assets/sounds/fall.mp3';
    sounds.click.src = './assets/sounds/button-click.mp3';

    return sounds;
  }

  setSoundsVolume(sfxVolume, musicVolume) {
    Object.entries(this.sounds).forEach(([key, sound]) => {
      if (key === 'theme' || key === 'ambience') {
        sound.volume = musicVolume;
      } else {
        sound.volume = sfxVolume;
      }
    });
  }

  playSound = sound => {
    sound.currentTime = 0;
    sound.play();
  };

  changeScene(nextScene) {
    if (this.currentScene != nextScene) {
      this.currentScene.hide();
      if (nextScene === this.scenes.play) {
        this.playSound(this.sounds.ambience);
      } else {
        this.sounds.ambience.pause();
      }
      this.reset(nextScene);
      this.currentScene = nextScene;
      this.currentScene.show();
    }
  }

  roll() {
    return Object.values(this.choices)[Math.floor(Math.random() * 3)];
  }

  reset(toScene) {
    this.player1.choice = this.player2.choice = undefined;
    if (toScene !== this.scenes.scoreScreen) {
      this.player1.lives = this.player2.lives = PLAYER_LIVES;
      this.winner = undefined;
      if (toScene !== this.scenes.play) {
        this.player1.name = 'Player 1';
        this.player2.name = 'Player 2';
        if (toScene !== this.scenes.setNames) {
          this.player2.isHuman = undefined;
        }
      }
    }
  }
}

const game = new Game();

const sceneSwitchers = {
  titleSwitcher: {
    button: game.scenes.title.sceneSwitcher,
    nextScene: game.scenes.mainMenu,
  },

  setPVPModeButton: {
    button: game.scenes.mainMenu.setPVPModeButton,
    nextScene: game.scenes.setNames,
  },

  setPVEModeButton: {
    button: game.scenes.mainMenu.setPVEModeButton,
    nextScene: game.scenes.setNames,
  },

  setNamesSwitcher: {
    button: game.scenes.setNames.sceneSwitcher,
    nextScene: game.scenes.play,
  },

  setNamesBackToMainMenuSwitcher: {
    button: game.scenes.setNames.backToMainMenuButton,
    nextScene: game.scenes.mainMenu,
  },

  scoreScreenPlayAgainSwitcher: {
    button: game.scenes.scoreScreen.playAgainButton,
    nextScene: game.scenes.play,
  },

  scorescreenMainMenuSwitcher: {
    button: game.scenes.scoreScreen.backToMainMenuButton,
    nextScene: game.scenes.mainMenu,
  },
};

const controls = {
  player1Keys: {
    rock: 'q',
    paper: 'w',
    scissors: 'e',
  },

  player2Keys: {
    rock: 'i',
    paper: 'o',
    scissors: 'p',
  },
};

const checkWinner = () => {
  if (game.player1.choice && game.player2.choice) {
    game.scenes.play.revealChoices();
    if (game.player1.choice === game.player2.choice) {
      newRound();
    } else if (game.player1.choice.beats === game.player2.choice) {
      game.player2.lives--;
      game.scenes.play.updateLives();
      if (game.player2.lives === 0) {
        game.winner = game.player1;
        setTimeout(() => {
          game.changeScene(game.scenes.scoreScreen);
        }, 2000);
      } else {
        newRound();
      }
    } else {
      game.player1.lives--;
      game.scenes.play.updateLives();
      if (game.player1.lives === 0) {
        game.winner = game.player2;
        setTimeout(() => {
          game.changeScene(game.scenes.scoreScreen);
        }, 2000);
      } else {
        newRound();
      }
    }
  }
};

const handlePlayer1Inputs = e => {
  if (game.currentScene === game.scenes.play) {
    if (Object.values(controls.player1Keys).includes(e.key)) {
      game.player1.choice =
        game.choices[
          Object.entries(controls.player1Keys).find(
            choice => choice[1] === e.key
          )[0]
        ];
      removeEventListener('keydown', handlePlayer1Inputs);
      if (!game.player2.isHuman) {
        game.player2.choice = game.roll();
      }
      checkWinner();
    }
  }
};

const handlePlayer2Inputs = e => {
  if (game.currentScene === game.scenes.play) {
    if (Object.values(controls.player2Keys).includes(e.key)) {
      game.player2.choice =
        game.choices[
          Object.entries(controls.player2Keys).find(
            choice => choice[1] === e.key
          )[0]
        ];
      removeEventListener('keydown', handlePlayer2Inputs);
      checkWinner();
    }
  }
};

const newRound = () => {
  setTimeout(() => {
    game.player1.choice = game.player2.choice = undefined;
    game.scenes.play.resetHands();
    addEventListener('keydown', handlePlayer1Inputs);
    if (game.player2.isHuman) addEventListener('keydown', handlePlayer2Inputs);
  }, 1500);
};

const play = () => {
  Object.values(sceneSwitchers).forEach(sceneSwitcher => {
    sceneSwitcher.button.addEventListener('click', () => {
      switch (sceneSwitcher.button) {
        case sceneSwitchers.titleSwitcher.button:
          game.playSound(game.sounds.theme);
          break;
        case sceneSwitchers.setPVPModeButton.button:
          game.player2.isHuman = true;
          break;
        case sceneSwitchers.setPVEModeButton.button:
          game.player2.isHuman = false;
          break;
        case sceneSwitchers.setNamesSwitcher.button:
          game.player1.name = game.scenes.setNames.player1NameInput.value
            ? game.scenes.setNames.player1NameInput.value
            : 'Player 1';
          game.player2.name = game.scenes.setNames.player2NameInput.value
            ? game.scenes.setNames.player2NameInput.value
            : 'Player 2';
          newRound();
          break;
        case sceneSwitchers.scoreScreenPlayAgainSwitcher.button:
          game.changeScene(game.scenes.play);
          newRound();
          break;
        case sceneSwitchers.scorescreenMainMenuSwitcher.button:
          game.changeScene(game.scenes.mainMenu);
          break;
      }
      game.changeScene(sceneSwitcher.nextScene);
    });
  });
};

play();

const soundToggleButton = document.querySelector('#sound-toggle-button');
soundToggleButton.addEventListener('click', () => {
  game.isAudioOn = !game.isAudioOn;
  if (game.isAudioOn) {
    soundToggleButton.setAttribute('sound', 'on');
    game.setSoundsVolume(SOUND_EFFECTS_VOLUME, MUSIC_VOLUME);
  } else {
    soundToggleButton.removeAttribute('sound');
    game.setSoundsVolume(0, 0);
  }
});

const allButtons = [...document.querySelectorAll('button')];
allButtons.forEach(button => {
  if (button.getAttribute('id') != 'sound-toggle-button') {
    button.addEventListener('click', () => {
      game.playSound(game.sounds.click);
    });
  }
});
