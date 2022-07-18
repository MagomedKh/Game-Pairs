document.addEventListener('DOMContentLoaded', () => {

    const cardsArrSh = []
    const completedLevelsArrLS = []

    const select = document.querySelector('#levelSelect')

    let cardsNum

    let gameTime


    function createGame() {

        for (let i = 0; i < localStorage.length; i++) {

            const completedLevelsArr = JSON.parse(localStorage.getItem('Completed levels'))

            completedLevelsArr.forEach((completedSelectIndex) => {
                select[completedSelectIndex].classList.add('completedLevel')
            })
        }

        function createCardsBlock(rowsNum, cardsInRowNum) {

            for (let i = 0; i < rowsNum; i++) {
                const cardsBlock = document.querySelector('.cardsBlock')
                const cardsRow = document.createElement('div')

                if (rowsNum < 4) {
                    cardsBlock.classList.add('jcSpEvl')
                }
                else if (cardsInRowNum < rowsNum) {
                    cardsRow.classList.add('jcSpEvl')
                }

                cardsRow.classList.add('cardsRow')

                cardsBlock.append(cardsRow)

                for (let i = 0; i < cardsInRowNum; i++) {
                    const card = document.createElement('div')
                    card.classList.add('card')
                    cardsRow.append(card)
                }
            }


            cardsNum = rowsNum * cardsInRowNum

            for (let colorCount = 0; colorCount < cardsNum / 16; colorCount++) {

                let color

                switch (colorCount) {
                    case 0: color = 'blue_'
                        break
                    case 1: color = 'red_'
                        break
                    case 2: color = 'green_'
                        break
                    case 3: color = 'yellow_'
                        break
                }

                for (let i = 1; i <= 8; i++) {
                    cardsArrSh.push('<img src="images/' + color + i + '_large.png" alt="" class="img">')
                    cardsArrSh.push('<img src="images/' + color + i + '_large.png" alt="" class="img">')
                }
            }

        }


        const levelsBtn = document.querySelector('.levelsBtn')
        const selfBtn = document.querySelector('.selfBtn')

        selfBtn.addEventListener('click', () => {

            const inpRowsNum = +document.querySelector('#rowsNum').value
            const inpCardsInRowNum = +document.querySelector('#cardsInRowNum').value
            const inpTime = +document.querySelector('#time').value


            // check invalid self settings (inputs)
            const invalidMessage = document.querySelector('.invalidMessage')

            if ((inpRowsNum < 2 || inpRowsNum > 8 || isNaN(inpRowsNum)) || (inpCardsInRowNum < 2 || inpCardsInRowNum > 8 || isNaN(inpCardsInRowNum)) || (inpTime < 4 || inpTime > 1200 || isNaN(inpTime))) {
                return invalidMessage.textContent = 'The data you entered is invalid'
            }
            else if (inpRowsNum * inpCardsInRowNum % 2 !== 0) {
                return invalidMessage.textContent = 'There should be an even number of cards'
            }


            gameTime = inpTime

            createCardsBlock(inpRowsNum, inpCardsInRowNum, inpTime)

            startGame()

        })

        levelsBtn.addEventListener('click', () => {

            // Create cardBlock depending on select
            switch (select.selectedIndex) {

                case 0:
                    createCardsBlock(2, 4)

                    break

                case 1:
                    createCardsBlock(4, 4)

                    break

                case 2:
                    createCardsBlock(6, 6)

                    break

                case 3:
                    createCardsBlock(7, 6)

                    break
            }

            gameTime = select.value

            startGame()
        })

    }
    createGame()


    let isGameOver

    function startGame() {
        const userSettings = document.querySelector('.userSettings')
        userSettings.classList.add('displayNone')

        const game = document.querySelector('.game')
        game.classList.toggle('displayNone')

        createJS()
    }


    function createJS() {

        const cardsArrShLength = cardsArrSh.length

        for (let i = cardsNum; i < cardsArrShLength; i++) { cardsArrSh.pop() }


        const allCards = Array.prototype.slice.call(document.querySelectorAll('.cardsRow>div'))
        const winPairsArr = [];

        //      Shuffle
        (() => {
            for (let i = cardsArrSh.length - 1; i > 0; i--) {
                let tmp = cardsArrSh[i];
                let rnd = Math.floor(Math.random() * (i + 1));

                cardsArrSh[i] = cardsArrSh[rnd];
                cardsArrSh[rnd] = tmp;
            }
        })()


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


        // Close cards not contained in winPairsArr
        function closeAll() {
            allCards.forEach((el, i) => {
                if (!winPairsArr.includes(el.innerHTML)) { setCardValue.closed(i++) }
            })
        }
        // First close all cards
        closeAll()


        const timer = document.querySelector('.timer')
        timer.textContent = 'Remaining time: ' + gameTime



        // For allCards.forEach
        let lastCard
        let lastCardInnerHTML

        let timer1TimeCount = 0
        let openCardsCount = 0

        const winLastCardArr = []

        allCards.forEach((card, i) => {
            card.addEventListener('click', function openCards() {
                // After first card Click, start timer once 
                if (timer1TimeCount++ === 0) { setTimer(gameTime) }
                // console.log('openCardsCount = ' + openCardsCount)
                // console.log('lastCardInnerHTML = ' + lastCardInnerHTML)

                // Checks
                if (card === lastCard || isGameOver || winLastCardArr.includes(card) || card.classList.contains('opened')) { return }

                // Closing different cards
                if (openCardsCount === 2) {
                    closeAll()
                    openCardsCount = 0
                }

                //Opening card
                setCardValue.opened(i)

                // Winning card
                if (openCardsCount++ === 1 && card.innerHTML === lastCardInnerHTML) {

                    console.log('push')
                    card.removeEventListener('click', openCards)
                    //lastCard.removeEventListener('click', openCards)//?????????????????????????
                    winPairsArr.push(lastCardInnerHTML)
                    winLastCardArr.push(lastCard)

                    if (winPairsArr.length === cardsNum / 2) { gameComplete() }

                } else {
                    lastCardInnerHTML = card.innerHTML
                    lastCard = card
                }


                // console.log('card.innerHTML = ' + card.innerHTML)
                // console.log(winPairsArr)
                // console.log('---------------------------------------------------------------------------------------------------------------------------------------------')
            })
        });
    }



    // first timer view after view cardsBlock
    const timer = document.querySelector('.timer')


    let GameOverTimeoutID
    let GameDangTimeoutID

    function setTimer(time) {
        // Decrease timer 
        setInterval(() => {
            timer.textContent = 'Remaining time: ' + --time
        }, 1000)

        // Game over
        GameOverTimeoutID = setTimeout(() => {
            document.body.classList.toggle('bodyDang')
            gameOver()
        }, time * 1000);

        // Dangerous timer
        GameDangTimeoutID = setTimeout(() => {
            timer.classList.add('timerDang')
            document.body.classList.add('bodyDang')
        }, time * 800);
    }


    function gameComplete() {
        const finishText = document.querySelector('.finishText')
        const replay = document.querySelector('.replay')

        document.body.classList.add('bodyFinish')
        document.body.classList.remove('bodyDang')

        finishText.classList.remove('displayNone')

        replay.classList.add('replayDown')
        replay.textContent = 'Play again'

        completedLevelsArrLS.push(select.selectedIndex)
        localStorage.setItem('Completed levels', JSON.stringify(completedLevelsArrLS))

        timer.remove()

        clearTimeout(GameOverTimeoutID)
        clearTimeout(GameDangTimeoutID)
    }

    function gameOver() {

        const finishText = document.querySelector('.finishText')
        const replay = document.querySelector('.replay')

        document.body.classList.add('bodyLose')
        finishText.classList.remove('displayNone')
        finishText.textContent = 'Game over'
        replay.classList.add('replayDown')
        replay.textContent = 'Play again'

        timer.remove()

        clearTimeout(GameDangTimeoutID)

        isGameOver = true
    }
})

