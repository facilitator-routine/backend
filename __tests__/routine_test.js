const request = require("supertest");
const app = require("../app");
const express = require("express");
const session = require('express-session');

require('dotenv').config();
const { testDbConfig } = require('../config');
const { connectDb, disconnectDb, clearDb }= require('../db/mongodb');
const Routine = require('../models/Routine')
const User = require('../models/User')

function buildAuthenticatedApp(user) {
    const mockApp = express();
    mockApp.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }));
    mockApp.all('*', function(req, res, next) {
        req.session.userId = user._id.toString();
        next();
    });
    mockApp.use(app);
    return mockApp;
}

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

    test("Elimino una rutina que no existe", async () => {
        const id = "cualquiera"
        const response = await request(app).delete(`/v1/routines/${id}`).send({routine: { _id: id }})

        expect(response.statusCode).toBe(404);
        const { message } = response.body
        expect(message).toBe("Rutina no encontrada");
    });

    test("Elimino una rutina exitosamente", async () => {
        const owner = await User({ name: "Alguien", email: "alguien@ejemplo.com" }).save()
        const routine = Routine({ owner: owner, name: "asd", description: "qwer" })
        const routineStored = await routine.save()
        const id = routineStored._id.toString()
        const response = await request(app).delete(`/v1/routines/${id}`).send({routine: { _id: id }})

        expect(response.statusCode).toBe(204);
    });

    test("Crea rutina exitosamente y la devuelve en una respuesta JSON", async () => {
        const owner = await User({ name: "Alguien", email: "alguien@ejemplo.com" }).save()
        const authenticatedApp = buildAuthenticatedApp(owner);
        const createRoutineResponse = await request(authenticatedApp)
            .post("/v1/routines")
            .send({name: "rutina de prueba 1",
                description: "asdasdasd",
                steps: 3,
                alarm: ""})

        expect(createRoutineResponse.statusCode).toBe(201);
        const { routineStored } = createRoutineResponse.body
        expect(routineStored.name).toBe( "rutina de prueba 1");

        const listRoutinesResponse = await request(authenticatedApp).get("/v1/routines")

        expect(listRoutinesResponse.statusCode).toBe(200);
        const { routines } = listRoutinesResponse.body
        expect(routines?.length).toBe(1);
        expect(routines[0].name).toBe("rutina de prueba 1")
    });
});
