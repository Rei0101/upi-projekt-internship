import provjeraFormata from '../src/utils/provjeraFormata.js';

describe('provjeraFormata', () => {
    test('trebao bi vratiti null za ispravne formate datuma i vremena', () => {
        
        expect(provjeraFormata('2023-12-25', '09:30', '17:00')).toBeNull();
        expect(provjeraFormata('2024-01-01', '00:00', '23:59')).toBeNull();
    });

    describe('validacija datuma', () => {
        test('trebao bi odbiti neispravan format datuma', () => {

            expect(provjeraFormata('25.12.2023', '09:00', '17:00'))
                .toBe('Datum mora biti u formatu YYYY-MM-DD.');
            expect(provjeraFormata('2023/12/25', '09:00', '17:00'))
                .toBe('Datum mora biti u formatu YYYY-MM-DD.');
            expect(provjeraFormata('25-12-2023', '09:00', '17:00'))
                .toBe('Datum mora biti u formatu YYYY-MM-DD.');
        });

        test('trebao bi odbiti kada su oba vremena neispravna', () => {
            expect(provjeraFormata('2023-12-25', '9:0', '5:0'))
                .toBe('Vrijeme mora biti u formatu HH:mm.');
            expect(provjeraFormata('2023-12-25', '', ''))
                .toBe('Vrijeme mora biti u formatu HH:mm.');
        });
    });


    describe('granični slučajevi', () => {
        test('trebao bi prihvatiti granične vrijednosti vremena', () => {
            expect(provjeraFormata('2023-12-25', '00:00', '23:59')).toBeNull();
        });
        
        test('trebao bi odbiti prazne vrijednosti', () => {
            expect(provjeraFormata('', '09:00', '17:00'))
                .toBe('Datum mora biti u formatu YYYY-MM-DD.');
            expect(provjeraFormata('2023-12-25', '', '17:00'))
                .toBe('Vrijeme mora biti u formatu HH:mm.');
        });
    });

   
});