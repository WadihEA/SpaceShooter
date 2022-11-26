//if on enemy is able to surpass the user , the game is over
//if an enemy touches the user , user losses the game
//if an enemy bullet hit sthe user , user loses a life
//user move faster then enemy 
//userBullets are faster then enemy bullet

var myGame = new Game();
var main = new MainPaddle(340,520,120,20,"#00BB00")
myGame.addSprite(main);

function drawEnv(){
    //wave1
    myGame.addSprite(new Enemy(40,100,120,20,"yellow"));
    myGame.addSprite(new Enemy(190,100,120,20,"yellow"));
    myGame.addSprite(new Enemy(340,100,120,20,"yellow"));
    myGame.addSprite(new Enemy(490,100,120,20,"yellow"));
    myGame.addSprite(new Enemy(640,100,120,20,"yellow"));
    //wave2
    myGame.addSprite(new Enemy(40, -30,120,20,"yellow"));
    myGame.addSprite(new Enemy(190,-30,120,20,"yellow"));
    myGame.addSprite(new Enemy(340,-30,120,20,"yellow"));
    myGame.addSprite(new Enemy(490,-30,120,20,"yellow"));
    myGame.addSprite(new Enemy(640,-30,120,20,"yellow"));
    //wave3
    myGame.addSprite(new Enemy(40,-200,120,20,"yellow"));
    myGame.addSprite(new Enemy(190,-200,120,20,"yellow"));
    myGame.addSprite(new Enemy(340,-200,120,20,"yellow"));
    myGame.addSprite(new Enemy(490,-200,120,20,"yellow"));
    myGame.addSprite(new Enemy(640,-200,120,20,"yellow"));

    //wave4 makes game way to hard
//     myGame.addSprite(new Enemy(40,-370,120,20,"yellow"));
//     myGame.addSprite(new Enemy(190,-370,120,20,"yellow"));
//     myGame.addSprite(new Enemy(340,-370,120,20,"yellow"));
//     myGame.addSprite(new Enemy(490,-370,120,20,"yellow"));
//     myGame.addSprite(new Enemy(640,-370,120,20,"yellow"));
}


function animate() {
        var start = window.performance.now();
        myGame.update();
        myGame.draw();
        var end = window.performance.now();
        var ldiff = end-start;
        //console.log('Execution time:' +  (end - start));
        //wait function
        while (ldiff <  0.0166667){
            end = window.performance.now();
            ldiff = end-start;
            //console.log('Wait');
        }
       
        // request new frame
        requestAnimFrame(animate);
};  


animate();