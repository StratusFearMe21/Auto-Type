var inputBox;

$(document).ready(function () {
    inits();
    setTimeout(delayedInits, 1000)
});

function inits() {
    $.supportsIsTrusted = () => {
        return false
    };
    inputBox = $(".js-input-box");

    $("button:contains('Skip Video')").trigger("click");

    $("button:contains('Continue')").trigger("click");

    const continueTo = $("a:contains('Continue To:')");
    if (continueTo.length)
        window.location.href = continueTo.get(0).href // Go to the continue to the next lesson link
}

function delayedInits() {
    setTimeout(start, 1000)
}

function start() {
    if (singleLetterSelector().length > 0)
        startSingleLetter();
    else if (screenIntroSelector().length > 0)
        startScreenIntro();
    else if (screenBasicSelector().length > 0)
        startScreenBasic();
    else if (screenFallingSelector().length > 0)
        startScreenFalling();
}

function singleLetterSelector() {
    return $(".structure-content").not(".hide").find(".frame")
}

function startSingleLetter() {
    typeLetter(singleLetterSelector().find(".key-label")[0].textContent)
    setTimeout(() => {
        pressEnter();
        setTimeout(start, 500)
    }, 500)
}

function screenIntroSelector() {
    return $(".structure-content").not(".hide").find(".screenIntro")
}

function startScreenIntro() {
    var letters = [];
    const letterObjects = screenIntroSelector().find(".letter");
    for (var i = 0; i < letterObjects.length; i++)
        letters.push(letterObjects[i].textContent);
    typeLetters(letters)
}

function screenBasicSelector() {
    return $(".structure-content").not(".hide").find(".screenBasic")
}

function startScreenBasic() {
    var letters = [];
    const letterObjects = screenBasicSelector().find(".letter");
    for (var i = 0; i < letterObjects.length; i++)
        letters.push(letterObjects[i].textContent);
    typeLetters(letters)
}

function screenFallingSelector() {
    return $(".structure-content").not(".hide").find(".screenFalling")
}

function startScreenFalling() {
    var letters = [];
    const letterObjects = screenFallingSelector().find(".letter");
    for (var i = 0; i < letterObjects.length; i++)
        letters.push(letterObjects[i].textContent.substring(1, 2));
    typeLetters(letters.reverse())
}

function typeLetters(letterList) {
    var speed;
    var accuracy;
    var intervalRate;
    var interval;
    var letterIndex = 0; // The current letter in the array
    var running = false;

    const updateSettingsListener = (e) => {
        var data = e.detail;
        var newAccuracy = parseInt(data.accuracy);
        var newSpeed = parseInt(data.speed);

        if (newAccuracy !== accuracy || newSpeed !== speed) {
            speed = newSpeed;
            accuracy = newAccuracy;
            intervalRate = 60000 / ((4 + 1) * speed); // 4 is average word length that typing.com seems to use, +1 because of the space after the word
            stopInterval();
            interval = startInterval();
            running = true;
        }
    };

    const updateStateListener = (e) => {
        var newRunning = e.detail;

        if (newRunning !== running) {
            running = newRunning;
            if (!running) {
                stopInterval();
                running = false;
            } else {
                stopInterval();
                interval = startInterval();
                running = true;
            }
        }
    };

    document.addEventListener('updateSettings', updateSettingsListener);
    document.addEventListener('updateState', updateStateListener);

    const startInterval = function () {
        return setInterval(function () {
            if (letterIndex < letterList.length) {
                typeLetter(letterList[letterIndex]);

                letterIndex++
            } else {
                setTimeout(pressEnter, 500);
            }
        }, intervalRate);
    };

    const stopInterval = () => {
        clearInterval(interval);
    };
}

function pressEnter() {
    var e = jQuery.Event("keydown");
    e.which = 13;
    addEmptyEventFunctions(e);
    e.originalEvent = JSON.parse(JSON.stringify(e));
    addEmptyEventFunctions(e);
    inputBox.trigger(e);
}

function typeLetter(letter) {
    var e = jQuery.Event("keypress");
    e.key = letter;
    e.which = letter.charCodeAt(0);
    e.keyCode = e.which;
    if (e.which === 160)
        e.key = " ";
    addEmptyEventFunctions(e);
    e.originalEvent = JSON.parse(JSON.stringify(e));
    addEmptyEventFunctions(e.originalEvent);
    inputBox.trigger(e);
}

function addEmptyEventFunctions(e) {
    e.preventDefault = () => {
    };
    e.stopPropagation = () => {
    };
}