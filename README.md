# Matematyczne Kotki

Gra matematyczna dla dzieci z 3 klasy szkoły podstawowej. 30-dniowe wyzwanie:
każdego dnia trzeba uratować jednego kotka przed 30 szczurami, rozwiązując
zadania matematyczne. Przed walką wybiera się kategorie zadań:

- **Liczenie:** dodawanie i odejmowanie do 300, mnożenie i dzielenie (np. 8 · 9, 63 : 7),
  kolejność działań, brakująca liczba,
- **Czas:** zegar (także zegar ze wskazówkami i „która będzie za 100 godzin”),
  kalendarz, podróże z dniem tygodnia i godziną przyjazdu,
- **Pieniądze i miary:** złote i grosze, długość, masa, pojemność,
- **Inne:** liczby rzymskie, obwód, zadania tekstowe.

Zasady:

- dobra odpowiedź – szczur ucieka,
- pierwsza zła odpowiedź – ostrzeżenie i druga szansa na to samo zadanie,
- druga zła odpowiedź – szczury podchodzą bliżej; po 3 takich błędach dopadają kotka,
- uratowane kotki mieszkają w pokoju, a te, których nie udało się uratować, trafiają na cmentarz,
- w menu „Trudne zadania” widać wszystkie zadania, przy których padła zła odpowiedź.

Postęp zapisuje się w przeglądarce (localStorage). Dodanie `?test` do adresu
włącza tryb testowy: można grać kilka razy dziennie i wyczyścić postęp.

## Uruchomienie

```bash
npm install
npm run dev
```

Po wypchnięciu na gałąź `main` GitHub Actions buduje grę i publikuje ją na GitHub Pages.
