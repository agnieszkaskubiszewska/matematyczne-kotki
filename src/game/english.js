import { pick, randInt as r, shuffle } from './random.js'

// Słówka angielskie z zakresu klasy 3 (podstawa programowa, etap I):
// kolory, zwierzęta, jedzenie, rodzina, ciało, ubrania, szkoła, zabawki,
// dom, pogoda, dni tygodnia, miesiące, uczucia i liczby.
// Słowa w jednej grupie służą też jako złe odpowiedzi do wyboru,
// więc w grupie nie ma dwóch słów o tym samym znaczeniu.
const WORDS = {
  colors: [
    ['red', 'czerwony'],
    ['blue', 'niebieski'],
    ['green', 'zielony'],
    ['yellow', 'żółty'],
    ['black', 'czarny'],
    ['white', 'biały'],
    ['pink', 'różowy'],
    ['orange', 'pomarańczowy'],
    ['purple', 'fioletowy'],
    ['brown', 'brązowy'],
    ['grey', 'szary'],
  ],
  animals: [
    ['cat', 'kot'],
    ['dog', 'pies'],
    ['mouse', 'mysz'],
    ['rat', 'szczur'],
    ['horse', 'koń'],
    ['cow', 'krowa'],
    ['pig', 'świnia'],
    ['sheep', 'owca'],
    ['duck', 'kaczka'],
    ['fish', 'ryba'],
    ['bird', 'ptak'],
    ['rabbit', 'królik'],
    ['frog', 'żaba'],
    ['lion', 'lew'],
    ['monkey', 'małpa'],
    ['elephant', 'słoń'],
    ['bear', 'niedźwiedź'],
    ['tiger', 'tygrys'],
    ['snake', 'wąż'],
    ['spider', 'pająk'],
  ],
  food: [
    ['apple', 'jabłko'],
    ['banana', 'banan'],
    ['bread', 'chleb'],
    ['milk', 'mleko'],
    ['cheese', 'ser'],
    ['egg', 'jajko'],
    ['water', 'woda'],
    ['juice', 'sok'],
    ['cake', 'ciasto'],
    ['ice cream', 'lody'],
    ['soup', 'zupa'],
    ['carrot', 'marchewka'],
    ['potato', 'ziemniak'],
    ['tomato', 'pomidor'],
    ['orange', 'pomarańcza'],
    ['strawberry', 'truskawka'],
    ['chicken', 'kurczak'],
    ['sandwich', 'kanapka'],
  ],
  family: [
    ['mum', 'mama'],
    ['dad', 'tata'],
    ['sister', 'siostra'],
    ['brother', 'brat'],
    ['grandma', 'babcia'],
    ['grandpa', 'dziadek'],
    ['baby', 'niemowlę'],
    ['friend', 'przyjaciel'],
    ['aunt', 'ciocia'],
    ['uncle', 'wujek'],
  ],
  body: [
    ['head', 'głowa'],
    ['eye', 'oko'],
    ['ear', 'ucho'],
    ['nose', 'nos'],
    ['mouth', 'usta'],
    ['hand', 'ręka'],
    ['leg', 'noga'],
    ['foot', 'stopa'],
    ['hair', 'włosy'],
    ['tooth', 'ząb'],
    ['finger', 'palec'],
  ],
  clothes: [
    ['hat', 'czapka'],
    ['shoes', 'buty'],
    ['socks', 'skarpetki'],
    ['dress', 'sukienka'],
    ['skirt', 'spódnica'],
    ['trousers', 'spodnie'],
    ['T-shirt', 'koszulka'],
    ['jumper', 'sweter'],
    ['jacket', 'kurtka'],
    ['scarf', 'szalik'],
    ['gloves', 'rękawiczki'],
  ],
  school: [
    ['book', 'książka'],
    ['pen', 'długopis'],
    ['pencil', 'ołówek'],
    ['rubber', 'gumka'],
    ['ruler', 'linijka'],
    ['schoolbag', 'plecak'],
    ['desk', 'ławka'],
    ['chair', 'krzesło'],
    ['teacher', 'nauczyciel'],
    ['scissors', 'nożyczki'],
    ['crayon', 'kredka'],
    ['notebook', 'zeszyt'],
  ],
  toys: [
    ['ball', 'piłka'],
    ['doll', 'lalka'],
    ['teddy bear', 'miś'],
    ['kite', 'latawiec'],
    ['bike', 'rower'],
    ['car', 'samochód'],
    ['train', 'pociąg'],
    ['robot', 'robot'],
    ['puzzle', 'układanka'],
    ['balloon', 'balon'],
  ],
  home: [
    ['house', 'dom'],
    ['kitchen', 'kuchnia'],
    ['bathroom', 'łazienka'],
    ['bedroom', 'sypialnia'],
    ['garden', 'ogród'],
    ['door', 'drzwi'],
    ['window', 'okno'],
    ['bed', 'łóżko'],
    ['table', 'stół'],
    ['sofa', 'kanapa'],
    ['lamp', 'lampa'],
    ['clock', 'zegar'],
  ],
  weather: [
    ['sun', 'słońce'],
    ['rain', 'deszcz'],
    ['snow', 'śnieg'],
    ['wind', 'wiatr'],
    ['cloud', 'chmura'],
    ['hot', 'gorąco'],
    ['cold', 'zimno'],
    ['spring', 'wiosna'],
    ['summer', 'lato'],
    ['autumn', 'jesień'],
    ['winter', 'zima'],
  ],
  days: [
    ['Monday', 'poniedziałek'],
    ['Tuesday', 'wtorek'],
    ['Wednesday', 'środa'],
    ['Thursday', 'czwartek'],
    ['Friday', 'piątek'],
    ['Saturday', 'sobota'],
    ['Sunday', 'niedziela'],
  ],
  months: [
    ['January', 'styczeń'],
    ['February', 'luty'],
    ['March', 'marzec'],
    ['April', 'kwiecień'],
    ['May', 'maj'],
    ['June', 'czerwiec'],
    ['July', 'lipiec'],
    ['August', 'sierpień'],
    ['September', 'wrzesień'],
    ['October', 'październik'],
    ['November', 'listopad'],
    ['December', 'grudzień'],
  ],
  feelings: [
    ['happy', 'szczęśliwy'],
    ['sad', 'smutny'],
    ['angry', 'zły'],
    ['tired', 'zmęczony'],
    ['hungry', 'głodny'],
    ['scared', 'przestraszony'],
    ['big', 'duży'],
    ['small', 'mały'],
    ['old', 'stary'],
    ['new', 'nowy'],
    ['fast', 'szybki'],
    ['slow', 'wolny'],
  ],
}

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = { 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety', 100: 'one hundred' }

export function numberWord(n) {
  if (n < 20) return ONES[n]
  if (TENS[n]) return TENS[n]
  return `${TENS[n - (n % 10)]}-${ONES[n % 10]}`
}

const GROUPS = Object.keys(WORDS)

// Słowo i trzy inne z tej samej grupy jako złe odpowiedzi.
function choiceTask(rng, ask, options, correct) {
  const all = shuffle(rng, [correct, ...options])
  return { text: ask, kind: 'choice', options: all, answer: all.indexOf(correct) }
}

export function makeEnglishTask(rng) {
  // co piąte zadanie to liczba po angielsku, którą wpisuje się na klawiaturze
  if (rng() < 0.2) {
    const n = rng() < 0.5 ? r(rng, 11, 20) : r(rng, 2, 9) * 10 + r(rng, 0, 9)
    return { text: `Jaka to liczba: „${numberWord(n)}”?`, kind: 'number', answer: n }
  }
  const words = WORDS[pick(rng, GROUPS)]
  const [en, pl] = pick(rng, words)
  const others = shuffle(
    rng,
    words.filter(([e, p]) => e !== en && p !== pl),
  ).slice(0, 3)
  return rng() < 0.5
    ? choiceTask(rng, `Co znaczy „${en}”?`, others.map(([, p]) => p), pl)
    : choiceTask(rng, `Jak po angielsku jest „${pl}”?`, others.map(([e]) => e), en)
}

export const ENGLISH_WORD_COUNT = Object.values(WORDS).reduce((sum, w) => sum + w.length, 0)
