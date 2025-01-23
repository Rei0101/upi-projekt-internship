import {
  BAD_REQUEST,
  NOT_AUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
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

  test('treba vratiti ispravan odgovor za BAD_REQUEST', () => {
      BAD_REQUEST(res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
          success: false,
          errorCode: "BAD_REQUEST",
          message: "Unešeni podaci su neispravni.",
      });
  });

  test('NOT_AUTHORIZED treba vratiti status 401 s ispravnim odgovorom', () => {
      NOT_AUTHORIZED(res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
          success: false,
          errorCode: "NOT_AUTHORIZED",
          message: "Nije autoriziran pristup ovom resursu.",
      });
  });

  test('NOT_FOUND treba vratiti status 404 s ispravnim odgovorom', () => {
      NOT_FOUND(res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
          success: false,
          errorCode: "NOT_FOUND",
          message: "Nisu pronađeni traženi resursi.",
      });
  });

  test('INTERNAL_SERVER_ERROR treba vratiti status 500 s ispravnim odgovorom', () => {
      INTERNAL_SERVER_ERROR(res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
          success: false,
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "Greška pri dohvaćanju podataka.",
      });
  });
});