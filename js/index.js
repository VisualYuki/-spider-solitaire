document.addEventListener("DOMContentLoaded", function(event) {
  /*===================
    CARD SET CLASS
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
      return this.currentArray[this.currentArrayIndex];
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
      DECK CLASS
 =====================*/

  // Класс колода для раздачи карт по колонкам.
  class Deck {
    //Константы
    SET_NUM = 6; // количество карт в колоде для раздачи
    SET_CARD_NUM = 10; //количество карт при раздаче на все колонки

    cardDeckElement = document.getElementById("card-deck");

    //Параметры текущей колоды
    currentSetIndex = -1;
    cardSets = [];
    set;

    constructor(set) {
      this.set = set;
      //Заполняем наборы карт для распределения по колонкам. Всего 6 наборов
      for (let i = 0; i < this.SET_NUM; i++) {
        this.cardSets[i] = [];
        for (let j = 0; j < this.SET_CARD_NUM; j++) {
          this.cardSets[i][j] = set.getNextRandCard();
        }
      }

      this.fillDeckFull_OnBoard();
    }
    //Заполняет колоды полностью ( 6 карт)
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

      let element = document.createElement("li");
      element.className = "card shirt-img";
      element.style.right = `${this.currentSetIndex * 7}px`;
      element.style.zIndex = this.currentSetIndex;
      element.addEventListener("click", this.handOutCards);

      this.cardDeckElement.appendChild(element);
    }

    handOutCards() {}
  }

  class Column {
    constructor() {}
  }

  //Класс для текущего времени
  class Timer {
    timerElement = document.getElementById("timerElement");
    seconds = 0;
    minuts = 0;

    //Добавляем ноль, если число состояит из одной цирфы
    formatDateNumber(number) {
      if (number < 10) return "0" + number;
      else return number;
    }

    //! доделать.
    //Устанавливаем интервал для обновления времени
    startTimer() {
      setInterval(function() {
        this.seconds++;
        if (this.seconds < 60) {
          this.minuts++;
          this.seconds = 0;
        }
        this.timerElement.textContent =
          this.formatDateNumber(this.minuts) +
          ":" +
          formatDateNumber(this.seconds);
        this.minuts;
      }, 1000);
    }

    //Обнуляем время таймера
    setDefaultValue() {}
  }

  let cardSet = new CardSet();
  let deck = new Deck(cardSet);
  let timer = new Timer();
  timer.startTimer();
});
