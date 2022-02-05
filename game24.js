var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 700,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}; 
let cards_color = function (pointer) {
    
    if(number1==-1) {
        number1 = this.index;
        this.setTint(0x00ff00);
        console.log("number1 = " + number1 + " number2 = " + number2);
    }
    else if(number1 == this.index){
       this.clearTint();
       number1 = -1;
    } 
    else if (operation > 0){
        number2 = this.index;
        this.setTint(0x00ff00);
        console.log("number1 = " + number1 + " number2 = " + number2);
        if (operation == 1){
            result = cards[number2] + cards[number1];

        }else if (operation == 2){
            result = cards [number1] - cards [number2];

        }else if (operation == 3){
            result = cards[number1] * cards [number2];
        }
        else if (operation == 4){
            result = cards[number1] / cards [number2];
        }
        cb[number2].clearTint();
        cards[number2] = result;
        cards[number1] = null;
        cb[number1].visible = false;
        number1 = -1;
        number2 = -1;
        if(is_success()){
            trophy = this.scene.add.sprite(200, 350, 'success').setScale(0.8);
        }
    }
};
let operations_color = function (pointer) {
        if (operation == this.index) {
        this.clearTint();
        operation = -1;
    } else {
        if (operation>0) {
            operations[operation-1].clearTint();
        }
        operation = this.index;
        this.setTint(0xff9900);
    }
};
let clearTint = function (pointer) {
    this.clearTint();
}
let clearcardTint = function (pointer) {
    this.clearTint();
    this.on('pointerdown',cards_color);
}

