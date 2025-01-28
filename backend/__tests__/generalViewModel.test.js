import { describe, it, expect, jest } from '@jest/globals';
import { getWelcomeMessage, getAllowedTables, getTablicaData, getTablicaById } from '../src/viewModels/generalViewModel.js';
import * as ERROR_CODE from '../src/utils/errorKodovi.js';
import dozvoljeneTablice from '../src/utils/dozvoljeneTablice.js';
import { queryDatabase } from '../src/models/pool.js';

jest.mock('../src/models/pool.js');
jest.mock('../src/utils/errorKodovi.js');

describe('generalViewModel', () => {
    describe('getWelcomeMessage', () => {
        it('should return welcome message', () => {
            const req = {};
            const res = {
                json: jest.fn(),
            };
            
            getWelcomeMessage(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Dobrodošli na API za ScheduleIT.",
            });
        });
    });

    describe('getAllowedTables', () => {
        it('should return allowed tables', () => {
            const req = {};
            const res = {
                json: jest.fn(),
            };

            getAllowedTables(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: {
                    "dozvoljene tablice": dozvoljeneTablice,
                },
            });
        });
    });


});