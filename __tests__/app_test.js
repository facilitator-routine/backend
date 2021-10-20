const request = require("supertest");
const app = require("../app");

require('dotenv').config();
const { testDbConfig } = require('../config');
const { connectDb, disconnectDb, clearDb }= require('../db/mongodb');

describe("Rutinas", () => {
    beforeAll(async () => {
        await connectDb(testDbConfig)
    })

    afterAll( done => {
        disconnectDb(done)
    })

    beforeEach(() => {
        clearDb()
    })

    test("Devuelve una respuesta JSON exitosa sin rutinas", async () => {
        const response = await request(app).get("/v1/routines")

        expect(response.statusCode).toBe(200);
        const { routines } = response.body
        expect(routines.length).toBe(0);
    });

    test("Crea rutina exitosamente y la devuelve en una respuesta JSON", async () => {
        const createRoutineResponse = await request(app)
            .post("/v1/routines")
            .send({name: "rutina de prueba 1",
                description: "asdasdasd",
                steps: 3,
                alarm: ""})

        expect(createRoutineResponse.statusCode).toBe(201);
        const { routineStored } = createRoutineResponse.body
        expect(routineStored.name).toBe( "rutina de prueba 1");

        const listRoutinesResponse = await request(app).get("/v1/routines")

        expect(listRoutinesResponse.statusCode).toBe(200);
        const { routines } = listRoutinesResponse.body
        expect(routines?.length).toBe(1);
        expect(routines[0].name).toBe("rutina de prueba 1")
    });
});
