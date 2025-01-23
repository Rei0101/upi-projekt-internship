// Testiranje errorKodovi.js datoteke

import {
    INVALID_TABLE_NAME,
    INVALID_EMAIL,
    RESOURCE_NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    NOT_AUTHORIZED
} from '../src/utils/errorKodovi.js'; 
 
import jest from 'jest-mock';
  describe('Funkcije za rukovanje greškama', () => {
    let res;
  
    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
  
    test('treba vratiti ispravan odgovor za INVALID_TABLE_NAME', () => {
      INVALID_TABLE_NAME(res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errorCode: "INVALID_TABLE_NAME",
        message: "Zadana tablica nije dozvoljena.",
      });
    });
    
  

  });