"use strict";

class World{

  constructor({character = new Player()} = {}){
    this.game = game;
    this.level = 1;
    this.gravity = 200;

    this.enemies = [];
    this.character = character;
  }

  setup(){
    this.setGravity(this.gravity);
    this.makeGround();

    this.character.render();
    this.character.healthTimer.start();

    this.addEnemy({speed: 1});
    this.addEnemy({speed: 2});
    this.addEnemy({speed: 1.5});

    let healthTest = new TestButtons(this.character);
    healthTest.drawHealthButtons();

  }

  setGravity(newGravity){
    this.gravity = newGravity;
    this.game.physics.arcade.gravity.y = newGravity;
  }

  makeGround(){
    let ground = this.game.add.bitmapData(game.world.width, 5);
    ground.ctx.fillStyle = '#360';
    ground.ctx.beginPath();
    ground.ctx.rect(0, 0, game.world.width, 5);
    ground.ctx.fill();

    this.sprite = this.game.add.sprite(0, game.world.height - 35, ground);

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.allowGravity = false;
    this.sprite.body.immovable = true;
  }

  addEnemy(params = {}){
    let newEnemy = new Zombie(params);
    this.enemies.push(newEnemy);
    newEnemy.render();
  }


  update(){
    for(let enemy of this.enemies){
      this.game.physics.arcade.collide(enemy.sprite, this.sprite, ()=>{}, null, this);
      this.game.physics.arcade.collide(enemy.sprite, this.character.sprite, ()=>{}, null, this);
      enemy.update();
      for(let other of this.enemies){
        this.game.physics.arcade.collide(enemy.sprite, other.sprite, ()=>{}, null, this);
      }
    }
    this.game.physics.arcade.collide(this.character.sprite, this.sprite, ()=>{}, null, this);

    this.character.update();
  }

}