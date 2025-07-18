// ********************display**************
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

// copy password
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");

// length
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");

// checkboxes
const uppercaseCb = document.querySelector("#uppercase");
const lowercaseCb = document.querySelector("#lowercase");
const numberCb = document.querySelector("#numbers");
const symbolCb = document.querySelector("#symbols"); 
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// indicator
const indicator = document.querySelector("[data-indicator]");

// generate button
const generateBtn = document.querySelector(".generateButton");

// symbol
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// *********************************

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();



// set password length shows password length on ui
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //sliderwidth% sliderheight% using change slider bg filling
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min))+ "% 100%";
}

// calculate password strength
// set Indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;  //shadow
}
// set strength circle colour

setIndicator("#ccc");


// genarate any random no. b/w min and max(exclusive)
function getRndmInt(min, max) {
    return Math.floor(Math.random() * (max - min )) + min;
}

// generate any random no. b/w 0- 9
function generateNumber(){
    return getRndmInt(0, 9);
}

// The ASCII value of the lowercase alphabet is from 97 to 122. 
// generate any random lowercase b/w a - z
function generateLowercase(){
   return String.fromCharCode(getRndmInt(97, 123));
}

// ASCII value of the uppercase alphabet is from 65 to 90.
// generate any random uppercase b/w A - Z
function generateUppercase(){
    return String.fromCharCode(getRndmInt(65, 91));
}

// generate any random symbol from index 0 - 30
function generateSymbol(){
    const rndmNum = getRndmInt(0, symbols.length);
    return symbols.charAt(rndmNum);
}

// console.log(symbols.length);

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCb.checked) hasUpper = true;
    if(lowercaseCb.checked) hasLower = true;
    if(numberCb.checked) hasNumber = true;
    if(symbolCb.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 10){
        setIndicator("#0f0");       //green
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && (hasNumber || hasLower) && (hasNumber || hasUpper) && passwordLength >= 7){
        setIndicator("#ff0");      //yellow like
    }
    else{
        setIndicator("#f00");      //red
    }
}

//copy to clipboard
async function copyContent() {
try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
}
catch(e) {
    copyMsg.innerText = "failed";
}

//To make copy wala span visible
copyMsg.classList.add("active");

    setTimeout( () => {
      copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {          // substracting 1 from array's length
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));     //adding 1 because we need last number as well which gets excluded 
        //swap number at i index and j index
        const temp = array[i];                     //now we will require this temp i to provide in line 135 bcz 134 line will change value of i
        array[i] = array[j];                     
        array[j] = temp;
  }
    let str = "";
    array.forEach((el) => (str += el));
    
    return str;
    
}


function handleCBChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if (passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCBChange);
})

inputSlider.addEventListener('input', (sval) => {
    passwordLength = sval.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value) //agar password ki koi value available hai to , another way can be if pass val  grtr thn zero
        copyContent();           // to copy karo
})
   

   //handle generate password button
generateBtn.addEventListener('click',() => {
    //none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    
     //let's start the journey to find new password

    //remove old password and make it empty
    password = ""

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCb.checked) {
    //     password += generateUppercase();
    // }

    // if(lowercaseCb.checked) {
    //     password += generateLowercase();
    // }

    // if(numberCb.checked) {
    //     password += generateNumber();
    // }

    // if(symbolCb.checked) {
    //     password += generateSymbol();
    // }

    funcArr = [];               //example: [generateUppercase, generateLowercase, generateNumber, generateSymbol]

    if(uppercaseCb.checked)
        funcArr.push(generateUppercase);     //here funcArr is pushing function generateUppercase in funcArr
    if(lowercaseCb.checked)
        funcArr.push(generateLowercase);
    if(numberCb.checked)
        funcArr.push(generateNumber);
    if(symbolCb.checked)
        funcArr.push(generateSymbol);

    // add the required characters - compulsory addition
    for (let i=0; i<funcArr.length; i++) {                    // ***cls1*****  jo badha chkbox chkd hoy to funcarr.length=4
        password += funcArr[i]();                             // ***cls1***** aanathi passwrd ma index 0to3 par je hoyy te store karavaay
    }

    //adding random characters till the password length - remaining addition
    for(let i=0; i<(passwordLength-funcArr.length); i++) {
        let rndmIndex = getRndmInt (0 , funcArr.length);       // **cls1*** funcarr length 4 hoyy to 0 o 3 index male i< vadi cndtn na karane
        password += funcArr[rndmIndex]();       //this will make generate whichever checkbox is checked from 0 to 3                      
    }   

    //shuffle the password
    password = shufflePassword(Array.from(password));     // passed pass from(password) in array form using shuf pass

    //show  pass in ui
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();



});




//////*****************imp note*********************************** */
// @benspencer7491
// 9 days ago (edited)
// 1. Understanding Math.random()
// Math.random() generates a random decimal number between 0 and 1. This range includes 0 but excludes 1.
// For example, Math.random() might generate numbers like 0.234, 0.6789, or 0.999.
// 2. Multiplying Math.random()
// When you multiply Math.random() by a number, like 10, you stretch the range:
// Math.random() * 10 will give a random number between 0 and just below 10.
// This range is [0, 10), meaning it can be as low as 0 but will never reach 10 (the highest possible value is close to 9.999999...).
// 3. Using Math.floor()
// Math.floor(x) rounds down the number x to the nearest integer.
// So, Math.floor(Math.random() * 10) will convert the range [0, 10) to an integer range from 0 to 9.
// You can get 0, 1, 2, ..., up to 9, but never 10.
// 4. Including 10 in the Range
// If you want to include 10 in the range, you need to change the multiplication factor:
// Math.floor(Math.random() * 11) will give you a range of integers from 0 to 10.
// This is because you're now generating numbers in the range [0, 11), and Math.floor() will convert it to [0, 10].
// 5. Shifting the Range (Adding 1)
// If you want the range to start from 1 instead of 0, you simply add 1 to the result:
// Math.floor(Math.random() * 10) + 1 will give you a range from 1 to 10.
// This works because now the range [0, 9] gets shifted to [1, 10].
// 6. Extending to Max-Min Concept
// To generate a random integer between any min and max values, you use this formula:
// Math.floor(Math.random() * (max - min + 1)) + min.
// Example: To get a number between 5 and 15 (both inclusive):
// Math.floor(Math.random() * (15 - 5 + 1)) + 5
// This simplifies to Math.floor(Math.random() * 11) + 5, giving you a random integer from 5 to 15.  hope this helps.