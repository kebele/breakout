////////////////////////////////////////////
//* BreakOut JavaScript - Code Explained *//
////////////////////////////////////////////
/*
 1
 canvas ve context seçiyoruz, border ekliyoruz,
 paddle ın border ını kalınlaştır,
 oyunun const larını belirledik, 
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;

paddle nesnesini belirledik
 const paddle = {
     x : cvs.width/2 - PADDLE_WIDTH/2,
     y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
     width : PADDLE_WIDTH,
     height : PADDLE_HEIGHT,
     dx : 5 //delta x yani x deki değişim
 }

 paddle ı çizecek function tanımladık
  function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
 }
 sonra denemesini yaptık
 drawPaddle() ile
*/

 //SELECT CANVAS ELEMENTS
 
 const cvs = document.getElementById("breakout");
 const ctx = cvs.getContext("2d");

 //add border to canvas
 cvs.style.border = "1px solid #0ff";

// make line thick when drawing to canvas

ctx.lineWidth = 3;

/*  GAME VARIABLES AND CONSTANTS*/
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let LIFE = 3;// 3 tane canı var
let SCORE = 0;
let LEVEL = 1;
const MAX_LEVEL = 4;
const SCORE_UNIT = 10;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

 /* create the paddle */
 const paddle = {
     x : cvs.width/2 - PADDLE_WIDTH/2,
     y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
     width : PADDLE_WIDTH,
     height : PADDLE_HEIGHT,
     dx : 5 //delta x yani x deki değişim
 }

 /* DRAW PADDLE */

 function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
 }

 // deneme için
 //drawPaddle();

 /* 
 2
 loop tanımlanıyor
 loop function içinde 
 draw(); içine çizlecekler
 update(); içine update edilecekler
 requestAnimationFrame();
 olacak
 tuşa basınca bir şeyler olması için AddeventListener ekliyoruz

 burada da leftArrow ve rightArrow u constantslar bölümüne let olarak ekliyoruz (çünkü değerlerinin değişebilir olmaslı gerekli ve değerlerini false yapıyoruz çünkü addEventListener içinde bunların değerini true yapacağız, şimdi çalışması söyle basıldığında değer true olacak çekildiğinde false olacak
paddle oluşturuyoruz ve paddle a hareket verecek function oluştutuyoruz.

 */

/* 
3
topu oluşturuyoruz
en yukarıda const BALL_RADIUS = 8;
yapacağız 
sonrada ball nesnesini oluşturuyoruz
sonrada drawBall() oluşturuyoruz
daha sonra drawBall() u draw() function içinede koyuyoruz.
*/
// create ball
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    //dx : 3,
    dx : 3 * (Math.random() * 2 -1), //6. madde ile alakalı random hareket için
    dy : -3
};

//draw the ball

function drawBall(){
    ctx.beginPath(); // yol functionu

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill;

    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

 /*
 4
 Move tha ball
moveBall() oluşturyoruz, burada topun x ve y koordinatına dx ve dy ekliyoruz, 
 function moveBall(){
     ball.x += ball.dx;
     ball.y += ball.dy;
 } bu şekilde iken function top kenardan çıkıpp gidiyor, bunun düzeltilmesi lazım
 top kenarlardan sekmeli ayrıca paddle üzerinde de sekmeli 
daha sonra moveBall() u update() içine ekliyoruz
şu anda update() şu şekilde
 function update(){
    movePaddle();
    moveBall();
 }
kenarlardan filan sekme için collision detection function yapılması lazım


 */

 function moveBall(){
     ball.x += ball.dx;
     ball.y += ball.dy;
 }

 //ball and wall collision detection
/*5
ballWallCollision() kenarlara çarpıp yön değiştirmesi functionu bunu hazırladıktan sonra update() e ekleyeceğiz
 function ballWallCollision(){
     if(ball.x + ball.radius > cvs.width){
        ball.dx = -ball.dx;
     }
 }
 bu hali ile sadece sağ kenardan sekiyor, şimdi diğer kenarlarda yapılacak

*/
 function ballWallCollision(){
    //sağ ve sol kenardan sekmesi, yada lı nın ilki sağdan sekme ikincisi soldan sekme
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = -ball.dx;
        WALL_HIT.play();
     }
     // tepeden sekmesi
     if(ball.y - ball.radius < 0){
         ball.dy = -ball.dy;
         WALL_HIT.play();
     }
     //alttaraftan sekme olmayacak orada can gidecek
     if(ball.y + ball.radius > cvs.height){
        LIFE--; // can gidecek ve top resetlenecek, bunun için resetBall() tanımlanacak, yarıca baştaki let olarak LIFE tanımlanacak burada 3 olacak
        LIFE_LOST.play();
        resetBall();
     }
 }
