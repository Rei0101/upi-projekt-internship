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
    test('INVALID_EMAIL treba vratiti status 400 s ispravnim odgovorom', () => {
      INVALID_EMAIL(res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errorCode: "INVALID_EMAIL",
        message: "E-mail nije poslan.",
      });
    });
    test('NOT_AUTHORIZED treba vratiti status 401 s ispravnim odgovorom', () => {
      NOT_AUTHORIZED(res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errorCode: "NOT_AUTHORIZED",
        message: "Dogodila se greška pri provjeri valjanosti.",
      });
    });


  });