document.addEventListener("DOMContentLoaded", function(event) {
  // класс для получения случайной карты из 104 карт.
  class cardSet {
    constructor() {
      this.cardDoubleArray = [];
      let cardImgIndex;
      const CARDNUM_IN_DECK = 52;
      this.DOUBLE_CARD_NUMBER = 104; // 52 * 2

      //Получаем массив изображений из 52 карт.
      for (let suit of ["clubs", "spades", "diamonds", "hearts"]) {
        for (let i = 2; i <= 14; i++) {
          if (i < 10) cardImgIndex = "0" + i;
          else cardImgIndex = i;

          this.cardDoubleArray[this.cardDoubleArray.length] = new Image().src =
            "../images/" + suit + "/clubs/" + cardImgIndex + ".png"; // названия карт идут от 02.png до 14.png
        }
      }

      // Дублируем массив из 52 карт до 104 карт.
      for (let i = 0; i < CARDNUM_IN_DECK; i++) {
        this.cardDoubleArray[i + 52] = this.cardDoubleArray[i];
      }

      this.shuffleCards(2);
    }

    //Перемешиваем карты в колоде
    shuffleCards(repeatNumber) {
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
      return this.cardDoubleArray.pop();
    }
  }

  set = new cardSet();
  console.log(set.getNextRandCard());
});
