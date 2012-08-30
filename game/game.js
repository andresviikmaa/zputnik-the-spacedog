//set main namespace
goog.provide('game');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

goog.require('lime.Sprite');
goog.require('lime.fill.Frame');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.SpriteSheet');
goog.require('lime.SpriteSheet');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.zputnik.json')
goog.require('lime.ASSETS.zputnik_running.json')

// entrypoint
game.start = function(){

	game.state = {
		IDLE: 0,
		RUN_LEFT: 1,
		RUN_RIGHT: 2,
		SHOOT: 3
	}
	var move = 0;
	var director = new lime.Director(document.body,800, 600),
	    scene = new lime.Scene(),
	    //viewport = new lime.Sprite().setSize(520, 440).setFill(34,150,0),
 		floor = new lime.Sprite().setFill("assets/beforeandnow.jpg").setScale(1.2).setAnchorPoint(0,0.8).setPosition(0,600);
		/*
	    target = new lime.Layer().setPosition(512,384),
        circle = new lime.Circle().setSize(150,150).setFill(255,150,0),
        lbl = new lime.Label().setSize(160,50).setFontSize(30).setText('TOUCH ME!'),
        title = new lime.Label().setSize(800,70).setFontSize(60).setText('Now move me around!')
            .setOpacity(0).setPosition(512,80).setFontColor('#999').setFill(200,100,0,.1);
*/
			
	game.ss = new lime.SpriteSheet('assets/zputnik.png',lime.ASSETS.zputnik.json, lime.parser.JSON);
	game.ss2 = new lime.SpriteSheet('assets/zputnik_running.png',lime.ASSETS.zputnik_running.json, lime.parser.JSON);
			
	var zputnik = new lime.Sprite().setPosition(80,440)
        .setFill(game.ss.getFrame('zputnik-idle-0.png'));

	game.anims = [];
		
		// keyframe animation
		game.anims[game.state.IDLE] = new lime.animation.KeyframeAnimation();
		game.anims[game.state.IDLE].delay= 1/16; // 1/16 sec between frames, too fast otherwise
		for(var i=0;i<11;i++){ //add the frames
			if (i > 8) continue;
			game.anims[game.state.IDLE].addFrame(game.ss.getFrame('zputnik-idle-'+i+'.png'));
		}
		// keyframe animation
		game.anims[game.state.RUN_LEFT] = new lime.animation.KeyframeAnimation();
		game.anims[game.state.RUN_LEFT].delay= 1/25; // 1/16 sec between frames, too fast otherwise
		for(var i=0;i<14;i++){ //add the frames
//			if (i == 5) continue;
			game.anims[game.state.RUN_LEFT].addFrame(game.ss2.getFrame('zputnik-running-'+i+'.png'));
		}
		// keyframe animation
		game.anims[game.state.RUN_RIGHT] = new lime.animation.KeyframeAnimation();
		game.anims[game.state.RUN_RIGHT].delay= 1/25; // 1/16 sec between frames, too fast otherwise
		for(var i=0;i<14;i++){ //add the frames
			if (i == 4) continue;
			game.anims[game.state.RUN_RIGHT].addFrame(game.ss2.getFrame('zputnik-running-back-'+i+'.png'));
		}
		// keyframe animation
		game.anims[game.state.SHOOT] = new lime.animation.KeyframeAnimation();
		game.anims[game.state.SHOOT].delay= 1/25; // 1/16 sec between frames, too fast otherwise
		for(var i=0;i<20;i++){ //add the frames
			//if (i == 1) continue;
			game.anims[game.state.SHOOT].addFrame(game.ss.getFrame('zputnik-idle-fire-'+i+'.png'));
		}
				
		zputnik.runAction(game.anims[game.state.IDLE]);


    //add target and title to the scene
    scene.appendChild(floor);

    scene.appendChild(zputnik);

	director.makeMobileWebAppCapable();

	game.lastState = game.state.IDLE;
	game.newState = game.state.IDLE;
	goog.events.listen(director, ['keydown'], function(e) {
		switch(e.event.keyCode)
		{
		case 38:
		    console.log(1);
			game.newState = game.state.SHOOT
			break;
		case 39:
		    console.log(1);
			game.newState = game.state.RUN_LEFT
			break;
		case 37:
			game.newState = game.state.RUN_RIGHT;
			break;
		}
		
		e.swallow(['keyup'],function(){
			game.newState = game.state.IDLE;
        });
		
	});


	// set current scene active
	director.replaceScene(scene);

	var velocity = 0.3;
	lime.scheduleManager.schedule(function(dt){
	
		var updateZputnik = false;
		var position = zputnik.getPosition();
		var position2 = floor.getPosition();
		if (game.newState == game.state.RUN_LEFT) {
			position.x += velocity * dt;	// if dt is bigger we just move more
			if (position.x > 390 && position2.x > -370) {
				position.x = 390;
			};
			if (position.x == 390) {
				position2.x -= velocity * dt;
				if (position2.x < -370) {
					position2.x = -370;
				}
			}
			if (position.x > 720) {
				position.x = 720;
				game.newState = game.state.IDLE;
			};			
			//console.log(position.x, position2.x);
		} else if (game.newState == game.state.RUN_RIGHT) {
			position.x -= velocity * dt;	// if dt is bigger we just move more
			if (position.x < 80) {
				game.newState = game.state.IDLE;
				position.x = 80;
			};
			if (position.x < 390 && position2.x < 0) {
				position.x = 390;
			};

			if (position.x == 390) {
				position2.x += velocity * dt;
				if (position2.x > 0) {
					position2.x = 0;
				}
			}			
		}
		
		if (game.lastState != game.newState) {
			zputnik.runAction(game.anims[game.newState]);
			game.lastState = game.newState;
		}

		zputnik.setPosition(position); 		
		floor.setPosition(position2); 		
	}, this);	
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
