import dozvoljeneTablice from '../src/utils/dozvoljeneTablice';

describe('dozvoljeneTablice', () => {
    test('treba biti niz', () => {
        expect(Array.isArray(dozvoljeneTablice)).toBe(true);
    });

    test('treba imati 9 elemenata', () => {
        expect(dozvoljeneTablice.length).toBe(9);
    });

    test('treba sadržavati specifične elemente', () => {
        const expectedElements = [
            "chat",
            "grupa",
            "kolegij",
            "kolegij_grupa_profesor",
            "profesor",
            "prostorija",
            "student",
            "studij",
            "termin",
        ];

        expectedElements.forEach(element => {
            expect(dozvoljeneTablice).toContain(element);
        });
    });

    test('ne smije sadržavati neočekivane elemente', () => {
        const unexpectedElements = [
            "nepostojeci_element",
            "drugi_element",
        ];

        unexpectedElements.forEach(element => {
            expect(dozvoljeneTablice).not.toContain(element);
        });
    });
});