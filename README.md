# Matematyczne Kotki

Gra matematyczna dla dzieci z 3 klasy szkoły podstawowej. 30-dniowe wyzwanie:
każdego dnia trzeba uratować jednego kotka przed 30 szczurami, rozwiązując
zadania z dodawania, odejmowania, mnożenia i dzielenia w zakresie 100.

- dobra odpowiedź – szczur ucieka,
- zła odpowiedź – szczury podchodzą bliżej; po 3 błędach dopadają kotka,
- uratowane kotki mieszkają w pokoju, a te, których nie udało się uratować, trafiają na cmentarz.

Postęp zapisuje się w przeglądarce (localStorage). Dodanie `?test` do adresu
włącza tryb testowy: można grać kilka razy dziennie i wyczyścić postęp.

## Uruchomienie

```bash
npm install
npm run dev
```

Po wypchnięciu na gałąź `main` GitHub Actions buduje grę i publikuje ją na GitHub Pages.
