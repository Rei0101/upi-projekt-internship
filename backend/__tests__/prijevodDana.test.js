import prevoditelj from '../src/utils/prijevodDana.js';

describe('Prevoditelj dana', () => {

    describe('naHrvatski', () => {
    test('prevodi Monday u Ponedjeljak', () => {
      expect(prevoditelj.naHrvatski('Monday')).toBe('Ponedjeljak');
    });

    test('prevodi sve dane u tjednu na hrvatski', () => {
      const dani = {
        'Monday': 'Ponedjeljak',
        'Tuesday': 'Utorak',
        'Wednesday': 'Srijeda',
        'Thursday': 'Četvrtak',
        'Friday': 'Petak',
        'Saturday': 'Subota',
        'Sunday': 'Nedjelja'
      };

      Object.entries(dani).forEach(([engleski, hrvatski]) => {
        expect(prevoditelj.naHrvatski(engleski)).toBe(hrvatski);
      });
    });

    test('vraća "Netočan dan" za nepostojeći dan', () => {
      expect(prevoditelj.naHrvatski('InvalidDay')).toBe('Netočan dan');
    });
  });
  
  describe('naEngleski', () => {
    test('prevodi Ponedjeljak u Monday', () => {
      expect(prevoditelj.naEngleski('Ponedjeljak')).toBe('Monday');
    });

    test('prevodi sve dane u tjednu na engleski', () => {
      const dani = {
        'Ponedjeljak': 'Monday',
        'Utorak': 'Tuesday',
        'Srijeda': 'Wednesday',
        'Četvrtak': 'Thursday',
        'Petak': 'Friday',
        'Subota': 'Saturday',
        'Nedjelja': 'Sunday'
      };

      Object.entries(dani).forEach(([hrvatski, engleski]) => {
        expect(prevoditelj.naEngleski(hrvatski)).toBe(engleski);
      });
    });

    test('vraća "Netočan dan" za nepostojeći dan', () => {
      expect(prevoditelj.naEngleski('NepostojeciDan')).toBe('Netočan dan');
    });
  });


  
});