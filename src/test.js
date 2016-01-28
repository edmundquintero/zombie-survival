"use strict";

class TestButtons {

  constructor(character){
      this.game = game;
      this.character = character || {};
  }

  /* Add button 'cheap constructo'r for test buttons in UI  */
  addButton(width, height, positionX, positionY, text, color, onClick){
    let button = this.game.add.bitmapData(width, height);
    button.ctx.fillStyle = '#FFF';
    button.ctx.beginPath();
    button.ctx.rect(0, 0, width, height);
    button.ctx.fill();

    let style = { font: "12px Arial", fill: color, align: "center" };
    let buttonText = game.make.text(0,0, text, style);

    button.draw(buttonText, 20, 5, 25, 20);

    let newButton = game.add.button(positionX, positionY, button, onClick, this);
  }

  drawHealthButtons(){

    /* +10 Health button */
    ( () => {

      this.addButton(75, 25, 10, 10, "+ 10", "#009111", actionOnClick);

      function actionOnClick(){
        this.character.addHealth(10);
      }

    })();

    /* -10 Health button */
    ( () => {

      this.addButton(75, 25, 95, 10, "- 10", "#AB1111", actionOnClick);

      function actionOnClick(){
        this.character.subtractHealth(10);
      }

    })();


  }

}