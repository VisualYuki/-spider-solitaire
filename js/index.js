document.addEventListener("DOMContentLoaded", function(event) {
  const CARD_WRAP_STEP = 10; // количество пикселей между картами в колонке

  /*===================
      TIMER
=====================*/

  //Объект для текущего времени игры
  class Timer {
    timerElement = document.getElementById("timerElement");
    seconds = 0;
    minuts = 0;

    // Запустить таймер
    start = () => {
      setInterval(this.setIntervalFunction, 1000);
    };

    //Форматировать время
    formatDateNumber = number => {
      if (number < 10) return "0" + number;
      else return number;
    };

    // Функция для SetTimeOut
    setIntervalFunction = () => {
      this.seconds++;
      if (this.seconds == 60) {
        this.minuts++;
        this.seconds = 0;
      }

      timerElement.textContent =
        this.formatDateNumber(this.minuts) +
        ":" +
        this.formatDateNumber(this.seconds);
    };

    // Перезапустить таймер
    restart = () => {
      this.timerElement.textContent = "00:00";
      this.seconds = 0;
      this.minuts = 0;
    };
  }

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
      //Создаем
      let elem;
      for (let suit of ["clubs", "spades", "diamonds", "hearts"]) {
        for (let i = 1; i <= 13; i++) {
          if (i < 10) this.cardImgIndex = "0" + i;
          else this.cardImgIndex = i;

          elem = new cardElement(
            `../images/cards/${suit}/${this.cardImgIndex}.png`,
            suit,
            i
          );

          switch (suit) {
            case "clubs":
              this.clubsImgArray[this.clubsImgArray.length] = elem;
              break;
            case "spades":
              this.spadesImgArray[this.spadesImgArray.length] = elem;
              break;
            case "diamonds":
              this.diamondsImgArray[this.diamondsImgArray.length] = elem;
              break;
            case "hearts":
              this.heartsImgArray[this.heartsImgArray.length] = elem;
              break;
          }
        }
      }

      this.createOneSuitArray();
      this.setSuitTotal_In_Deck(1);
      this.shuffleCards(4);
    }

    //* Копируем массив из классов
    copyArray(array) {
      let newArray = [];
      array.forEach((item, index) => {
        newArray[index] = new cardElement(
          item.openedImageSource,
          item.suit,
          item.number
        );
      });
      return newArray;
    }

    //* Заполняем массив из 104 карт колодой из одной масти
    createOneSuitArray() {
      this.oneSuitArray = this.spadesImgArray
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray));
    }

    //* Заполняем массив из 104 карт колодой из двух мастей
    createTwoSuitArray() {
      this.twoSuitArray = this.spadesImgArray
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.diamondsImgArray))
        .concat(this.copyArray(this.diamondsImgArray))
        .concat(this.copyArray(this.diamondsImgArray))
        .concat(this.copyArray(this.diamondsImgArray));
    }

    //* Заполняем массив из 104 карт колодой из четырех мастей
    createFourSuitArray() {
      this.fourSuitArray = this.clubsImgArray
        .concat(this.copyArray(this.clubsImgArray))
        .concat(this.copyArray(this.diamondsImgArray))
        .concat(this.copyArray(this.diamondsImgArray))
        .concat(this.copyArray(this.heartsImgArray))
        .concat(this.copyArray(this.heartsImgArray))
        .concat(this.copyArray(this.spadesImgArray))
        .concat(this.copyArray(this.spadesImgArray));
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
            if (this.twoSuitArray.length == 0) this.createTwoSuitArray();
            this.currentArray = this.twoSuitArray;
            break;
          case 4:
            if (this.fourSuitArray.length == 0) this.createFourSuitArray();
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
        //console.log("Неверное количество мастей в setSuitTotal()");
      }
      //console.log("Количество взятых карт: " + (this.currentArrayIndex + 1));
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
    CARD_ELEMENT
 =====================*/

  //Класс, который содержит в себе карту со всеми ее данными
  class cardElement {
    element;
    suit;
    number;
    openedImageSource;
    closedImageSource = "../images/card-shirt.png";
    isOpened;

    constructor(openedImageSource, suit, number) {
      this.suit = suit;
      this.number = number;
      this.openedImageSource = openedImageSource;
      this.element = createMyElement("li", "card", { position: "absolute" });
      this.openCard();
    }

    openCard = () => {
      this.element.style.backgroundImage = `url(${this.openedImageSource})`;
      this.isOpened = true;
    };

    closeCard = () => {
      this.element.style.backgroundImage = `url(${this.closedImageSource})`;
      this.isOpened = false;
    };
  }

  /*======================
    FUNCTIONS 
 ========================*/

  function createMyElement(tag, className, props) {
    const element = document.createElement(tag);
    element.className = className;

    for (let prop in props) {
      element.style[prop] = props[prop];
    }

    return element;
  }

  /*===================
      DECK 
 =====================*/

  // Класс колода для раздачи карт по колонкам.
  class Deck {
    //Константы
    DEFAULT_CARD_NUM = 5; // количество карт в колоде
    COLUMN_TOTAL = 10; //количество карт при раздаче на все колонки

    cardDeckElement = document.getElementById("card-deck");
    lastEventElem;

    //Параметры текущей колоды
    curCardTotal = 0;
    listIndex = 0;
    startCardSet = []; //двумерный массив в каждой строчке - карты для раздачи по колонкам

    constructor() {
      this.fillDeckFull_OnBoard();
    }

    //* Заполняем наборы карт для распределения по колонкам. Всего 6 наборов
    getCards() {
      let card;
      for (let i = 0; i < this.DEFAULT_CARD_NUM; i++) {
        this.startCardSet[i] = [];
        for (let j = 0; j < this.COLUMN_TOTAL; j++) {
          card = cardSet.getNextRandCard();
          card.openCard();
          this.startCardSet[i][j] = card;
        }
      }
      this.curCardTotal = this.DEFAULT_CARD_NUM;
    }

    //updateDefaultPrivate() {}

    //* Заполняет колоду полностью (6 карт)
    fillDeckFull_OnBoard() {
      while (this.cardDeckElement.children.length < this.DEFAULT_CARD_NUM) {
        this.addCard_OnBoard();
      }
      this.curCardTotal = this.DEFAULT_CARD_NUM;
      //this.cardDeckElement.children.length;

      this.moveEvent(this.getLastChild());

      // this.lastEventElem.onclick = null;
      // this.getLastChild().onclick = this.handOutCards;
      // this.lastEventElem = this.getLastChild();
    }

    //* Поменять событие на последную карту
    moveEvent(eventElement) {
      try {
        if (this.lastEventElem !== undefined) this.lastEventElem.onclick = null;
        //if (this.eventElement !== undefined)
        eventElement.onclick = this.handOutCards;
        this.lastEventElem = eventElement;
      } catch {}
    }

    //* Добавляем карту в колоду
    addCard_OnBoard() {
      const element = createMyElement("li", "card shirt-img");

      element.style.right = `${this.curCardTotal * CARD_WRAP_STEP}px`;
      element.style.zIndex = this.curCardTotal;
      this.cardDeckElement.appendChild(element);

      this.moveEvent(element);
      // this.lastEventElem.onclick = null;
      // element.onclick =  this.handOutCards;
      // this.lastEventElem = element;

      this.curCardTotal++;
    }
    delay = 0;
    handOutCards = () => {
      this.delay = 0;
      let localTotal = this.curCardTotal;
      columnList.forEach((column, index) => {
        this.delay += 100;
        setTimeout(
          this.moveCard,
          this.delay,
          column,
          this.startCardSet[localTotal - 1][index],
          column.getNextZIndex()
        );
      });
      //this.curCardTotal--;
      this.removeCard_OnBoard();
      showHiddenBlock(this.delay + 1000);
    };

    getLastChild() {
      if (this.cardDeckElement.lastElementChild != null)
        return this.cardDeckElement.lastElementChild;
      else return this.cardDeckElement;
    }

    //* Удаляет последную карту в колоде
    removeCard_OnBoard() {
      this.getLastChild().remove();
      this.moveEvent(this.getLastChild());

      this.curCardTotal--;
    }

    //* Раскидываем карты по колонкам в начале игры
    handOutDefaultCards() {
      this.delay = 0;
      for (let i = 1; i <= 6; i++) {
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
            this.delay += 80;
            setTimeout(
              this.moveCard,
              this.delay,
              column,
              column.defaulCardArray[i - 1],
              i
            );
          }
        }
      }
      showHiddenBlock(this.delay + 1000);
    }

    getPageLeft() {
      let rectElem = this.getLastChild().getBoundingClientRect();
      return rectElem.left;
    }

    getPageTop() {
      let rectElem = this.getLastChild().getBoundingClientRect();
      return rectElem.top;
    }

    //* Перемещаем карту в колонку
    moveCard = (column, cardObject, zIndex) => {
      document.body.appendChild(cardObject.element);
      let newLeft = column.getPageLeft() + "px";
      //let newTop = column.getPageTop() + (zIndex + 1) * CARD_WRAP_STEP + "px";
      let newTop = column.getPageTop() + column.getClientOffsetTop() + "px";
      //let newTop = column.getClientOffsetTop() +"px";
      cardObject.element.style.zIndex = zIndex;

      let anime = cardObject.element.animate(
        [
          {
            left: this.getPageLeft() + "px",
            top: this.getPageTop() + "px"
          },
          { left: newLeft, top: newTop }
        ],
        {
          duration: 400
          //fill: "both"
        }
      );

      anime.addEventListener("finish", function() {
        column.addCard__OnBoard(cardObject, zIndex);
      });
    };

    // clearFullDeck__onBoard() {
    //   while (this.cardDeckElement.lastChild !== null) this.removeCard_OnBoard();
    // }
  }

  /*===================
      COLUMN  
 =====================*/

  class Column {
    defaulCardArray = []; //массив в начале игры для рестарта
    openedCardList = []; //массив открытых карт
    closedCardList = []; //массив закрытых карт
    rightOrderCardList = []; //список карт, находящихся в правильном порядке

    eventCard; //в колоде карта одна, на которую накладывается событие click

    cardTotal = 0;
    columnElement; //Элемент в котором лежат все карты колонки

    constructor(cardTotal, id) {
      //this.closedCardTotal = closedCardTotal;
      this.cardTotal = cardTotal;
      this.columnElement = document.getElementById(
        "column" + id
      ).firstElementChild;
      //this.left = this.columnElement.offsetLeft;
    }

    //* Сдвиг от начала колонки для следующей карты для вставки
    getClientOffsetTop() {
      // if (cardObject.isOpened && this.openedCardList.length > 1)

      //     this.getClientOffsetTop() +
      //     (this.openedCardList.length - 1) * 10;
      if (this.openedCardList.length == 0) {
        return (
          (this.openedCardList.length + this.closedCardList.length) *
          CARD_WRAP_STEP
        );
      }
      if (this.openedCardList.length == 1) {
        return (
          (this.openedCardList.length + this.closedCardList.length) *
          CARD_WRAP_STEP
        );
      } else if (this.openedCardList.length > 1) {
        let top = this.columnElement.lastChild.offsetTop;
        return top + CARD_WRAP_STEP * 3;
      }
    }

    getNextZIndex() {
      return this.columnElement.children.length + 1;
    }

    getPageLeft() {
      let rectElem = this.columnElement.getBoundingClientRect();
      return rectElem.left;
    }

    getPageTop() {
      let rectElem = this.columnElement.getBoundingClientRect();
      return rectElem.top;
    }

    //* Добавить карту в колонку на поле
    addCard__OnBoard(cardObject, zIndex) {
      if (cardObject.isOpened) {
        this.openedCardList.push(cardObject);
      } else {
        this.closedCardList.push(cardObject);
      }

      // if (cardObject.isOpened && this.openedCardList.length > 1)
      //   cardObject.element.style.top =
      //     this.getClientOffsetTop() +
      //     (this.openedCardList.length - 1) * 10 +
      //     "px";
      //else
      cardObject.element.style.top = this.getClientOffsetTop() + "px";

      cardObject.element.style.left = 0;
      cardObject.element.style.zIndex = zIndex;
      this.columnElement.appendChild(cardObject.element);
    }

    //* Обновить массив по умолчанию при рестарте, так как могут быть открытые карты
    updatePrivateDefaultArray() {
      for (let i = 1; i < this.cardTotal; i++) {
        this.defaulCardArray[i - 1].closeCard();
      }

      this.defaulCardArray[this.cardTotal - 1].openCard();
    }

    //* Получить карты для внутреннего массива
    getCards() {
      let card;
      for (let i = 1; i < this.cardTotal; i++) {
        card = cardSet.getNextRandCard();
        card.closeCard();
        this.defaulCardArray[i - 1] = card;

        //this.addCard__OnBoard(card, i);
      }
      card = cardSet.getNextRandCard();
      card.openCard();
      this.defaulCardArray[this.cardTotal - 1] = card;
    }

    addEventOnCard() {
      if (this.openedCardList.length > 1) {
        for (let i = this.openedCardList.length - 1; i >= 0; i++) {
          let currentSuit = this.getSuit(this.openedCardList[i]),
            nextSuit = this.getSuit(this.openedCardList[i - 1]);

          let currentNumber = this.getCardNumber(this.openedCardList[i]),
            nextNumber = this.getCardNumber(this.openedCardList[i - 1]);

          if (
            !this.compareCardOrder(
              currentSuit,
              nextSuit,
              currentNumber,
              nextNumber
            )
          ) {
            this.rightOrderCardList.push(this.openedCardList.splice(i));
            this.eventCard = this.openedCardList[i];
            this.idEventCard = this.eventCard.addEventListener(
              "mousedown",
              this.moveEventCard
            );
          }
        }
      } else {
        this.rightOrderCardList.push(this.openedCardList[0]);
        this.eventCard = this.openedCardList[0];
        this.idEventCard = this.eventCard.addEventListener(
          "mousedown",
          this.moveEventCard
        );
      }
    }

    moveEventCard = () => {
      // document.addEventListener("move", this.onMousMove);
      //this.idMouseMove =
      document.body.onmousemove = this.onmouseMove;
      document.onmouseup = this.onmouseUp;
    };

    dragElem = document.querySelector(".drag-container");

    onmouseUp = event => {
      let found = false;
      document.body.onmousemove = null;
      columnList.forEach(item => {
        let left = item.columnElement.getBoundingClientRect().left;
        let right = item.columnElement.getBoundingClientRect().right;

        if (left <= event.clientX && event.clientX <= right) {
          let currentSuit = this.getSuit(this.eventCard),
            nextSuit = this.getSuit(
              item.openedCardList[item.openedCardList.length - 1]
            );

          let currentNumber = this.getCardNumber(this.eventCard),
            nextNumber = this.getCardNumber(
              item.openedCardList[item.openedCardList.length - 1]
            );

          let answer = this.compareCardOrder(
            currentSuit,
            nextSuit,
            currentNumber,
            nextNumber
          );

          if (answer) {
            found = true;
            item.addCards_FromOtherColumn(this.rightOrderCardList);
            this.rightOrderCardList = [];
            // this.rightOrderCardList =
          } else {
          }
        } else {
        }
      });
      if (found) {
      }
    };

    addCards_FromOtherColumn(array) {
      this.rightOrderCardList.concat(array);
    }

    onmouseMove = event => {
      this.dragElem.style.top = event.clientY + "px";
      this.dragElem.style.left = event.clientX - 50 + "px";

      this.rightOrderCardList.forEach(card => {
        card.style.top =
          CARD_WRAP_STEP * (this.dragElem.children.length - 1) + "px";
        this.dragElem.appendChild(card);
      });
    };

    //* Убрать карты с колонки на поле
    clearColumn_OnBoard(restartClear) {
      if (!restartClear) {
        // новая игра
        this.defaulCardArray = [];
        this.closedCardList = [];
        this.openedCardList = [];
      } else {
        // перезапуск игры
        this.closedCardList = [];
        this.openedCardList = [];
      }

      while (this.columnElement.children.length > 0) {
        this.columnElement.lastChild.remove();
      }
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
      deck.fillDeckFull_OnBoard();
      deck.getCards();
      //deck.update;
      columnList.forEach(column => {
        column.clearColumn_OnBoard(false);
        //column.newGame();
        column.getCards();
        //column.addEventOnCard();
      });

      deck.handOutDefaultCards();
      //showHiddenBlock();
      time.restart();
    };

    //* Перезапускаем текущую игру
    restart = () => {
      deck.fillDeckFull_OnBoard();
      columnList.forEach(column => {
        column.clearColumn_OnBoard(true);
        column.updatePrivateDefaultArray();
        //column.restartGame();

        //column.addEventOnCard();
      });
      deck.handOutDefaultCards();
      //showHiddenBlock();
      time.restart();
    };

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
      MAIN 
=====================*/
  //* Открываем блок, который закрывает кнопки,
  //* чтобы не работали события мыши,
  //* когди идет анимация разадчи карт
  function showHiddenBlock(delay) {
    let hideHeaderElem = document.querySelector(".hide-block");
    hideHeaderElem.style.display = "block";
    setTimeout(() => {
      hideHeaderElem.style.display = "none";
    }, delay);
  }

  let cardSet = new CardSet();

  let deck = new Deck();

  let column1 = new Column(6, 1),
    column2 = new Column(6, 2),
    column3 = new Column(6, 3),
    column4 = new Column(6, 4),
    column5 = new Column(5, 5),
    column6 = new Column(5, 6),
    column7 = new Column(5, 7),
    column8 = new Column(5, 8),
    column9 = new Column(5, 9),
    column10 = new Column(5, 10);

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

// compareCardOrder(currentSuit, nextSuit, currentNumber, nextNumber) {
//   if (currentSuit == nextSuit && ++currentNumber == nextNumber) return true;
//   else return false;
// }

// Получить карту для перемещения из колоды в колонку
// getCardForMove() {
//   if (this.indexAnimation == this.defaulCardArray.length)
//     this.indexAnimation = 0;

//   return this.defaulCardArray[this.indexAnimation++];
// }
