const request = require("supertest");
const app = require("../app");
const express = require("express");
const session = require('express-session');

require('dotenv').config();
const { testDbConfig } = require('../config');
const { connectDb, disconnectDb, clearDb }= require('../db/mongodb');
const Routine = require('../models/Routine')
const User = require('../models/User')
const Item = require('../models/ItemRoutine')

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
        const routine = Routine({ owner: owner, name: "asd", description: "qwer", items:[] })
        const routineStored = await routine.save()
        const id = routineStored._id.toString()
        const response = await request(app).delete(`/v1/routines/${id}`).send({routine: { _id: id }})

        expect(response.statusCode).toBe(204);
    });

    test("Crea rutina exitosamente sin items y la devuelve en una respuesta JSON", async () => {
        const owner = await User({ name: "Alguien", email: "alguien@ejemplo.com" }).save()
        const authenticatedApp = buildAuthenticatedApp(owner);
        const createRoutineResponse = await request(authenticatedApp)
            .post("/v1/routines")
            .send({name: "rutina de prueba 1",
                description: "asdasdasd",
                steps: 3,
                items:[],
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

    test("Crea rutina exitosamente con items y la devuelve en una respuesta JSON", async () => {
        const owner = await User({ name: "Alguien", email: "alguien@ejemplo.com" }).save()
        const item1=["1","Cronómetro", "", ""]
        const item2=["2","Cronómetro", "", ""]
        const itemsList = [item1, item2]
        const authenticatedApp = buildAuthenticatedApp(owner);
        const createRoutineResponse = await request(authenticatedApp)
            .post("/v1/routines")
            .send({name: "rutina de prueba 1",
                description: "asdasdasd",
                items:itemsList,
                alarm: ""})

        expect(createRoutineResponse.statusCode).toBe(201);
        const { routineStored } = createRoutineResponse.body
        expect(routineStored.name).toBe( "rutina de prueba 1");

        const listRoutinesResponse = await request(authenticatedApp).get("/v1/routines")

        expect(listRoutinesResponse.statusCode).toBe(200);
        const { routines } = listRoutinesResponse.body
        expect(routines?.length).toBe(1);
        expect(routines[0].name).toBe("rutina de prueba 1")
        expect(routines[0].items.length).toBe(2)
        expect(routines[0].items[1].type).toBe("Cronómetro")
    });

    test("Crea rutina con item erroneo", async () => {
        const owner = await User({ name: "Alguien", email: "alguien@ejemplo.com" }).save()
        const item1=["1","lala", "", ""]
        const itemsList = [item1]
        const authenticatedApp = buildAuthenticatedApp(owner);
        const createRoutineResponse = await request(authenticatedApp)
            .post("/v1/routines")
            .send({name: "rutina de prueba 1",
                description: "asdasdasd",
                items:itemsList,
                alarm: ""})

        expect(createRoutineResponse.statusCode).toBe(400);
        const { message } = createRoutineResponse.body
        expect(message).toBe("Error de validación de datos");

        const listRoutinesResponse = await request(authenticatedApp).get("/v1/routines")
        expect(listRoutinesResponse.statusCode).toBe(200);
    });

    test("Dada rutina con items, le edito nombre y los items exitosamente", async () => {
        const owner = await User({ name: "Alguien", email: "alguien@ejemplo.com" }).save()
        const item1=await Item ({order:"1",type:"Cronómetro", duration:""}).save()
        const item2=await Item ({order:"2",type:"Cronómetro", duration:""}).save()
        const itemsList = [item1, item2]
        const rutineToEdit = await Routine({owner:owner, name:"Soy rutina editable", description:"descripcion", items:itemsList}).save()

        const itemNuevo1=["1","Cronómetro", "", ""]
        const itemNuevo2=["2","Cuenta Regresiva", "00:50", ""]
        const itemNuevo3=["3","Cronómetro", "", ""]
        const newItemsList = [itemNuevo1, itemNuevo2, itemNuevo3]

        const authenticatedApp = buildAuthenticatedApp(owner);

        const updateRoutineResponse = await request(authenticatedApp)
            .put("/v1/routines/" + rutineToEdit._id)
            .send({_id:rutineToEdit._id,
                name: "Soy una rutina editada",
                description: "descripcion",
                items:newItemsList,
                alarm: ""})

        expect(updateRoutineResponse.statusCode).toBe(200);
        const { editedRoutine } = updateRoutineResponse.body
        expect(editedRoutine.name).toBe( "Soy una rutina editada");
        expect(editedRoutine.items.length).toBe(3)
    });
});
