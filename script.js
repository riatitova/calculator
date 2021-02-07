let numbers = document.querySelectorAll('.number');
let operationsBtn = document.querySelectorAll('.operator');
let decimalBtn = document.getElementById('decimal');
let resultBtn = document.getElementById('result');
let clearBtns = document.querySelectorAll('.clear-btn');
let display = document.getElementById('display');
let MemCurrentNum = 0;
let MemNewNum = false;
let MemPendingOperation = '';

for (let i = 0; i < numbers.length; i++) {
    let number = numbers[i];
    number.addEventListener('click', function(e) {
        numberPress(e.target.textContent);
    });
}

for (let i = 0; i < operationsBtn.length; i++) {
    let operationBtn = operationsBtn[i];
    operationBtn.addEventListener('click', function(e) {
        operation(e.target.textContent);
    });
}

for (let i = 0; i < clearBtns.length; i++) {
    let clearBtn = clearBtns[i];
    clearBtn.addEventListener('click', function(e) {
        clear(e.srcElement.id);
    });
}

decimalBtn.addEventListener('click', decimal);

function numberPress(num) {
    if (MemNewNum) {
        if (display.value === '-') {
            display.value += num;
        } else {
            display.value = num;
        }
        MemNewNum = false;      
    } else {
        if (display.value === '-') {
            display.value += num;
        } else if (display.value === '0') {
            display.value = num;
        } else {
            display.value += num;
        };
    };    
};

function operation(op) {
    let localOpMem = display.value;
    let count1 = 0;
    let count2 = 0;
    let max = 0;
    if (MemNewNum && MemPendingOperation !== '=' && MemPendingOperation !== '\u{221A}') {
        if (op === '-') {
            display.value = '-';
        } else {
            display.value = MemCurrentNum;
        }
    } else {
        MemNewNum = true;
        if (op === '=' && (localOpMem.toString().indexOf('.') !== -1 || MemCurrentNum.toString().indexOf('.') !== -1) && MemPendingOperation !== '^' && MemPendingOperation !== '\u{221A}') {
            while (localOpMem.toString().indexOf('.') !== -1 && count2 < 11) {
                count2++;
                localOpMem = parseFloat(localOpMem) * 10;
            }
            while (MemCurrentNum.toString().indexOf('.') !== -1 && count1 < 11) {
                count1++;
                MemCurrentNum = parseFloat(MemCurrentNum) * 10;
            }
            if (count1 <= count2) {
                MemCurrentNum = MemCurrentNum * Math.pow(10, count2 - count1); 
                max = count2;
            } else {
                localOpMem = localOpMem * Math.pow(10, count1 - count2);
                max = count1;
            }
        }
        if (MemPendingOperation === '+') {
            MemCurrentNum += parseFloat(localOpMem);
        } else if (MemPendingOperation === '-') {
            MemCurrentNum -= parseFloat(localOpMem);
        } else if (MemPendingOperation === '*') {
            MemCurrentNum *= parseFloat(localOpMem);
        } else if (MemPendingOperation === '/') {
            MemCurrentNum /= parseFloat(localOpMem);
        } else if (MemPendingOperation === '^') {
            MemCurrentNum = Math.pow(MemCurrentNum, parseFloat(localOpMem));
        } else if (MemPendingOperation === '\u{221A}') {
            if (localOpMem < 0) {
                display.value = '0';
                MemNewNum = false;
                MemCurrentNum = 'Error. Нажмите С';
                MemPendingOperation = '';
                op = '';
            } else {
                MemCurrentNum = Math.sqrt(parseFloat(localOpMem));
                display.value = MemCurrentNum;
                MemPendingOperation = op;
            }
        } else {
            MemCurrentNum = parseFloat(localOpMem);
        };
        if (max !== 0) {
            switch(MemPendingOperation) {
                case '-':
                case '+': 
                MemCurrentNum /= Math.pow(10, max);
                break;
                case '*': 
                MemCurrentNum /= Math.pow(10, count1 + count2);
                break;
            }
        }
        if (op === '-' && display.value === '0') {
            display.value = '-';
            MemNewNum = false;
        } else {
            display.value = MemCurrentNum;
            MemPendingOperation = op;
        }
                
    };
};

function decimal(arg) {
    let localDecimalMem = display.value;
    if (MemNewNum) {
        if (display.value === '-') {
            localDecimalMem = '-0.';
        } else {
            localDecimalMem = '0.';
        }  
        MemNewNum = false;
    } else {
        if (display.value === '-') {
            localDecimalMem = '-0.';
        } else if (localDecimalMem.indexOf('.') === -1) { 
            localDecimalMem += '.';
        };
    };
    display.value = localDecimalMem;
};

function clear(id) {
    if (id === 'ce') {      
        display.value = '0';
        MemNewNum = true;
    } else if (id === 'c') {
        display.value = '0';
        MemNewNum = false;
        MemCurrentNum = 0;
        MemPendingOperation = '';
    };
};
