
class CardValidator {
    constructor() {
        this.numberPattern = /^\d+$/
        this.cardNumberPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/
        this.namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/
        this.cvvPattern = /^\d{3}$/
        this.expirationPattern = /^\d{2}\/\d{2}$/
    }
    
    isNumber(text) {
        return this.numberPattern.test(text)
    }
    isCardNumber(text) {
        return this.cardNumberPattern.test(text)
    }
    isName(text) {
        return this.namePattern.test(text)
    }
    isCVV(text) {
        return this.cvvPattern.test(text)
    }
    isExpiration(text) {
        return this.expirationPattern.test(text)
    }
    isNotExpired(month, year) {
        const today = new Date()
        if (year > today.getFullYear()) {
            return true
        } else if (year === today.getFullYear()) {
            if (month >= today.getMonth()) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

class Card {
    constructor() {
        this.cardElement = document.querySelector('.card')
        this.nameElement = document.querySelector('.card-name-text')
        this.numberElement = document.querySelector('.card-number-text')
        this.expirationElement = document.querySelector('.card-expiration-text')
        this.cvvElement = document.querySelector('.card-cvv-text')
    }

    changeName(text) {
        this.nameElement.textContent = text
    }

    changeNumber(text) {
        this.numberElement.textContent = text
    }

    changeExpiration(text) {
        this.expirationElement.textContent = text
    }

    changeCVV(text) {
        this.cvvElement.textContent = text
    }

}

class CardInput {
    constructor(selector, next) {
        this.input = document.querySelector(selector)
        this.next = next
        this.error = this.input.nextElementSibling
        this.card = new Card()
        this.validator = new CardValidator()
    }

    focus() {
        this.input.focus()
    }

    setError = (message) => {
        this.input.classList.add('error')
        this.error.textContent = message
    }

    removeError = () => {
        this.input.classList.remove('error')
        this.error.textContent = ''
    }

    get value() {
        return this.input.value
    }

    set value(newValue) {
        this.input.value = newValue
    }
}

class CardNameInput extends CardInput {
    constructor(selector, next) {
        super(selector, next)
        this.input.oninput = this.changeHandler
    }

    validate = () => {
        if (this.value && !this.validator.isName(this.value)) {
            this.setError('Adin yazilisi duzgun deyil!')
        } else {
            this.removeError()
        }
    }    

    changeHandler = () => {
        this.card.changeName(this.value)
        this.validate()
    }
}


class CardNumberInput extends CardInput {
    constructor(selector, next) {
        super(selector, next)
        this.input.oninput = this.changeHandler
    }

    validate = () => {
        if (this.value && !this.validator.isCardNumber(this.value)) {
            this.setError('Cartin yazilisi duzgun deyil!')
        } else {
            this.removeError()
        }
    }  

    changeHandler = () => {
        this.card.changeNumber(this.value)
        const length = this.value.length
        if (length < 19 && length > 3 && this.validator.isNumber(this.value.slice(-4)))
            this.value += '-'

        if (length === 19)
            this.next.focus()


        this.validate()
    }
}

class CardExpirationInput extends CardInput {
    constructor(selector, next) {
        super(selector, next)
        this.input.oninput = this.changeHandler
    }

    validate = () => {
        if (this.value && !this.validator.isExpiration(this.value)) {
            this.setError('Bitme tarixi yazilisi duzgun deyil!')
        } else {
            if (this.value) {
                const month = parseInt(this.value.split('/')[0])-1
                const year = parseInt('20' + this.value.split('/')[1])
                if (this.validator.isNotExpired(month, year)) {
                    this.removeError()
                } else {
                    this.setError('Bu kartin vaxti kecib!')
                }
            } else {
                this.removeError()
            }
        }
    }  

    changeHandler = () => {
        this.card.changeExpiration(this.value)

        const length = this.value.length
        if (length === 2 && this.validator.isNumber(this.value))
            this.value += '/'

        if (length === 5)
            this.next.focus()
        
        this.validate()
    }

}

class CardCVVInput extends CardInput {
    constructor(selector, next) {
        super(selector, next)
        this.input.oninput = this.changeHandler
    }

    validate = () => {
        if (this.value && !this.validator.isCVV(this.value)) {
            this.setError('Cartin yazilisi duzgun deyil!')
        } else {
            this.removeError()
        }
    }

    changeHandler = () => {
        this.card.changeCVV(this.value)
        this.validate()
    }
}


class Form {
    constructor() {
        this.name = new CardNameInput('.name-input')
        this.cvv = new CardCVVInput('.cvv-input')
        this.expiration = new CardExpirationInput('.expiration-input', this.cvv)
        this.number = new CardNumberInput('.number-input', this.expiration)
    }
}


const form = new Form()