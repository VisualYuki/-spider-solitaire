document.addEventListener("DOMContentLoaded", function(event) {
  // класс для получения случайной карты из 104 без повторения.
  class cardSet {
    constructor() {
      this.cardDoubleArray = [];
      let cardImgIndex;
      this.DOUBLE_CARD_NUMBER = 104; // 52 * 2

      //Получаем массив изображений из 52 карт.
      for (let suit of ["clubs", "spades", "diamonds", "hearts"]) {
        for (let i = 2; i <= 14; i++) {
          if (i < 10) cardImgIndex = "0" + i;
          else cardImgIndex = i;

          this.cardDoubleArray[this.cardDoubleArray.length] = new Image();

          this.cardDoubleArray[this.cardDoubleArray.length - 1].src =
            "../images/" + "cards/" + suit + "/" + cardImgIndex + ".png"; // названия карт идут от 02.png до 14.png
        }
      }

      // Дублируем массив из 52 карт до 104 карт.
      this.cardDoubleArray.forEach((item, index) => {
        this.cardDoubleArray[index + 52] = this.cardDoubleArray[index];
      });

      this.shuffleCards(2);
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

  //! Установить переменные как свойства перед конструктором.

  // Класс колода для раздачи карт по колонкам.
  class Deck {
    count = 12;
    constructor() {
      this.SET_NUM = 6; // количество карт в колоде для раздачи
      this.SET_CARD_NUM = 10; //количество карт при раздаче на все колонки

      this.cardDeckElement = $("#card-deck");

      this.currentSetIndex = -1;
      this.cardSets = [];

      //Заполняем наборы карт для распределения по колонкам.
      for (let i = 0; i < this.SET_NUM; i++) {
        this.cardSets[i] = [];
        for (let j = 0; j < this.SET_CARD_NUM; j++) {
          this.cardSets[i][j] = set.getNextRandCard();
        }
      }
      // this.pushSet();
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
      $(element).on("click", handOutCards());

      $(this.cardDeckElement).append(element);
    }

    handOutCards() {}
  }

  set = new cardSet();
  deck = new Deck();
  console.log(set.getNextRandCard());
});
