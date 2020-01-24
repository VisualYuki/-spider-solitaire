document.addEventListener("DOMContentLoaded", function(event) {
  const WRAP_CARD_STEP = 10; // количество пикселей между картами в колонке

  /*===================
    CARD SET 
 =====================*/

  // Класс для получения случайной карты из 104 без повторения.
  class CardSet {
    // Массивы содержащие по 14 карт каждой масти
    clubsImgArray = [];
    spadesImgArray = [];
    diamondsImgArray = [];
    heartsImgArray = [];

    // Массивы содержащие по 104 карты по 1-ой 2-ум и 4-мя мастям
    oneSuitArray = [];
    twoSuitArray = [];
    fourSuitArray = [];
    currentArray = [];

    // CONSTS
    DOUBLE_CARD_NUMBER = 104; // количество карт для двух колод
    ONE_SUIT_CARD_NUM = 13; // количество карт с одной масти

    //Параметры для текущей колоды
    suitTotal = 1;
    currentArrayIndex = 0;

    constructor() {
      //Добавляем путь изображения в каждый массив 4-ех мастей
      for (let suit of ["clubs", "spades", "diamonds", "hearts"]) {
        for (let i = 2; i <= 14; i++) {
          if (i < 10) this.cardImgIndex = "0" + i;
          else this.cardImgIndex = i;

          switch (suit) {
            case "clubs":
              this.clubsImgArray[
                this.clubsImgArray.length
              ] = `../images/cards/${suit}/${this.cardImgIndex}.png`;
              break;
            case "spades":
              this.spadesImgArray[
                this.spadesImgArray.length
              ] = `../images/cards/${suit}/${this.cardImgIndex}.png`;
              break;
            case "diamonds":
              this.diamondsImgArray[
                this.diamondsImgArray.length
              ] = `../images/cards/${suit}/${this.cardImgIndex}.png`;
              break;
            case "hearts":
              this.heartsImgArray[
                this.heartsImgArray.length
              ] = `../images/cards/${suit}/${this.cardImgIndex}.png`;
              break;
          }
        }
      }

      this.createOneSuitArray();
      this.createTwoSuitArray();
      this.createFourSuitArray();
      this.setSuitTotal_In_Deck(1);
      this.shuffleCards(3);
    }

    //* Заполняем массив из 104 карт колодой из одной масти
    createOneSuitArray() {
      this.oneSuitArray = this.spadesImgArray
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray);
    }

    //* Заполняем массив из 104 карт колодой из двух мастей
    createTwoSuitArray() {
      this.twoSuitArray = this.spadesImgArray
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray)
        .concat(this.diamondsImgArray)
        .concat(this.diamondsImgArray)
        .concat(this.diamondsImgArray)
        .concat(this.diamondsImgArray);
    }

    //* Заполняем массив из 104 карт колодой из четырех мастей
    createFourSuitArray() {
      this.fourSuitArray = this.clubsImgArray
        .concat(this.clubsImgArray)
        .concat(this.diamondsImgArray)
        .concat(this.diamondsImgArray)
        .concat(this.heartsImgArray)
        .concat(this.heartsImgArray)
        .concat(this.spadesImgArray)
        .concat(this.spadesImgArray);
    }

    //* Устанавливаем количество мастей в колоде
    setSuitTotal_In_Deck(value = 1) {
      if (value == 1 || value == 2 || value == 4) {
        this.suitTotal = value;
        switch (this.suitTotal) {
          case 1:
            this.currentArray = this.oneSuitArray;
            break;
          case 2:
            this.currentArray = this.twoSuitArray;
            break;
          case 4:
            this.currentArray = this.fourSuitArray;
            break;
        }
      } else console.log("Неверное количество мастей в setSuitTotal()");
    }

    //* Получаем следующую случайную карту
    getNextRandCard() {
      if (this.currentArrayIndex == this.currentArray.length) {
        this.currentArrayIndex = 0;
        this.shuffleCards(2);
      }

      return this.currentArray[this.currentArrayIndex++];
    }

    //* Перемешиваем карты в текущей колоде
    shuffleCards(repeatNumber = 1) {
      if (repeatNumber < 1) repeatNumber = 1;
      this.currentArrayIndex = 0;
      for (let j = 1; j <= repeatNumber; j++) {
        for (let i = 0; i < this.DOUBLE_CARD_NUMBER; i++) {
          let randCardIndex =
            Math.trunc(Math.random() * 1000) % this.DOUBLE_CARD_NUMBER;
          this.swapTwoCard(i, randCardIndex, this.currentArray);
        }
      }
    }

    //* Свапаем две карты в массиве с текущими индексами
    swapTwoCard(indexA, indexB, array) {
      let timeCopy = array[indexA];
      array[indexA] = array[indexB];
      array[indexB] = timeCopy;
    }
  }

  /*===================
      DECK 
 =====================*/

  // Класс колода для раздачи карт по колонкам.
  class Deck {
    //Константы
    SET_NUM = 5; // количество карт в колоде для раздачи
    SET_CARD_NUM = 10; //количество карт при раздаче на все колонки

    cardDeckElement = document.getElementById("card-deck");

    //Параметры текущей колоды
    currentSetIndex = -1;
    cardSet = []; //двумерный массив в каждой строчке - карты для раздачи по колонкам

    constructor(set) {
      this.fillDeckFull_OnBoard();
    }

    //* Заполняем наборы карт для распределения по колонкам. Всего 6 наборов
    getCards() {
      for (let i = 0; i < this.SET_NUM; i++) {
        this.cardSet[i] = [];
        for (let j = 0; j < this.SET_CARD_NUM; j++) {
          this.cardSet[i][j] = cardSet.getNextRandCard();
        }
      }
    }

    // clearFullDeck__onBoard() {
    //   while (this.cardDeckElement.lastChild !== null) this.removeCard_OnBoard();
    // }

    //* Заполняет колоды полностью (6 карт)
    fillDeckFull_OnBoard() {
      while (this.cardDeckElement.children.length < this.SET_NUM) {
        this.addCard_OnBoard();
      }
    }

    //* Удаляет последную карту в колоде
    removeCard_OnBoard() {
      this.cardDeckElement.lastChild.remove();
    }

    //* Добавляем карту в колоду
    addCard_OnBoard() {
      this.currentSetIndex++;
      const element = createMyElement("li", "card shirt-img");

      element.style.right = `${this.currentSetIndex * WRAP_CARD_STEP}px`;
      element.style.zIndex = this.currentSetIndex;
      element.addEventListener("click", this.handOutCards);

      this.cardDeckElement.appendChild(element);
    }

    //* Раскидываем карты по колонкам в начале игры
    handOutDefaultCards(hideHeaderElem) {
      //! Найти максимум из колонок.

      let delay = 0;
      for (let i = 1; i <= 7; i++) {
        for (let column of [
          column1,
          column2,
          column3,
          column4,
          column5,
          column6,
          column7,
          column8,
          column9,
          column10
        ]) {
          if (i <= column.cardTotal) {
            delay += 80;
            setTimeout(this.moveCard, delay, column, i);
          }
        }
      }
    }

    //* Перемещаем карту в колонку
    moveCard(column, i) {
      //Задаем координаты карты в body относительно последней карты в колоде

      let element = column.getCardForMove(i);
      document.body.appendChild(element);

      //Задаем координты карты относительно ее колонки
      let rectNewElem = column.columnElement.getBoundingClientRect();
      let newLeft = rectNewElem.left;
      let newTop = rectNewElem.top + column.liCardArray.length * WRAP_CARD_STEP;

      let anime = element.animate(
        [
          {
            left: element.style.left,
            top: element.style.top
          },
          { left: newLeft + "px", top: newTop + "px" }
        ],
        {
          // duration: 200
          // fill: "forwards"
        }
      );
      anime.addEventListener("finish", function() {
        newTop = column.indexAnimation * WRAP_CARD_STEP + "px";
        element.style.top = newTop;
        element.style.left = "0";
        column.columnElement.appendChild(element);
      });
    }

    handOutCards() {}
  }

  /*===================
      COLUMN  
 =====================*/

  class Column {
    liCardArray = [];
    openedCardList = [];
    closedCardList = [];
    cardTotal = 0;

    columnElement; //ul
    left;
    indexAnimation = 0; // Индекс массива карт, если нужно произвести анимацию снова

    constructor(closedCardTotal, id) {
      //this.closedCardTotal = closedCardTotal;
      this.cardTotal = closedCardTotal + 1;
      this.columnElement = document.getElementById(
        "column" + id
      ).firstElementChild;
      this.left = this.columnElement.offsetLeft;
    }

    rightOrderCardList; //список карт, которые находятся в правильной порядке
    eventCard; //в колоде карта одна на которую накладывается событие click
    addEventOnCard() {
      let currentSuit = this.getSuit(),
        nextSuit = this.getSuit();

      let currentNumber = this.getCardNumber(),
        nextNumber = this.getCardNumber();

      for (let i = this.openedCardList.length - 1; i > 0; i++) {
        if (
          !this.compareCardOrder(
            currentSuit,
            nextSuit,
            currentNumber,
            nextNumber
          )
        ) {
          this.rightOrderCardList = this.openedCardList.slice(i);
          this.eventCard = this.openedCardList[i];
          this.idEventCard = this.eventCard.addEventListener(
            "click",
            this.moveEventCard
          );
        }
      }
    }

    moveEventCard = () => {
      document.addEventListener("move", this.onMousMove);
    };

    onMousMove = event => {
      // let xCursor =;
      // let yCursor = ;

      this.moveAt(event.clientX, event.clientY);
    };

    moveAt(clientX, clientY) {
      let offset = 0;
      this.rightOrderCardList.forEach(card => {});
    }

    compareCardOrder(currentSuit, nextSuit, currentNumber, nextNumber) {
      if (currentSuit == nextSuit && currentNumber++ == nextNumber) return true;
      else return false;
    }

    getSuit() {}

    getCardNumber() {}

    //* Меняем индекс
    restartColumn() {
      this.indexAnimation = 0;
    }

    //* Убрать карты с колонки на поле
    clearColumn(zeroArray = true) {
      if (zeroArray) this.liCardArray = [];
      while (this.columnElement.children.length > 0) {
        this.columnElement.lastChild.remove();
      }
      this.closedCardList = [];
      this.openedCardList = [];
    }

    //* Получить карту для перемещения из колоды в колонку
    getCardForMove() {
      if (this.indexAnimation == this.liCardArray.length)
        this.indexAnimation = 0;

      return this.liCardArray[this.indexAnimation++];
    }

    //* Получить карты для внутреннего массива
    getCards() {
      let cardDeckElement = document.getElementById("card-deck");
      let rectOldElem = cardDeckElement.lastElementChild.getBoundingClientRect();

      let oldLeft = rectOldElem.left;
      let oldTop = rectOldElem.top;
      let element;
      let cardImg;

      for (let i = 1; i <= this.cardTotal; i++) {
        cardImg = cardSet.getNextRandCard();

        element = createMyElement("li", "card shirt-img");
        element.style.left = `${oldLeft}px`;
        element.style.top = `${oldTop}px`;
        element.style.zIndex = this.liCardArray.length;
        element.style.position = "absolute";

        //Открываем карту, если она последняя в колонке
        if (i < this.cardTotal) {
          element.dataset.imgsrc = cardImg;
        } else if (i == this.cardTotal) {
          element.style.backgroundImage = `url(${cardImg})`;
        }

        this.liCardArray.push(element);
      }
      this.openedCardList.push(this.liCardArray[this.liCardArray.length - 1]);
    }
  }

  /*===================
      GAME
 =====================*/
  class Game {
    oneSuitButton = document.getElementById("one-suit-button");
    twoSuitButton = document.getElementById("two-suit-button");
    fourSuitButton = document.getElementById("four-suit-button");

    lastSuitButton = this.oneSuitButton;

    constructor() {
      this.lastSuitButton = document.getElementById("one-suit-button");

      this.initEvents();
      this.newGame();
    }

    //* Инициализируем события для кнопок
    initEvents() {
      let newGameButton = document.getElementById("new-game-button");
      newGameButton.addEventListener("click", this.newGame);

      let restartButton = document.getElementById("restart-button");
      restartButton.addEventListener("click", this.restart);

      this.oneSuitButton.addEventListener("click", this.setOneSuit);
      this.twoSuitButton.addEventListener("click", this.setTwoSuit);
      this.fourSuitButton.addEventListener("click", this.setFourSuit);

      let soundButton = document.querySelector(".header__sound");
      soundButton.addEventListener("click", this.sound);
    }

    //* Начинаем новую игру
    newGame = () => {
      this.showHiddenBlock();

      deck.fillDeckFull_OnBoard();
      deck.getCards();
      columnList.forEach(column => {
        column.clearColumn();
        column.getCards();
        column.addEventOnCard();
      });

      deck.handOutDefaultCards();
      time.restart();
    };

    //* Перезапускаем текущую игру
    restart = () => {
      this.showHiddenBlock();

      deck.fillDeckFull_OnBoard();
      columnList.forEach(column => {
        column.clearColumn(false);
        column.restartColumn();
        column.addEventOnCard();
      });
      deck.handOutDefaultCards();
      time.restart();
    };

    //* Открываем блок, который закрывает кнопки,
    //* чтобы не работали события мыши,
    //* когди идет анимация разадчи карт
    showHiddenBlock() {
      let hideHeaderElem = document.querySelector(".hide-header");
      hideHeaderElem.style.display = "block";
      setTimeout(() => {
        hideHeaderElem.style.display = "none";
      }, 6000);
    }

    //* Событие кнопки установки одной масти
    setOneSuit = () => {
      if (this.oneSuitButton != this.lastSuitButton) {
        cardSet.setSuitTotal_In_Deck(1);
        game.newGame();
        this.lastSuitButton.classList.remove("suit-button__checked");
        this.oneSuitButton.classList.add("suit-button__checked");
        this.lastSuitButton = this.oneSuitButton;
      }
    };

    //* Событие кнопки установки двух мастей
    setTwoSuit = () => {
      if (this.twoSuitButton != this.lastSuitButton) {
        cardSet.setSuitTotal_In_Deck(2);
        game.newGame();
        this.lastSuitButton.classList.remove("suit-button__checked");
        this.twoSuitButton.classList.add("suit-button__checked");
        this.lastSuitButton = this.twoSuitButton;
      }
    };

    //* Событие кнопки установки четырех мастей
    setFourSuit = () => {
      if (this.fourSuitButton != this.lastSuitButton) {
        cardSet.setSuitTotal_In_Deck(4);
        game.newGame();
        this.lastSuitButton.classList.remove("suit-button__checked");
        this.fourSuitButton.classList.add("suit-button__checked");
        this.lastSuitButton = this.fourSuitButton;
      }
    };

    hint() {}

    sound() {}
  }

  /*===================
    CREATE ELEMENT FUNCTION
 =====================*/
  //! ДОбавить свойства и параметры этой функции при вызове.
  function createMyElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  /*===================
      TIMER OBJECT
=====================*/

  //Объект для текущего времени игры
  const Timer = function() {
    this.id;
    this.timerElement = document.getElementById("timerElement");

    this.seconds = 0;
    this.minuts = 0;

    // Запустить таймер
    this.start = () => {
      this.id = setInterval(this.setIntervalFunction, 1000);
    };

    //Форматировать время
    this.formatDateNumber = number => {
      if (number < 10) return "0" + number;
      else return number;
    };

    // Функция для SetTimeOut
    this.setIntervalFunction = () => {
      this.seconds++;
      if (this.seconds == 60) {
        this.minuts++;
        this.seconds = 0;
      }

      this.timerElement.textContent =
        this.formatDateNumber(this.minuts) +
        ":" +
        this.formatDateNumber(this.seconds);
    };

    // Перезапустить таймер
    this.restart = () => {
      this.timerElement.textContent = "00:00";
      this.seconds = 0;
      this.minuts = 0;
    };
  };

  /*===================
      MAIN 
=====================*/

  let cardSet = new CardSet();

  let deck = new Deck(cardSet);

  let column1 = new Column(5, 1),
    column2 = new Column(5, 2),
    column3 = new Column(5, 3),
    column4 = new Column(5, 4),
    column5 = new Column(4, 5),
    column6 = new Column(4, 6),
    column7 = new Column(4, 7),
    column8 = new Column(4, 8),
    column9 = new Column(4, 9),
    column10 = new Column(4, 10);

  let columnList = [
    column1,
    column2,
    column3,
    column4,
    column5,
    column6,
    column7,
    column8,
    column9,
    column10
  ];

  let time = new Timer();
  let game;

  //Будет лагать анимация без паузы, так как прогружаются другие элементы.
  setTimeout(function() {
    game = new Game();

    time.start();
  }, 500);
});
