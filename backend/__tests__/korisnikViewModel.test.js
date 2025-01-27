/* eslint-env jest */

import { getAllGroups } from "../src/viewModels/korisnikViewModel";
import { queryDatabase } from "../src/models/pool";
import * as ERROR_CODE from "../src/utils/errorKodovi";

jest.mock("../src/models/pool");
jest.mock("../src/utils/errorKodovi");

describe("getAllGroups", () => {
  let req, res;

  beforeEach(() => {
    req = {
      email: "test@example.com",
      userType: "student",
      params: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should return groups when id is provided", async () => {
    req.params.id = "1";
    queryDatabase.mockResolvedValueOnce([{ id: 1 }]);
    queryDatabase.mockResolvedValueOnce([{ group: "Group A" }]);

    await getAllGroups(req, res);

    expect(queryDatabase).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      grupe: [{ group: "Group A" }],
    });
  });

  it("should return groups for student when no id is provided", async () => {
    queryDatabase.mockResolvedValueOnce([{ id: 1 }]);
    queryDatabase.mockResolvedValueOnce([{ group: "Group A" }]);

    await getAllGroups(req, res);

    expect(queryDatabase).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      grupe: [{ group: "Group A" }],
    });
  });

  it("should return groups for profesor when no id is provided", async () => {
    req.userType = "profesor";
    queryDatabase.mockResolvedValueOnce([{ id: 1 }]);
    queryDatabase.mockResolvedValueOnce([{ group: "Group A" }]);

    await getAllGroups(req, res);

    expect(queryDatabase).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      grupe: [{ group: "Group A" }],
    });
  });

  it("should return NOT_FOUND when no groups are found", async () => {
    queryDatabase.mockResolvedValueOnce([]);
    queryDatabase.mockResolvedValueOnce([]);

    await getAllGroups(req, res);

    expect(queryDatabase).toHaveBeenCalledTimes(2);
    expect(ERROR_CODE.NOT_FOUND).toHaveBeenCalledWith(
      res,
      "Nisu nađeni kolegiji sa zadanim parametrima."
    );
  });

  it("should return INTERNAL_SERVER_ERROR when an error occurs", async () => {
    queryDatabase.mockRejectedValueOnce(new Error("Database error"));

    await getAllGroups(req, res);

    expect(queryDatabase).toHaveBeenCalledTimes(1);
    expect(ERROR_CODE.INTERNAL_SERVER_ERROR).toHaveBeenCalledWith(res);
  });
});