/*6
resetBall() tanımlanacak
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;    
    ball.dx = 3;
    ball.dy = -3
}
bu hali ile top aynı dirction da hareket ediyor bunu random yapmalıyız

 */

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;    
    ball.dx = 3 * (Math.random() * 2 -1); 
    /* random hareket için bunu ball nesnesinede koymalıyız*/
    ball.dy = -3
}

/* 
7
ball and paddle collision
bu noktada ball ve paddle ın birbiri ile olan ilişkisini yapacağız
daha sonrada bunu update() e ekleyeceğiz
*/

function  balPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y + paddle.height && ball.y > paddle.y){

        //play sound
        PADDLE_HIT.play();
        //check where the ball hit  the paddle
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        //normalize the values
        collidePoint = collidePoint / (paddle.width/2);
        //calculate the angle of the ball
        let angle = collidePoint * Math.PI/3

    //ball.dx = - ball.dx;
    //ball.dy = - ball.dy;
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = - ball.speed * Math.cos(angle);
    }
}


/* 8
create the bricks
tuğlaları oluşturmaya başlıyoruz
burada brick adında bir tuğla nesnesi oluşturacağız
bricks adında boş bir array tannımlayacağız, daha sonra bu dlacak
nesne oluşturduktan sonra brick leri dizecek function oluşturacğız
createBricks() içerisinde iç içe iki tane for loop olacak bir row lar için diğeri column lar için
daha sonra drawBricks() ile ekranda görünür hale getireceğiz, burada kilit konumda olan status : true 


 */

 const brick = {
     row : 1,
     column : 5,
     width : 55,
     height : 20,
     offSetLeft : 20,
     offSetTop : 20,
     marginTop : 40,
     fillColor : "#2e3548",
     strokeColor : "#FFF"
 }

let bricks = [];

 function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] =[];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
    /* burada hem row hemde column olarak brick leri oluşturacak function
    önce satır olarak mesela 3 satır olacak
    0 indisli satırda bir array oluşturacak, sonra column için ikinci loop a gidecekmesela 5 sütun olacak, 5 sefer x y koordinatlarında brick leri koyacak 5 tane bitince ikinci loop dan çıkıp ilk loop a girecek orada da 1. indisli satır için aynı işlemi yapacak sonra tekrar dönecek */
 }

createBricks();
/* console brisks yadığımızda console da brick lerin yerleri vs. gelir şimdi bize drawBricks() lazım ki ekranada görünsün
drawBricks() i yazdıktan sonra bunu draw() a ekleyeceğiz, bunun sonucunda ekrana 3 satır 5 kolun halinde brick ler çıkacak ancak şu anda bunlar çarpılabilir kırlabilir değil, top altlarından geçip gidiyor halde
bu durumda burada yapılması gereken top ile brick lerin collision detection */

//draw the bricks
function drawBricks(){
   for ( let r = 0; r < brick.row; r++){
       for( let c = 0; c < brick.column; c++){
           let b = bricks[r][c];
           //brick eğer krıılmadıysa yani status : true ise
           if(b.status){
               ctx.fillStyle =  brick.fillColor;
               ctx.fillRect(b.x, b.y, brick.width, brick.height);

               ctx.strokeStyle = brick.strokeColor;
               ctx.strokeRect(b.x, b.y, brick.width, brick.height)
           }
       }
   }
}

/* 9
ball brick collision detection
top ile brickler arası etkileşim ve kırılma olması için

*/

