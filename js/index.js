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

    //Заполняем массив из 104 карт колодой из одной масти
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

    //Заполняем массив из 104 карт колодой из двух мастей
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

    //Заполняем массив из 104 карт колодой из четырех мастей
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

    //Устанавливаем количество мастей в колоде
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

    // Получаем следующую случайную карту
    getNextRandCard() {
      if (this.currentArrayIndex == this.currentArray.lenght)
        this.currentArrayIndex = 0;
      return this.currentArray[this.currentArrayIndex++];
    }

    //Перемешиваем карты в текущей колоде
    shuffleCards(repeatNumber = 1) {
      if (repeatNumber < 1) repeatNumber = 1;
      this.currentArrayIndex = 0;
      for (let j = 1; j < repeatNumber; j++) {
        for (let i = 0; i < this.DOUBLE_CARD_NUMBER; i++) {
          let randCardIndex =
            Math.trunc(Math.random() * 1000) % this.DOUBLE_CARD_NUMBER;
          this.swapTwoCard(i, randCardIndex, this.currentArray);
        }
      }
    }

    //Свапаем две карты в массиве с текущими индексами
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
    cardSets = [];
    //set;

    constructor(set) {
      // this.set = set;

      //Заполняем наборы карт для распределения по колонкам. Всего 6 наборов
      for (let i = 0; i < this.SET_NUM; i++) {
        this.cardSets[i] = [];
        for (let j = 0; j < this.SET_CARD_NUM; j++) {
          this.cardSets[i][j] = set.getNextRandCard();
        }
      }

      this.fillDeckFull_OnBoard();
    }

    //Заполняет колоды полностью (6 карт)
    fillDeckFull_OnBoard() {
      for (let i = 0; i < this.SET_NUM; i++) {
        this.addCard_OnBoard();
      }
    }

    //Удаляет последную карту в колоде
    removeCard_OnBoard() {
      this.cardDeckElement.lastChild.remove();
    }

    // Добавляем карту в колоду
    addCard_OnBoard() {
      this.currentSetIndex++;
      const element = createMyElement("li", "card shirt-img");

      element.style.right = `${this.currentSetIndex * WRAP_CARD_STEP}px`;
      element.style.zIndex = this.currentSetIndex;
      element.addEventListener("click", this.handOutCards);

      this.cardDeckElement.appendChild(element);
    }

    // Раскидываем карты по колонкам в начале игры
    handOutDefaultCards() {
      //console.log(document.querySelector("header").getBoundingClientRect());
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

    //Перемещаем карту в колонку
    moveCard(column, i) {
      let cardImg = cardSet.getNextRandCard();
      let cardDeckElement = document.getElementById("card-deck");

      //Задаем координаты карты в body относительно последней карты в колодн
      let rectOldElem = cardDeckElement.lastElementChild.getBoundingClientRect();
      let oldLeft = rectOldElem.left;
      let oldTop = rectOldElem.top;
      let element = createMyElement("li", "card shirt-img");
      element.style.left = `${oldLeft}px`;
      element.style.top = `${oldTop}px`;
      element.style.zIndex = column.liCardArray.length;
      element.style.position = "absolute";
      document.body.appendChild(element);

      //Открываем карту, если она последняя в колонке
      if (i < column.cardTotal) {
        element.dataset.imgsrc = cardImg;
      } else if (i == column.cardTotal) {
        element.style.backgroundImage = `url(${cardImg})`;
      }

      //Задаем координты карты относительно ее колонки
      // let rectNewElem = column.columnElement.getBoundingClientRect();
      // let newLeft = rectNewElem.left;
      // let newTop = rectNewElem.top + column.liCardArray.length * WRAP_CARD_STEP;

      //! Сделать анимация перехода карты
      // $(element).animate(
      //   {
      //     left: newLeft + "px",
      //     top: newTop + "px"
      //   },
      //   500
      // );
      let newTop;
      //Устанавливаем позицию карты к колонке
      newTop = column.liCardArray.length * WRAP_CARD_STEP + "px";
      element.style.top = newTop;
      element.style.left = "0";
      column.columnElement.appendChild(element);
      column.liCardArray.push(element);
      // column.columnElement.appendChild(element);

      // $(element).animate(
      //   {
      //     left: "0",
      //     top: `${column.liCardArray.length * WRAP_CARD_STEP}px`
      //   },
      //   0
      // );

      // element.cssText = `top:${column.liCardArray.length *
      //   WRAP_CARD_STEP}px; left:0`;
      // element.style.top = `${column.liCardArray.length * WRAP_CARD_STEP}px`;
      // element.style.left = 0;
      // element.style.bottom = 0;
      // element.animate(
      //   {
      //     left: `${NewLeft}px`,
      //     top: `${NewTop + column.liCardArray.length * WRAP_CARD_STEP}px`,
      //     zIndex: column.cardTotal
      //   },
      //   500
      // );
    }

    handOutCards() {}
  }

  /*===================
      COLUMN  
 =====================*/
  class Column {
    liCardArray = [];
    cardTotal = 0;

    columnElement;
    left;

    constructor(closedCardTotal, id) {
      //this.closedCardTotal = closedCardTotal;
      this.cardTotal = closedCardTotal + 1;
      this.columnElement = document.getElementById(
        "column" + id
      ).firstElementChild;
      this.left = this.columnElement.offsetLeft;
    }
  }

  // MAIN

  let cardSet = new CardSet();

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
  let deck = new Deck(cardSet);
  deck.handOutDefaultCards();

  //let time = new Timer();

  //time.start();

  /*===================
      GAME
 =====================*/
  class Game {
    constructor() {}
  }
  /*===================
    CREATE ELEMENT FUNCTION
 =====================*/

  function createMyElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;

    // let cssText = "";
    // for (prop in props) {
    //   cssText += `${prop}:${props[prop]};`;
    // }

    // element.cssText = cssText;
    // if (event !== undefined)
    //   element.addEventListener(event["event"], event["handler"]);

    return element;
  }

  /*===================
        TIMER OBJECT
 =====================*/

  //Объект для текущего времени игры
  const Timer = function() {
    this.id;
    this.timerElement = document.getElementById("timerElement");

    // Запустить таймер
    this.start = () => {
      setTimeout(this.setTimeOutFunction, 1000, 0, 0);
    };

    //Форматировать время
    this.formatDateNumber = number => {
      if (number < 10) return "0" + number;
      else return number;
    };

    // Функция для SetTimeOut
    this.setTimeOutFunction = (minuts, seconds) => {
      seconds++;
      if (seconds == 60) {
        minuts++;
        seconds = 0;
      }

      this.timerElement.textContent =
        this.formatDateNumber(minuts) + ":" + this.formatDateNumber(seconds);
      this.id = setTimeout(this.setTimeOutFunction, 1000, minuts, seconds);
    };

    // Перезапустить таймер
    this.restart = () => {
      this.timerElement.textContent = "00:00";
      clearTimeout(this.id);
      this.id = setTimeout(this.setTimeOutFunction, 1000, 0, 0);
    };
  };
});
