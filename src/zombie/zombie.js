import { Spawn } from '../services/spawn';

/**
 * Spawn point coordinates
 * @type {Object}
 */
const spawn = new Spawn();

/**
 * Zombie
 * @class Zombie
 */
export class Zombie extends Phaser.Sprite {

  /**
   * @param  {Number} health Current health of the zombie
   * @param  {Number} maxHealth Maximum possible health for the zombie
   * @param  {Number} speed Walking speed for zombie
   * @property {Boolean} alerted Toggles whether the zombie moves toward the player
   */
  constructor ({ game = {}, health = 100, maxHealth = 100, speed = 10, player = {}, perception = 300 } = {}) {
    super(game, spawn.location.x, spawn.location.y, 'zombie');

    this.health = health;
    this.maxHealth = maxHealth;
    this.speed = speed;
    this.alerted = false;
    this.perception = perception;

    this.player = player;
    this.config = {
      scale: 0.4
    };

    this.render();
  }

  /**
   * Setup sprite body settings
   */
  bodySetup () {
    this.body.fixedRotation = true;
    this.body.damping = 0.2;
  }

  /**
   * Render on constructor instantiation
   */
  render () {
    this.game.add.existing(this);
    this.animations.add('shamble', [1, 2, 2], 2, true);
    this.scale.setTo(this.config.scale, this.config.scale);
    this.anchor.setTo(0.5, 0);
    this.game.layerManager.layers.get('enemyLayer').add(this);
    this.game.physics.p2.enable(this.game.layerManager.layers.get('enemyLayer'), false, true);
    this.bodySetup();
  }

  /**
   * Phaser's game loop
   */
  update () {
    this.setPatrol();
  }
  
  /**
   * Sets the partol behavior of a zombie
   */
  setPatrol () {
    if (Math.abs(this.x - this.player.x) < this.perception) {
      this.behaviorDuration = this.game.time.now;
      this.alerted = true;
    } 
    
    if (this.alerted) {
      if (this.x > this.player.x) {
        this.shamble({ direction: 'left', speedModifier: 30 });
      } else {
        this.shamble({ direction: 'right', speedModifier: 30 });
      }
    } else {
      if (!this.behaviorDuration || this.behaviorDuration <= this.game.time.now) {
        // Set a duration for a new behavior
        this.behaviorDuration = this.game.time.now + 5000;
        // Stand when 0, walk when 1
        this.behavior = Math.round(Math.random());
        // Walk left when 0, walk right when 1
        this.direction = Math.round(Math.random());
      }
      if (this.behaviorDuration > this.game.time.now) {
        if (this.behavior === 1) {
          if (this.direction === 0) {
            this.shamble({ direction: 'left', speedModifier: 15 });
          } else {
            this.shamble({ direction: 'right', speedModifier: 15 });
          }
        } else {
          this.animations.frame = 0;
        }
      }
    }
  }

  /**
   * Runs shamble animations
   * @param {String} direction Direction of animations
   * @param {Number} speedModifier Multiplier on zombie's default speed attribute
   */
  shamble ({ direction = 'left', speedModifier = 15 } = {}) {
    const velocity = direction === 'left' ? -speedModifier : speedModifier;
    const scale = direction === 'left' ? -this.config.scale : this.config.scale;
    this.animations.play('shamble');
    this.scale.x = scale;
    this.body.velocity.x = velocity;
  }

}