function ballBrickCollision(){
    for (let r = 0; r < brick.row; r++){
        for( let c = 0; c < brick.column; c++){
            let b =  bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // the birck is broken
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

/* 10
show game stats
puanlar vs gösterimi 
showGameStats() yapıp içine text ve image ların renk vs. yazıyoruz, daha sonra components.js e gidip bu resimleri nereden alacağını giriyoruz, sonra buraya dönüp
draw() içine her image için ayrı şekilde giriyoruz showGameStats(text, textX, textY, img, imgX, imgY)
bu arada variables tanımladığımız kısıma level ve max_level tanımlamamız gerekli
*/
function showGameStats(text, textX, textY, img, imgX, imgY){
    //draw text
    ctx.fillStyle = "#FFF"; //text rengi
    ctx.font = "25px Germania One"; // font family and size
    ctx.fillText(text, textX, textY);
    //draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}


/* draw() function içinde drawPaddle() olacak */
function draw(){
    drawPaddle();
    drawBall();
    drawBricks();

    //show score
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    //show lives
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
    //show level
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2, 5);
 }

//control the paddle
document.addEventListener("keydown",function(event){
    if(event.keyCode == 37){
        //console.log("tıklandı");
        leftArrow = true;
    } else if(event.keyCode == 39){
        rightArrow = true;
    }
});

document.addEventListener("keyup",function(event){
    if(event.keyCode == 37){
        leftArrow = false;
    } else if(event.keyCode == 39){
        rightArrow = false;
    }
});

//move paddle function tanımlanması
/* && sonrası kısım paddle canvasın sınırları dışına çıkmasın diye
burada leftArrow ve rightArrow değişkenlerinin amacı movePaddle için ne yapacağını belirleyecek boolean ları ayarlamak
yani klavyede sol ok a basınca yani keydown olunca paddle.x değeri yani o sırada paddle ın soldaki x koordinatını ifade eden değer dx kadar azalacak yani paddle sola hareket edecek, aynı şey sağ oka basınca da tekrar edecek burada kritik ifade
paddle.x -= paddle.dx veya paddle.x += paddle.dx 
ifadeleri yani sola yada sağa hareket miktarı
diğer konu paddle ın kavasın sınrıları dışna çıkmaması durumu
paddle.x + paddle.width yani paddle ın x deki koordinatı + paddle ın kendi genişliği toplamı, kanvasın genişliğinden küçük oldukça hereket edecek yani iki tane true oldukça hareket olacak sağa doğru, yani sağ oka basıldı ve genişlik hesabı yapıldı, ikiside true olacak, sola hareketteki ikinci true şartı ise paddle x in 0 dan büyük olması, buda soladan kanvasın dışına çıkmaması durumu, burada da aynı iki tane true oldukça sola hareket gerçekleşecek */
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if (leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}


/* 
11
game over
oyunun bitmesi ile ilgili function
bunun için variables lere let GAME_OVER ekleyip default eğerini false yapacağız, function da eğer LIFE < 0 olursa (bu başlangıçta 3 vermiştik variables te) GAME_OVER = true olacak daha sonra update() içerisine gameOver() ekleyeceğiz,
daha sonra da loop() içine
 */

function gameOver(){
    if(LIFE < 0){
        showYouLose();
        GAME_OVER =  true;
    }
}

/* 
12
level up durumu için 
levelUp() tanımlayacağız
 */

 function levelUp(){
     let isLevelDone = true;
     //check if all bricks are broken
     for (let r = 0; r < brick.row; r++){
        for (let c = 0; c <brick.column; c++){
            isLevelDone = isLevelDone && !bricks[r][c].status
        }
     }
     /*bütün brickler kırılmış tamizlenmiş yani
     bu durumda birck.row u bir tane arttıracak;
     createBricks(); çalışacak ve yeni brickler yapacak ve
     ball.speed += 0.5 topun hızını 1.5 katına çıkaracak
     topun pozisyonunu resetleyecek
     LEVEL i 1 arttıracak
     buraya bir tane daha if ekleyeceğiz bu if te level sayısını max-level ile karşılaştıracak eğer level > max-level ise functionun geri kalanını çalıştırmayacak
     levelUp() ı update() içine ekleyeceğiz
     */
     if(isLevelDone){
        WIN.play();
         if(LEVEL >= MAX_LEVEL){
             showYouWin();             
             GAME_OVER = true;
             return; 
         }
         brick.row++;
         createBricks();
         ball.speed +=0.5;
         resetBall();
         LEVEL++;
    }
 }

 /* update function */
 function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    balPaddleCollision();
    ballBrickCollision();
    gameOver();
    levelUp();
 }


//GAME LOOP
function loop(){
    //clear the canvas
    ctx.drawImage(BG_IMG, 0, 0);
    draw();

    update();

    if(!GAME_OVER){
        requestAnimationFrame(loop);
    }
    
}

loop();

/*
14
 sound butonu ve function kazandırma */

const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    //change image sound on/off
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    soundElement.setAttribute("src", SOUND_IMG);
    //mute and unmute sounds
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

/* 
15
game over durumu mesajları vb */

const gameover = document.getElementById("gameover");
const youwon = document.getElementById("youwon");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

restart.addEventListener("click", function(){
    location.reload();//page reload
})

//show you win
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block"
}

//show you lose
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block"
}
