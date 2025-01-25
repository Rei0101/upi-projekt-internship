import provjeraFormata from '../src/utils/provjeraFormata.js';

describe('provjeraFormata', () => {
    test('trebao bi vratiti null za ispravne formate datuma i vremena', () => {
        
        expect(provjeraFormata('2023-12-25', '09:30', '17:00')).toBeNull();
        expect(provjeraFormata('2024-01-01', '00:00', '23:59')).toBeNull();
    });

   
});