let tint_light_gray = function () {this.setTint(0xe0e0e0)}
let lime_green = "#33ff00";
let result;
let orange = "#ff8c00";
var steps = [];
var ops = [];
var opTable =[0,1,2,3,4,5];
var hintIndex = 0;
var cards = [];
let cb = [];
let number1 = -1;
let number2 = -1;//stuff
let operation = -1;
let operations = [];
var trophy = null;
let is_success = function(){
    let count = 0;
    let result = -1;
    for (let i = 0; i<4;i++){
        if (cards[i]!=null){
            result = cards[i];
            count++;
            if(count>1){
                return false;
            }
        }
    }
    return result == 24;
}
var calc24 = function(a) {

    steps.push(a.toString());
    a.sort((x,y) => y-x);
    //console.log(steps);
    if (a.length == 1) {
        if (Math.abs(a[0] - 24) < 0.00001) return true;
        else {
            steps.pop();
            return false;
        }
    }
    for (let i = 0; i < a.length-1;i++) {
        for (let j = i + 1; j < a.length;j++) {
            let a1 = a.concat();
            let m = a[i];
            let n = a[j];
            a1.splice(j,1);
            a1.splice(i,1);
            let newNumbers = [m+n, m-n, n-m, m*n, m/n, n/m];
            for (let x = 0; x < 6; ++x) {
                if (newNumbers[x] < 0) continue;
                ops.push([x , m, n, newNumbers[x]]);
                if (calc24(a1.concat([newNumbers[x]]))) return true;
                ops.pop();
            }
        }
    }
    steps.pop();
    return false;
}
var game = new Phaser.Game(config);
function preload(){
    this.load.image('play', 'assets/play.png');
    this.load.image('add', 'assets/add.png');
    this.load.image('divide', 'assets/divide.png');
    this.load.image('multiply', 'assets/multiply.png');
    this.load.image('subtract', 'assets/subtract.png');
    this.load.image('hint', 'assets/hint.png');
    this.load.image('numberHolder', 'assets/number_square.png');// thingy
    this.load.image('success', 'assets/Trophy.png');// thingy
}
var texts = [];
function create() {
    let r1 = this.add.sprite(150, 340, 'numberHolder').setScale(0.221).setInteractive();//thingy
    let r2 = this.add.sprite(250, 340, 'numberHolder').setScale(0.221).setInteractive();//thingy
    let r3 = this.add.sprite(150, 430, 'numberHolder').setScale(0.221).setInteractive();//thingy
    let r4 = this.add.sprite(250, 430, 'numberHolder').setScale(0.221).setInteractive();//thingy
    r1.index = 0;
    r2.index = 1;
    r3.index = 2;
    r4.index = 3;
    cb = [r1,r2,r3,r4];
    const text1 = this.add.text(120, 315, '1', { font: '50px Courier', fill: orange });
    const text2 = this.add.text(225, 315, '2', { font: '50px Courier', fill: orange});
    const text3 = this.add.text(120, 400, '3', { font: '50px Courier', fill: orange });
    const text4 = this.add.text(225, 400, '4', { font: '50px Courier', fill: orange });
    texts = [text1, text2,text3,text4];
    play = this.add.sprite(200, 510, 'play' ).setScale(0.2).setInteractive();
    add = this.add.sprite(50,240, 'add').setScale(0.2).setInteractive();
    subtract = this.add.sprite(150,240, 'subtract').setScale(0.2).setInteractive();
    multiply = this.add.sprite(250,240, 'multiply').setScale(0.2).setInteractive();
    divide = this.add.sprite(350,240, 'divide').setScale(0.2).setInteractive();
    hint = this.add.sprite(350,140, 'hint').setScale(0.05).setInteractive();
    add.index = 1;
    subtract.index = 2;
    multiply.index = 3;
    divide.index = 4;
    operations = [add, subtract, multiply, divide];
    hintText = this.add.text(10, 120, '', { font: '20px Courier', fill: '#128211' });

    play.on('pointerdown', function (pointer) {

        this.setTint(0x00ff00);
        if (trophy != null) {
            trophy.destroy();
        }

        steps = [];
        ops = [];
        cards = get4card();
        while (!calc24(cards)) {
            steps = [];
            ops = [];
            cards = get4card();
        }
        hintIndex = 0;
        opsString='';
        hintText.setText('');
   
        r1.visible = true;
        r2.visible = true;
        r3.visible = true;
        r4.visible = true;
        r4.clearTint();
        r3.clearTint();
        r2.clearTint();
        r1.clearTint();
        number2 = -1;
        number1 = -1;
        if (operation>0){
            operations[operation-1].clearTint();
        }
        operation = -1;

    });
    play.on('pointerup', clearTint);

    play.on('pointerout', clearTint);

    hint.on('pointerup', tint_light_gray);

    hint.on('pointerout', clearTint);

    r4.on('pointerdown', cards_color);

    r3.on('pointerdown', cards_color);

    r2.on('pointerdown', cards_color);

    r1.on('pointerdown', cards_color);

    add.on('pointerdown', operations_color);

    subtract.on('pointerdown', operations_color);

    multiply.on('pointerdown', operations_color);

    divide.on('pointerdown', operations_color);


    hint.on('pointerdown', function(pointer) { 
        if (hintIndex < 3) {
            op = ops[hintIndex];
            const m = op[1];
            const n = op[2];
            const result = op[3];
            switch (op[0]) {
                case 0:
                    opsString = opsString + `${m}+${n}=${result}`;
                    break;
                case 1:
                    opsString = opsString + `${m}-${n}=${result}`;
                    break;
                case 2:
                    opsString = opsString +`${n}-${m}=${result}`;
                    break;
                case 3:
                    opsString = opsString + `${m}x${n}=${result}`;
                    break;
                case 4:
                    opsString = opsString + `${m}÷${n}=${result}`;
                    break;
                case 5:
                    opsString = opsString + `${n}÷${m}=${result}`;
                    break;
            }
            opsString = opsString + '\n';
            //console.log(opsString);
        }
        hintIndex++;
        hintText.setText(opsString);
    });

    
}

function update(){
    for (let i =0; i < 4; i++) {
        texts[i].setText(cards[i]);
    }

}
var get4card = function () {
    let a = [];
    a[0] = Math.floor(Math.random() * 13) + 1;
    a[1] = Math.floor(Math.random() * 13) + 1;
    a[2] = Math.floor(Math.random() * 13) + 1;
    a[3] = Math.floor(Math.random() * 13) + 1;

    return a;
}
