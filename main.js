document.addEventListener('DOMContentLoaded', () => {
    const allCards = Array.prototype.slice.call(document.querySelectorAll('.cardsRow>div'))

    const cardsArrSh = ['<img src="images/blue_1_large.png" alt="" class="img">', '<img src="images/blue_1_large.png" alt="" class="img">', '<img src="images/blue_2_large.png" alt="" class="img">', '<img src="images/blue_2_large.png" alt="" class="img">', '<img src="images/blue_3_large.png" alt="" class="img">', '<img src="images/blue_3_large.png" alt="" class="img">', '<img src="images/blue_4_large.png" alt="" class="img">', '<img src="images/blue_4_large.png" alt="" class="img">', '<img src="images/blue_5_large.png" alt="" class="img">', '<img src="images/blue_5_large.png" alt="" class="img">', '<img src="images/blue_6_large.png" alt="" class="img">', '<img src="images/blue_6_large.png" alt="" class="img">', '<img src="images/blue_7_large.png" alt="" class="img">', '<img src="images/blue_7_large.png" alt="" class="img">', '<img src="images/blue_8_large.png" alt="" class="img">', '<img src="images/blue_8_large.png" alt="" class="img">'];
    const winCardArr = [];

    // Shuffle
    (() => {
        for (let i = cardsArrSh.length - 1; i > 0; i--) {
            let tmp = cardsArrSh[i];
            let rnd = Math.floor(Math.random() * (i + 1));

            cardsArrSh[i] = cardsArrSh[rnd];
            cardsArrSh[rnd] = tmp;
        }
    })()

    //TODO delete unused classes
    const setCardValue = {
        opened(n) {
            allCards[n].innerHTML = cardsArrSh[n]

            allCards[n].classList.add('opened')
            allCards[n].classList.remove('closed')
        },
        closed(n) {
            allCards[n].classList.add('closed')
            allCards[n].classList.remove('opened')
            allCards[n].innerHTML = ''
        }
    }

    //first close
    function closeAll() {
        allCards.forEach((el, i) => {
            if (!winCardArr.includes(el.innerHTML)) { setCardValue.closed(i++) }
        })
    }
    closeAll()


    const timer = document.querySelector('.timer')

    let count = 0
    let lastCardInnerHTML
    let lastCard
    let timerCount = 0
    let isGameOver = false
    let gameTime = 45 //TODO change to usersetting
    const obj = []
    allCards.forEach((card, i) => {
        card.addEventListener('click', function openCards() {
            if (timerCount++ === 0) { setTimer(gameTime) }
            // console.log('count = ' + count)
            // console.log('lastCardInnerHTML = ' + lastCardInnerHTML)
            if (card === lastCard || isGameOver || obj.includes(card) || card.classList.contains('opened')) { return }

            if (count === 2) {
                closeAll()
                count = 0
            }

            setCardValue.opened(i)

            if (count++ === 1 && card.innerHTML === lastCardInnerHTML) {

                console.log('push')
                card.removeEventListener('click', openCards)
                //lastCard.removeEventListener('click', openCards)//?????????????????????????
                winCardArr.push(lastCardInnerHTML)
                // isGameOver = false
                obj.push(lastCard)

                if (winCardArr.length === 8) { gameComplete() }

            } else {
                lastCardInnerHTML = card.innerHTML
                lastCard = card
            }

            // console.log('card.innerHTML = ' + card.innerHTML)
            // console.log(winCardArr)
            // console.log('---------------------------------------------------------------------------------------------------------------------------------------------')
        })

        // card.addEventListener('click', () => {
        //     if ()
        // })
    });


    timer.textContent = 'Remaining time: ' + gameTime

    let timeoutID = null

    function setTimer(time) {
        setInterval(() => {
            timer.textContent = 'Remaining time: ' + --time
        }, 1000)
        timeoutID = setTimeout(() => {
            gameOver()
        }, time * 1000);
    }

    function gameComplete() {
        const finishText = document.querySelector('.finishText')
        const replay = document.querySelector('.replay')

        document.body.classList.add('bodyFinish')
        finishText.classList.remove('displayNone')
        replay.classList.add('replayDown')
        replay.textContent = 'Play again'
        timer.remove()
        clearTimeout(timeoutID)
    }

    function gameOver() {
        // for (let card of allCards) {
        //     card.removeEventListener('click', () => {
        //         delete window.openCards
        //     })
        // }

        const finishText = document.querySelector('.finishText')
        const replay = document.querySelector('.replay')

        document.body.classList.add('bodyLose')
        finishText.classList.remove('displayNone')
        finishText.textContent = 'Game over'
        replay.classList.add('replayDown')
        replay.textContent = 'Play again'

        timer.remove()

        isGameOver = true
    }

    // allCards.forEach((el, i) => {
    //     let b = i++
    //     el.addEventListener('click', function a() {
    //         // console.log('count = ' + count)
    //         // console.log('lastCard = ' + lastCard)

    //         if (count === 2) {
    //             closeAll()
    //             count = 0
    //             // lastCard = el.innerHTML
    //         }

    //         setCardValue.opened(b)

    //         if (el.innerHTML === lastCard && count === 1) {
    //             winCardArr.push(lastCard)
    //             console.log('push')
    //             el.removeEventListener('click', a)
    //             lastEl.removeEventListener('click', a)
    //         } else {
    //             lastCard = el.innerHTML
    //             lastEl = el
    //         }

    //         count++
    //         // console.log('el.innerHTML = ' + el.innerHTML)
    //         // console.log(winCardArr)
    //         // console.log('---------------------------------------------------------------------------------------------------------------------------------------------')
    //     })

    // });













})