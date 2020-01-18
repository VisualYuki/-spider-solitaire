document.addEventListener("DOMContentLoaded", function(event) {
  /*===================
    CARD SET CLASS
 =====================*/

  // Класс для получения случайной карты из 104 без повторения.
  class cardSet {
    // Массивы содержащие по 14 карт каждой масти
    clubsImgArray = [];
    spadesImgArray = [];
    diamondsImgArray = [];
    heartsImgArray = [];

    // Массивы содержащие по 104 карты по 1-ой 2-ум и 4-мя мастям
    oneSuitArray = [];
    twoSuitArray = [];
    fourSuitArray = [];

    // CONSTS
    DOUBLE_CARD_NUMBER = 104; // количество карт для двух колод
    ONE_SUIT_CARD_NUM = 13; // количество карт с одной масти

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
            case "diamonds":
              this.heartsImgArray[
                this.heartsImgArray.length
              ] = `../images/cards/${suit}/${this.cardImgIndex}.png`;
              break;
          }
        }
      }

      this.createOneSuitArray();

      this.createTwoSuitArray();
    }

    addArrayElement(value, index, array) {
      array[index] = value;
    }

    //Заполняем массив из 104 карт колодой из одной масти
    createOneSuitArray() {
      for (let i = 0; i < this.ONE_SUIT_CARD_NUM; i++) {
        for (let j = 0; j < 8; j++) {
          this.addArrayElement(
            this.spadesImgArray[i],
            this.ONE_SUIT_CARD_NUM * j + i,
            this.oneSuitArray
          );
        }
      }
    }

    //Заполняем массив из 104 карт колодой из двух мастей
    createTwoSuitArray() {
      for (let i = 0; i < this.ONE_SUIT_CARD_NUM; i++) {
        for (let j = 0; j < 4; j++) {
          this.addArrayElement(
            this.spadesImgArray[i],
            this.ONE_SUIT_CARD_NUM * j + i,
            this.twoSuitArray
          );
        }
        for (let j = 0; j < 4; j++) {
          this.addArrayElement(
            this.diamondsImgArray[i],
            this.ONE_SUIT_CARD_NUM * j + i + 52,
            this.twoSuitArray
          );
        }
      }
    }

    //! доделать
    //Заполняем массив из 104 карт колодой из четырех мастей
    createFourSuitArray() {
      for (let i = 0; i < this.ONE_SUIT_CARD_NUM; i++) {
        for (let j = 0; j < 4; j++) {
          this.addArrayElement(
            this.spadesImgArray[i],
            this.ONE_SUIT_CARD_NUM * j + i,
            this.twoSuitArray
          );
        }
        for (let j = 0; j < 4; j++) {
          this.addArrayElement(
            this.diamondsImgArray[i],
            this.ONE_SUIT_CARD_NUM * j + i + 52,
            this.twoSuitArray
          );
        }
      }
    }

    //Перемешиваем карты в колоде
    shuffleCards(repeatNumber = 1) {
      if (repeatNumber < 1) repeatNumber = 1;

      for (let j = 1; j < repeatNumber; j++) {
        for (let i = 0; i < this.DOUBLE_CARD_NUMBER; i++) {
          let randCardIndex =
            Math.trunc(Math.random() * 1000) % this.DOUBLE_CARD_NUMBER;
          this.swapTwoCard(i, randCardIndex, this.cardDoubleArray);
        }
      }
    }

    //Свапаем две карты в массиве с текущими индексами
    swapTwoCard(indexA, indexB, array) {
      let timeCopy = array[indexA];
      array[indexA] = array[indexB];
      array[indexB] = timeCopy;
    }

    // Получаем следующую случайную карту
    getNextRandCard() {
      if (this.cardDoubleArray.length != 0) return this.cardDoubleArray.pop();
      else console.log("cardDoubleArray is empty to pop");
    }
  }

  /*===================
      DECK CLASS
 =====================*/

  // Класс колода для раздачи карт по колонкам.
  class Deck {
    SET_NUM = 6; // количество карт в колоде для раздачи
    SET_CARD_NUM = 10; //количество карт при раздаче на все колонки

    cardDeckElement = $("#card-deck");

    currentSetIndex = -1;
    cardSets = [];

    constructor() {
      //Заполняем наборы карт для распределения по колонкам.
      for (let i = 0; i < this.SET_NUM; i++) {
        this.cardSets[i] = [];
        for (let j = 0; j < this.SET_CARD_NUM; j++) {
          this.cardSets[i][j] = set.getNextRandCard();
        }
      }
      //this.pushSet();
      this.fillFullDeck();
    }

    fillFullDeck() {
      for (let i = 0; i < this.SET_NUM; i++) {
        this.pushSet();
      }
    }

    popSet() {}

    // Добавляем элемент карта к колоде
    pushSet() {
      this.currentSetIndex++;

      let element = document.createElement("li");
      element.className = "card shirt-img";
      element.style.right = `${this.currentSetIndex * 7}px`;
      element.style.zIndex = this.currentSetIndex;
      element.addEventListener("click", this.handOutCards);

      $(this.cardDeckElement).append(element);
    }

    handOutCards() {}
  }

  set = new cardSet();
  //deck = new Deck();
  //console.log(set.getNextRandCard());
});

// let textImg = new Image();

// textImg.src = "../images/" + "cards/clubs/" + "03.png";

// document.getElementById("testId").append(textImg);
